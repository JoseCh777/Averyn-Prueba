/** Rutas del módulo de Biometría. */
export const BIOMETRICS_PATH = "/biometrics";

/** Qué se hace en la captura: registrar una plantilla nueva o comparar contra una existente. */
export type CaptureMode = "enrollment" | "verification";

/** Modalidad biométrica. */
export type BiometricMethod = "face" | "fingerprint";

/**
 * Dirección de la pantalla de captura para una persona.
 *
 * @param params - Modo, id de la persona y modalidad.
 * @returns Por ejemplo `/biometrics/capture?mode=enrollment&person=per-0001&method=face`.
 */
export function capturePath(params: { mode: CaptureMode; personId: string; method: BiometricMethod }): string {
  const search = new URLSearchParams({ mode: params.mode, person: params.personId, method: params.method });
  return `${BIOMETRICS_PATH}/capture?${search.toString()}`;
}
