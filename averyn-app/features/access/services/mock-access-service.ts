import { AFFILIATION_LABEL } from "@/features/identity/labels";
import { personService } from "@/features/identity/services";

import { coversPolicy, directionsOf, precheck } from "../access-rules";
import { DEMO_CHECKPOINTS, DEMO_EVENT, seedAttendees, seedQrCodes, type MockAttendee, type MockQrCode } from "../mock-access";
import type {
  AccessDirection,
  AccessEvent,
  AccessFactor,
  AccessLogEntry,
  AccessRequest,
  AccessResult,
  Candidate,
  Checkpoint,
  DenyReason,
  IdentifyResult,
  Occupancy,
  SimulatedOutcome,
} from "../types";
import { InvalidAccessRequestError, type AccessService } from "./access-service";

/** Cuántos intentos conserva el mock (el Core los guarda todos). */
const LOG_LIMIT = 50;
/** Cuántas personas propone una identificación 1:N. */
const CANDIDATE_LIMIT = 3;

interface AccessStore {
  attendees: MockAttendee[];
  codes: Record<string, MockQrCode>;
  log: AccessLogEntry[];
  lastLogId: number;
  entries: number;
  exits: number;
}

declare global {
  /** Almacén del mock en `globalThis`: Next.js puede cargar este módulo varias veces y todas deben ver lo mismo. */
  var averynMockAccess: AccessStore | undefined;
}

function store(): AccessStore {
  globalThis.averynMockAccess ??= { attendees: seedAttendees(), codes: seedQrCodes(), log: [], lastLogId: 1040, entries: 3, exits: 1 };
  return globalThis.averynMockAccess;
}

/**
 * [MOCK] Vuelve el control en puerta al estado inicial de la demostración.
 * TODO(AVY-048): retirar junto con el panel de demostración cuando el servicio sea el del Core.
 */
export function resetMockAccess(): void {
  globalThis.averynMockAccess = undefined;
}

function findCheckpoint(checkpointId: string): Checkpoint {
  const checkpoint = DEMO_CHECKPOINTS.find((candidate) => candidate.id === checkpointId);
  if (checkpoint === undefined) throw new InvalidAccessRequestError("El punto de control no existe.");
  return checkpoint;
}

function insideCount(current: AccessStore): number {
  return current.attendees.filter((attendee) => attendee.inside).length;
}

/** Sentido con el que se registra un intento que no lo indica (una identificación). */
function defaultDirection(checkpoint: Checkpoint): AccessDirection {
  return directionsOf(checkpoint.direction)[0] ?? "ENTRY";
}

/**
 * Resultado de un factor biométrico simulado contra una persona.
 *
 * @returns El motivo de denegación, o `undefined` si la verificación coincide.
 */
function biometricReason(factor: Extract<AccessFactor, { capture: unknown }>, attendee: MockAttendee): DenyReason | undefined {
  if (!attendee.enrolled.includes(factor.method)) return "ENROLLMENT_MISSING";
  switch (factor.capture.simulate) {
    case "unavailable":
      return "VERIFICATION_ERROR";
    case "liveness_failed":
      return "LIVENESS_FAILED";
    case "no_match":
      return "NO_MATCH";
    case "match":
      return (factor.capture.presenter ?? attendee.personId) === attendee.personId ? undefined : "NO_MATCH";
  }
}

/** Resultado de un factor QR contra la persona que se está atendiendo. */
function qrReason(code: string, attendee: MockAttendee, codes: Record<string, MockQrCode>): DenyReason | undefined {
  const entry = codes[code];
  if (entry === undefined) return "QR_INVALID";
  if (entry.personId !== attendee.personId) return "IDENTITY_MISMATCH";
  if (entry.status === "expired") return "QR_EXPIRED";
  if (entry.status === "used") return "QR_USED";
  return undefined;
}

/**
 * [MOCK] Control en puerta en memoria del servidor: se pierde al reiniciarlo.
 * TODO(AVY-048): reemplazar por un servicio que llame al Core (`identify` y `access-requests`).
 */
export class MockAccessService implements AccessService {
  async getEvent(): Promise<AccessEvent> {
    return { ...DEMO_EVENT };
  }

  async listCheckpoints(_eventId: string): Promise<Checkpoint[]> {
    return DEMO_CHECKPOINTS.map((checkpoint) => ({ ...checkpoint }));
  }

  async getOccupancy(_eventId: string): Promise<Occupancy> {
    const current = store();
    return { capacity: DEMO_EVENT.capacity, inside: insideCount(current), entries: current.entries, exits: current.exits };
  }

  async listRecent(_eventId: string, limit: number): Promise<AccessLogEntry[]> {
    return store().log.slice(0, limit).map((entry) => ({ ...entry }));
  }

  async listInside(_eventId: string): Promise<Candidate[]> {
    const inside = store().attendees.filter((attendee) => attendee.inside);
    const candidates = await Promise.all(inside.map((attendee) => this.candidateOf(attendee.personId)));
    return candidates.filter((candidate): candidate is Candidate => candidate !== undefined);
  }

