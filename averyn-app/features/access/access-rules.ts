import type {
  AccessDirection,
  AccessFactor,
  AccessMethod,
  AccessRequest,
  Checkpoint,
  CheckpointDirection,
  DenyReason,
  EventStatus,
  PolicyGroup,
  SimulatedOutcome,
} from "./types";

/**
 * Reglas puras del control en puerta: qué paso toca, en qué orden se comprueba un acceso y cómo se
 * valida lo que llega del navegador. No hay red ni estado aquí: el servicio y las pantallas las usan.
 */

/** Largo máximo de un código QR aceptado (evita cuerpos enormes desde el navegador). */
export const QR_CODE_MAX_LENGTH = 64;

const METHODS: readonly AccessMethod[] = ["QR", "FACE", "FINGERPRINT"];
const OUTCOMES: readonly SimulatedOutcome[] = ["match", "no_match", "liveness_failed", "unavailable"];
const MAX_FACTORS = 4;

/** Paso que corresponde dar al operador según la política y lo que ya se verificó. */
export type GateStep =
  | { kind: "identify"; methods: PolicyGroup }
  | { kind: "factor"; methods: PolicyGroup; groupIndex: number }
  | { kind: "pick-inside" }
  | { kind: "submit" };

/**
 * Deja el código QR como lo guarda el servicio: sin espacios ni saltos de línea (los lectores USB
 * suelen añadir un salto al final) y en mayúsculas.
 *
 * @param raw - Texto leído o escrito por el operador.
 * @returns El código normalizado, o cadena vacía si no hay nada.
 */
export function normalizeQrCode(raw: string): string {
  // eslint-disable-next-line no-control-regex
  return raw.replace(/[\s\u0000-\u001f]/g, "").toUpperCase().slice(0, QR_CODE_MAX_LENGTH);
}

/**
 * Cuántos grupos de la política ya cumplen los factores aportados, en orden.
 *
 * Cada factor cumple a lo sumo un grupo; un grupo se cumple con cualquiera de sus métodos.
 *
 * @param policy - Grupos de la política del punto de control.
 * @param factors - Factores ya verificados.
 * @returns Cantidad de grupos consecutivos cumplidos desde el primero.
 */
export function satisfiedGroups(policy: readonly PolicyGroup[], factors: readonly AccessFactor[]): number {
  const pending = [...factors];
  let satisfied = 0;
  for (const group of policy) {
    const index = pending.findIndex((factor) => group.includes(factor.method));
    if (index === -1) break;
    pending.splice(index, 1);
    satisfied += 1;
  }
  return satisfied;
}

/**
 * Paso siguiente del operador.
 *
 * - Sin identificar, el primer grupo identifica: con QR se lee el código; con biometría se busca
 *   1:N y el operador confirma.
 * - Con la persona identificada, cada grupo restante se verifica 1:1 contra ella.
 * - Una salida sin política solo pide elegir quién sale de entre quienes están dentro.
 *
 * @param policy - Grupos de la política.
 * @param factors - Factores ya aportados.
 * @param identified - Si ya se sabe quién es la persona.
 * @returns El paso que toca.
 */
export function nextStep(policy: readonly PolicyGroup[], factors: readonly AccessFactor[], identified: boolean): GateStep {
  if (policy.length === 0) return identified ? { kind: "submit" } : { kind: "pick-inside" };
  const done = satisfiedGroups(policy, factors);
  if (done >= policy.length) return { kind: "submit" };
  const methods = policy[done] ?? [];
  return identified ? { kind: "factor", methods, groupIndex: done } : { kind: "identify", methods };
}

/**
 * Sentidos que el operador puede elegir en un punto de control.
 *
 * @param direction - Sentido del punto.
 * @returns Uno solo, o los dos si el punto atiende ambos.
 */
export function directionsOf(direction: CheckpointDirection): AccessDirection[] {
  return direction === "BOTH" ? ["ENTRY", "EXIT"] : [direction];
}

/** Datos necesarios para decidir un acceso antes de gastar una verificación biométrica. */
export interface PrecheckContext {
  eventStatus: EventStatus;
  /** `undefined` si la persona no figura en el padrón. */
  attendee: { admitted: boolean; inside: boolean } | undefined;
  direction: AccessDirection;
  inside: number;
  capacity: number;
}

/**
 * Comprobaciones previas, en el orden de `11-access-architecture.md` §6 (fail-fast antes de la
 * biometría): evento abierto, padrón, anti-passback y aforo.
 *
 * @param context - Estado del evento y de la persona.
 * @returns El primer motivo de denegación, o `undefined` si puede continuar a los factores.
 */
export function precheck(context: PrecheckContext): DenyReason | undefined {
  if (context.eventStatus !== "LIVE") return "EVENT_NOT_LIVE";
  if (context.attendee === undefined || !context.attendee.admitted) return "NOT_ADMITTED";
  if (context.direction === "ENTRY" && context.attendee.inside) return "ALREADY_INSIDE";
  if (context.direction === "EXIT" && !context.attendee.inside) return "NOT_INSIDE";
  if (context.direction === "ENTRY" && context.inside >= context.capacity) return "CAPACITY_FULL";
  return undefined;
}

/**
 * Indica si un punto de control puede concluir con los factores aportados.
 *
 * @param checkpoint - Punto de control.
 * @param factors - Factores del intento.
 * @returns `true` si cada grupo de la política tiene un factor.
 */
export function coversPolicy(checkpoint: Checkpoint, factors: readonly AccessFactor[]): boolean {
  return satisfiedGroups(checkpoint.policy, factors) >= checkpoint.policy.length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseFactor(value: unknown): AccessFactor | undefined {
  if (!isRecord(value) || typeof value.method !== "string") return undefined;
  const method = METHODS.find((candidate) => candidate === value.method);
  if (method === undefined) return undefined;
  if (method === "QR") {
    const code = typeof value.code === "string" ? normalizeQrCode(value.code) : "";
    return code === "" ? undefined : { method, code };
  }
  const capture = value.capture;
  if (!isRecord(capture)) return undefined;
  const simulate = OUTCOMES.find((outcome) => outcome === capture.simulate);
  if (simulate === undefined) return undefined;
  const presenter = typeof capture.presenter === "string" && capture.presenter !== "" ? capture.presenter.slice(0, 40) : undefined;
  return { method, capture: { simulate, ...(presenter === undefined ? {} : { presenter }) }, operatorConfirmed: value.operatorConfirmed === true };
}

/**
 * Lee una petición de acceso que llegó del navegador.
 *
 * @param value - Dato sin tipar.
 * @returns La petición válida, o `undefined` si falta algo o algo no es del tipo esperado.
 */
export function parseAccessRequest(value: unknown): AccessRequest | undefined {
  if (!isRecord(value)) return undefined;
  const { checkpointId, personId, direction, factors } = value;
  if (typeof checkpointId !== "string" || typeof personId !== "string" || checkpointId === "" || personId === "") return undefined;
  if (direction !== "ENTRY" && direction !== "EXIT") return undefined;
  if (!Array.isArray(factors) || factors.length > MAX_FACTORS) return undefined;
  const parsed = factors.map(parseFactor);
  if (parsed.some((factor) => factor === undefined)) return undefined;
  return { checkpointId, personId, direction, factors: parsed.filter((factor): factor is AccessFactor => factor !== undefined) };
}
