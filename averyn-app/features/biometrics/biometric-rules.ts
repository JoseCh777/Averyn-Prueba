import { DEVICE_UNAVAILABLE, EVENT_RESULTS, METHODS } from "./labels";
import type {
  BiometricDevice,
  BiometricEvent,
  BiometricMethod,
  BiometricProfile,
  BiometricsSummary,
  CaptureContext,
  CaptureMode,
  EventResult,
  HistoryFilter,
  VerificationOutcome,
} from "./types";

/**
 * Reglas del módulo de Biometría: presentación, disponibilidad de modalidades y la simulación del
 * desenlace. La decisión real (coincidencia, umbral) la toma el Core (AGENTS §6).
 */

/** Umbral de similitud (0,68 sobre 1). Lo fija el servidor; aquí solo se muestra. */
export const VERIFICATION_THRESHOLD = 68;

/** Probabilidad de que una captura no sirva (simulación). */
export const CAPTURE_FAILURE_PROBABILITY = 0.15;

const SUCCESS_BELOW = 0.6;
const FAILURE_BELOW = 0.85;

/**
 * Interpreta una modalidad recibida de la URL.
 *
 * @param value - Valor sin validar.
 * @returns La modalidad, o `undefined` si no es una conocida.
 */
export function parseMethod(value: unknown): BiometricMethod | undefined {
  return METHODS.find((method) => method === value);
}

/**
 * Interpreta el modo de una captura recibido de la URL.
 *
 * @param value - Valor sin validar.
 * @returns El modo, o `undefined` si no es uno conocido.
 */
export function parseMode(value: unknown): CaptureMode | undefined {
  return value === "enrollment" || value === "verification" ? value : undefined;
}

/**
 * Interpreta el contexto de una captura (modo, persona y modalidad) recibido de la URL.
 *
 * @param params - Parámetros sin validar.
 * @returns El contexto, o `undefined` si falta algo o no es válido.
 */
export function parseCaptureContext(params: { mode?: unknown; person?: unknown; method?: unknown }): CaptureContext | undefined {
  const mode = parseMode(params.mode);
  const method = parseMethod(params.method);
  const personId = typeof params.person === "string" && params.person !== "" ? params.person : undefined;
  if (mode === undefined || method === undefined || personId === undefined) return undefined;
  return { mode, personId, method };
}

/**
 * Interpreta los filtros del historial recibidos de la URL (cualquier valor desconocido equivale a «todos»).
 *
 * @param params - Parámetros sin validar.
 * @returns Los filtros.
 */
export function parseHistoryFilter(params: { method?: unknown; result?: unknown }): HistoryFilter {
  return {
    method: parseMethod(params.method) ?? "all",
    result: EVENT_RESULTS.find((result): result is EventResult => result === params.result) ?? "all",
  };
}

/**
 * Filtra eventos por método y resultado.
 *
 * @param events - Eventos de origen.
 * @param filter - Filtros; `all` acepta cualquier valor.
 * @returns Los eventos que cumplen ambos criterios, en el mismo orden.
 */
export function filterEvents(events: readonly BiometricEvent[], filter: HistoryFilter): BiometricEvent[] {
  return events.filter((event) => (filter.method === "all" || event.method === filter.method) && (filter.result === "all" || event.result === filter.result));
}

/**
 * Eventos del más reciente al más antiguo.
 *
 * @param events - Eventos en cualquier orden.
 * @returns Una copia ordenada.
 */
