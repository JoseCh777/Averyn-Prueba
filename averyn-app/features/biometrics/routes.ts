import type { CaptureContext, CaptureMode } from "./types";

/** Rutas del módulo de Biometría. */
export const BIOMETRICS_PATH = "/biometrics";
export const ENROLLMENT_PATH = `${BIOMETRICS_PATH}/enrollment`;
export const VERIFICATION_PATH = `${BIOMETRICS_PATH}/verification`;
export const HISTORY_PATH = `${BIOMETRICS_PATH}/history`;
const CAPTURE_PATH = `${BIOMETRICS_PATH}/capture`;

/**
 * Dirección de la pantalla de captura para una persona.
 *
 * @param context - Modo, id de la persona y modalidad.
 * @returns Por ejemplo `/biometrics/capture?mode=enrollment&person=per-0001&method=face`.
 */
export function capturePath(context: CaptureContext): string {
  const search = new URLSearchParams({ mode: context.mode, person: context.personId, method: context.method });
  return `${CAPTURE_PATH}?${search.toString()}`;
}

/**
 * Dirección del flujo (persona y método) de un modo, con una persona ya elegida.
 *
 * @param mode - Registro o verificación.
 * @param personId - Persona preseleccionada (opcional).
 * @returns La ruta del flujo.
 */
export function flowPath(mode: CaptureMode, personId?: string): string {
  const base = mode === "enrollment" ? ENROLLMENT_PATH : VERIFICATION_PATH;
  return personId === undefined ? base : `${base}?${new URLSearchParams({ person: personId }).toString()}`;
}

/**
 * Dirección del acta de un registro terminado.
 *
 * @param eventId - Id del evento de registro.
 * @returns Por ejemplo `/biometrics/enrollment?done=ev-0007`.
 */
export function enrollmentDonePath(eventId: string): string {
  return `${ENROLLMENT_PATH}?${new URLSearchParams({ done: eventId }).toString()}`;
}

/**
 * Dirección del resultado de una verificación.
 *
 * @param eventId - Id del evento de verificación.
 * @returns Por ejemplo `/biometrics/verification/result?event=ev-0007`.
 */
export function verificationResultPath(eventId: string): string {
  return `${VERIFICATION_PATH}/result?${new URLSearchParams({ event: eventId }).toString()}`;
}
