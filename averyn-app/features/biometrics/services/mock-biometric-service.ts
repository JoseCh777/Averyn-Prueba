import { connectedDeviceFor, eventResultOf, newestFirst, outcomeFromRandom, simulatedScore } from "../biometric-rules";
import { seedDevices, seedEvents, seedProfiles } from "../mock-biometrics";
import type { BiometricDevice, BiometricEvent, BiometricProfile } from "../types";
import type { BiometricService, OperationInput } from "./biometric-service";

/** Lo que guarda el mock, y el último número de evento entregado (nunca retrocede). */
interface BiometricStore {
  profiles: BiometricProfile[];
  events: BiometricEvent[];
  devices: BiometricDevice[];
  lastEventNumber: number;
}

declare global {
  /** Almacén del mock en `globalThis`: Next.js puede cargar este módulo varias veces y todas deben ver lo mismo. */
  var averynMockBiometrics: BiometricStore | undefined;
}

/** Institución que registra el mock en cada evento (saldrá de la sesión cuando exista). */
const MOCK_INSTITUTION = "Sede Central";

function store(): BiometricStore {
  if (globalThis.averynMockBiometrics === undefined) {
    const events = seedEvents();
    globalThis.averynMockBiometrics = { profiles: seedProfiles(), events, devices: seedDevices(), lastEventNumber: events.length };
  }
  return globalThis.averynMockBiometrics;
}

/**
 * [MOCK] Servicio biométrico en memoria del servidor: se pierde al reiniciarlo.
 * El desenlace de la verificación es aleatorio (60 % éxito, 25 % fallo, 15 % reintento); `random`
 * se puede inyectar para probarlo. La plantilla biométrica no existe: solo se anota que se registró.
 * TODO(AVY-009): reemplazar por un servicio que llame al Core.
 */
export class MockBiometricService implements BiometricService {
  constructor(private readonly random: () => number = Math.random) {}

  async listProfiles(): Promise<BiometricProfile[]> {
    return store().profiles.map((profile) => ({ ...profile }));
  }

  async getProfile(personId: string): Promise<BiometricProfile | undefined> {
    const profile = store().profiles.find((candidate) => candidate.personId === personId);
    return profile === undefined ? undefined : { ...profile };
  }

  async listEvents(): Promise<BiometricEvent[]> {
    return newestFirst(store().events).map((event) => ({ ...event }));
  }

  async getEvent(id: string): Promise<BiometricEvent | undefined> {
    const event = store().events.find((candidate) => candidate.id === id);
    return event === undefined ? undefined : { ...event };
  }

  async listDevices(): Promise<BiometricDevice[]> {
    return store().devices.map((device) => ({ ...device }));
  }

  async enroll(input: OperationInput): Promise<BiometricEvent> {
    const current = store();
    const device = connectedDeviceFor(current.devices, input.method);
    if (device !== undefined) {
      const now = new Date().toISOString();
      const existing = current.profiles.find((profile) => profile.personId === input.personId);
      const modality = input.method === "face" ? { face: true } : { fingerprint: true };
      if (existing === undefined) {
        current.profiles.push({ personId: input.personId, face: false, fingerprint: false, ...modality, registeredAt: now });
      } else {
        Object.assign(existing, modality, { registeredAt: now });
      }
    }
    return this.record(input, "enrollment", device?.id, device === undefined ? "device" : "success");
  }

  async verify(input: OperationInput): Promise<BiometricEvent> {
    const device = connectedDeviceFor(store().devices, input.method);
    if (device === undefined) return this.record(input, "verification", undefined, "device");
    const outcome = outcomeFromRandom(this.random());
    return this.record(input, "verification", device.id, eventResultOf(outcome), simulatedScore(outcome, this.random()));
  }

  /** Agrega un evento al historial. Sin dispositivo conectado se anota el primero de esa modalidad. */
  private record(
    input: OperationInput,
    operation: BiometricEvent["operation"],
    connectedDeviceId: string | undefined,
    result: BiometricEvent["result"],
    score?: number,
  ): BiometricEvent {
    const current = store();
    current.lastEventNumber += 1;
    const deviceId = connectedDeviceId ?? current.devices.find((device) => device.kind === input.method)?.id ?? "—";
    const event: BiometricEvent = {
      id: `ev-${String(current.lastEventNumber).padStart(4, "0")}`,
      personId: input.personId,
      operation,
      method: input.method,
      result,
      deviceId,
      operator: input.operator,
      institution: MOCK_INSTITUTION,
      at: new Date().toISOString(),
      ...(score === undefined ? {} : { score }),
    };
    current.events.push(event);
    return { ...event };
  }
}