export function newestFirst(events: readonly BiometricEvent[]): BiometricEvent[] {
  return [...events].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

/**
 * Cuenta lo que muestran los indicadores. Cada cifra es un conteo de los datos de origen.
 *
 * @param source - Número de personas, perfiles, eventos y dispositivos.
 * @returns Los conteos y la tasa de éxito (`null` si aún no hay verificaciones).
 */
export function summarizeBiometrics(source: {
  totalPeople: number;
  profiles: readonly BiometricProfile[];
  events: readonly BiometricEvent[];
  devices: readonly BiometricDevice[];
}): BiometricsSummary {
  const verifications = source.events.filter((event) => event.operation === "verification");
  const successful = verifications.filter((event) => event.result === "success").length;
  return {
    peopleWithBiometrics: source.profiles.filter((profile) => profile.face || profile.fingerprint).length,
    totalPeople: source.totalPeople,
    verifications: verifications.length,
    successful,
    rejected: verifications.filter((event) => event.result === "rejected").length,
    successRate: verifications.length === 0 ? null : Math.round((successful / verifications.length) * 100),
    connectedDevices: source.devices.filter((device) => device.status === "connected").length,
    totalDevices: source.devices.length,
  };
}

/** Si una modalidad se puede elegir y, si no, por qué. */
export type Availability = { available: true } | { available: false; reason: string };

/**
 * Decide si se puede usar una modalidad para una persona.
 *
 * Hace falta un dispositivo conectado de esa modalidad; para verificar, además, la persona debe
 * tener esa modalidad registrada.
 *
 * @param params - Operación, modalidad, perfil de la persona (o `undefined` si no tiene) y dispositivos.
 * @returns Si está disponible o el motivo en palabras de la persona.
 */
export function methodAvailability(params: {
  mode: CaptureMode;
  method: BiometricMethod;
  profile: Pick<BiometricProfile, "face" | "fingerprint"> | undefined;
  devices: readonly BiometricDevice[];
}): Availability {
  if (params.mode === "verification") {
    const registered = params.method === "face" ? params.profile?.face === true : params.profile?.fingerprint === true;
    if (!registered) return { available: false, reason: "No registrado para esta persona" };
  }
  const hasDevice = params.devices.some((device) => device.kind === params.method && device.status === "connected");
  return hasDevice ? { available: true } : { available: false, reason: DEVICE_UNAVAILABLE };
}

/**
 * Primer dispositivo conectado de una modalidad.
 *
 * @param devices - Todos los dispositivos.
 * @param method - Modalidad.
 * @returns El dispositivo, o `undefined` si no hay ninguno conectado.
 */
export function connectedDeviceFor(devices: readonly BiometricDevice[], method: BiometricMethod): BiometricDevice | undefined {
  return devices.find((device) => device.kind === method && device.status === "connected");
}

/**
 * Decide el desenlace simulado de una verificación: 60 % éxito, 25 % fallo y 15 % reintento.
 *
 * @param random - Número entre 0 (incluido) y 1 (excluido).
 * @returns El desenlace.
 */
export function outcomeFromRandom(random: number): VerificationOutcome {
  if (random < SUCCESS_BELOW) return "success";
  if (random < FAILURE_BELOW) return "failure";
  return "retry";
}

/**
 * Resultado del evento que corresponde a un desenlace.
 *
 * @param outcome - Desenlace de la verificación.
 * @returns El resultado que se guarda en el historial.
 */
export function eventResultOf(outcome: VerificationOutcome): EventResult {
  return outcome === "failure" ? "rejected" : outcome;
}

/**
 * Similitud simulada de una verificación: sobre el umbral si salió bien, bajo el umbral si no.
 * Un reintento no llega a comparar, así que no tiene similitud.
 *
 * @param outcome - Desenlace de la verificación.
 * @param random - Número entre 0 (incluido) y 1 (excluido).
 * @returns La similitud de 0 a 100, o `undefined` si no hubo comparación.
 */
export function simulatedScore(outcome: VerificationOutcome, random: number): number | undefined {
  if (outcome === "success") return VERIFICATION_THRESHOLD + 2 + Math.floor(random * 26);
  if (outcome === "failure") return 25 + Math.floor(random * 40);
  return undefined;
}

/**
 * Similitud para mostrar, de 0 a 1 con coma decimal.
 *
 * @param score - De 0 a 100.
 * @returns Por ejemplo `0,91`.
 */
export function formatScore(score: number): string {
  return (score / 100).toFixed(2).replace(".", ",");
}

/**
 * Decide si una captura simulada falla.
 *
 * @param random - Número entre 0 (incluido) y 1 (excluido).
 * @returns `true` si la captura no sirvió.
 */
export function captureFails(random: number): boolean {
  return random < CAPTURE_FAILURE_PROBABILITY;
}