  async identify(checkpointId: string, factor: AccessFactor): Promise<IdentifyResult> {
    const checkpoint = findCheckpoint(checkpointId);
    const current = store();

    if (factor.method === "QR") {
      const entry = current.codes[factor.code];
      const candidate = entry === undefined ? undefined : await this.candidateOf(entry.personId);
      if (entry === undefined || candidate === undefined) return this.rejectIdentity(checkpoint, "QR_INVALID", null);
      if (entry.status === "expired") return this.rejectIdentity(checkpoint, "QR_EXPIRED", candidate.displayName);
      // Un código ya usado sí identifica: lo deniega `requestAccess` (`QR_USED`) tras el anti-passback.
      return { identified: true, personId: candidate.personId, displayName: candidate.displayName, candidates: [], requiresOperatorConfirmation: false };
    }

    const reason = this.simulatedFailure(factor.capture.simulate);
    if (reason !== undefined) return this.rejectIdentity(checkpoint, reason, null);
    const gallery = current.attendees.filter((attendee) => attendee.enrolled.includes(factor.method));
    const presenter = factor.capture.presenter;
    const ordered = [...gallery].sort((a, b) => Number(b.personId === presenter) - Number(a.personId === presenter));
    const candidates = (await Promise.all(ordered.slice(0, CANDIDATE_LIMIT).map((attendee) => this.candidateOf(attendee.personId)))).filter(
      (candidate): candidate is Candidate => candidate !== undefined,
    );
    if (candidates.length === 0) return this.rejectIdentity(checkpoint, "NO_MATCH", null);
    return { identified: false, candidates, requiresOperatorConfirmation: true };
  }

  async requestAccess(request: AccessRequest): Promise<AccessResult> {
    const checkpoint = findCheckpoint(request.checkpointId);
    if (!directionsOf(checkpoint.direction).includes(request.direction)) {
      throw new InvalidAccessRequestError("Este punto de control no atiende ese sentido.");
    }
    if (!coversPolicy(checkpoint, request.factors)) {
      throw new InvalidAccessRequestError("Faltan factores de la política del punto de control.");
    }
    const person = await personService.getById(request.personId);
    const current = store();
    const attendee = current.attendees.find((candidate) => candidate.personId === request.personId);
    const personName = person?.name ?? "Persona desconocida";

    const denyReason =
      precheck({
        eventStatus: DEMO_EVENT.status,
        attendee: attendee === undefined ? undefined : { admitted: attendee.admitted, inside: attendee.inside },
        direction: request.direction,
        inside: insideCount(current),
        capacity: DEMO_EVENT.capacity,
      }) ?? (attendee === undefined ? "NOT_ADMITTED" : this.factorsReason(checkpoint, request.factors, attendee, current.codes));

    if (denyReason === undefined && attendee !== undefined) {
      attendee.inside = request.direction === "ENTRY";
      if (request.direction === "ENTRY") {
        current.entries += 1;
        for (const factor of request.factors) {
          const entry = factor.method === "QR" ? current.codes[factor.code] : undefined;
          if (entry !== undefined) entry.status = "used";
        }
      } else {
        current.exits += 1;
      }
    }

    const entry = this.record(checkpoint, request.direction, personName, denyReason);
    return { decision: entry.decision, denyReason: entry.denyReason, accessLogId: entry.id, occupancy: insideCount(current), personName };
  }

  /** Primer grupo de la política que no se cumple, o `undefined` si todos se cumplen. */
  private factorsReason(checkpoint: Checkpoint, factors: AccessFactor[], attendee: MockAttendee, codes: Record<string, MockQrCode>): DenyReason | undefined {
    const pending = [...factors];
    for (const group of checkpoint.policy) {
      const index = pending.findIndex((candidate) => group.includes(candidate.method));
      if (index === -1) return "VERIFICATION_ERROR";
      const [factor] = pending.splice(index, 1);
      if (factor === undefined) return "VERIFICATION_ERROR";
      const reason = factor.method === "QR" ? qrReason(factor.code, attendee, codes) : biometricReason(factor, attendee);
      if (reason !== undefined) return reason;
    }
    return undefined;
  }

  private simulatedFailure(outcome: SimulatedOutcome): DenyReason | undefined {
    if (outcome === "unavailable") return "VERIFICATION_ERROR";
    if (outcome === "liveness_failed") return "LIVENESS_FAILED";
    if (outcome === "no_match") return "NO_MATCH";
    return undefined;
  }

  private rejectIdentity(checkpoint: Checkpoint, reason: DenyReason, personName: string | null): IdentifyResult {
    this.record(checkpoint, defaultDirection(checkpoint), personName, reason);
    return { identified: false, candidates: [], requiresOperatorConfirmation: false, reason };
  }

  private async candidateOf(personId: string): Promise<Candidate | undefined> {
    const person = await personService.getById(personId);
    return person === undefined ? undefined : { personId, displayName: person.name, detail: AFFILIATION_LABEL[person.affiliation] };
  }

  /** Añade el intento al registro. No guarda imágenes, plantillas ni el valor del QR. */
  private record(checkpoint: Checkpoint, direction: AccessDirection, personName: string | null, denyReason: DenyReason | undefined): AccessLogEntry {
    const current = store();
    current.lastLogId += 1;
    const entry: AccessLogEntry = {
      id: current.lastLogId,
      at: new Date().toISOString(),
      checkpointName: checkpoint.name,
      direction,
      personName,
      decision: denyReason === undefined ? "GRANTED" : "DENIED",
      denyReason: denyReason ?? null,
    };
    current.log = [entry, ...current.log].slice(0, LOG_LIMIT);
    return entry;
  }
}
