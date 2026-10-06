import type { IconName } from "@/components/ui/icon";

/** Modalidad biométrica. */
export type BiometricMethod = "face" | "fingerprint";

/** Qué se hace en la captura: registrar una plantilla nueva o comparar contra una existente. */
export type CaptureMode = "enrollment" | "verification";

/**
 * Resultado de un evento biométrico.
 *
 * - `success`: el registro o la verificación salió bien.
 * - `rejected`: la comparación no coincide con el registro.
 * - `retry`: la captura no sirvió (poca luz, huella borrosa); hay que repetirla.
 * - `device`: no había un dispositivo disponible.
 */
export type EventResult = "success" | "rejected" | "retry" | "device";

/** Estado de un dispositivo de captura. */
export type DeviceStatus = "connected" | "disconnected";

/** Qué modalidades tiene registradas una persona. */
export interface BiometricProfile {
  personId: string;
  face: boolean;
  fingerprint: boolean;
  /** Instante del último registro (ISO 8601); `undefined` si nunca se registró. */
  registeredAt?: string;
}

/** Un evento del historial (auditoría): cada registro o verificación deja uno. */
export interface BiometricEvent {
  id: string;
  personId: string;
  operation: CaptureMode;
  method: BiometricMethod;
  result: EventResult;
  deviceId: string;
  operator: string;
  institution: string;
  /** Instante del evento (ISO 8601). */
  at: string;
  /** Similitud de una verificación, de 0 a 100 (solo cuando hubo comparación). */
  score?: number;
}

/** Un dispositivo de captura. */
export interface BiometricDevice {
  id: string;
  name: string;
  kind: BiometricMethod;
  status: DeviceStatus;
  model: string;
  location: string;
  serial: string;
}

/** Desenlace de una verificación. */
export type VerificationOutcome = "success" | "failure" | "retry";

/** Una persona tal como la muestra el selector: sus datos y su perfil biométrico. */
export interface PickerPerson {
  id: string;
  name: string;
  document: string;
  affiliation: string;
  affiliationIcon: IconName;
  profile: Pick<BiometricProfile, "face" | "fingerprint">;
}

/** Conteos de los indicadores del módulo. */
export interface BiometricsSummary {
  peopleWithBiometrics: number;
  totalPeople: number;
  verifications: number;
  successful: number;
  rejected: number;
  /** Porcentaje de verificaciones exitosas, entero de 0 a 100; `null` si aún no hay verificaciones. */
  successRate: number | null;
  connectedDevices: number;
  totalDevices: number;
}

/** Filtros del historial. */
export interface HistoryFilter {
  method: BiometricMethod | "all";
  result: EventResult | "all";
}

/** Contexto de una captura, tal como llega por la URL. */
export interface CaptureContext {
  mode: CaptureMode;
  personId: string;
  method: BiometricMethod;
}

/** Si no se pudo cerrar la captura (si sale bien, la acción redirige y no devuelve). */
export interface CompleteCaptureResult {
  ok: false;
  message: string;
}
