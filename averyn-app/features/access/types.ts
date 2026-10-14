/**
 * Tipos del módulo de Accesos (control en puerta). Reflejan `contracts/access-contract.md` v0.1:
 * cuando el Core exponga la API solo cambia la implementación del servicio, no estos tipos.
 */

/** Método con el que una persona acredita su identidad en un punto de control. */
export type AccessMethod = "QR" | "FACE" | "FINGERPRINT";

/** Sentido del paso por un punto de control. */
export type AccessDirection = "ENTRY" | "EXIT";

/** Un punto de control puede atender un sentido o ambos. */
export type CheckpointDirection = AccessDirection | "BOTH";

/**
 * Grupo de la política: para entrar se debe cumplir **cada** grupo y un grupo se cumple con
 * **cualquiera** de sus métodos (`QR` y (`FACE` o `FINGERPRINT`) son dos grupos).
 */
export type PolicyGroup = readonly AccessMethod[];

/** Estado del evento; solo en `LIVE` se controla la puerta. */
export type EventStatus = "DRAFT" | "PUBLISHED" | "LIVE" | "CLOSED" | "CANCELLED";

/** Evento al que pertenece la puerta. */
export interface AccessEvent {
  id: string;
  name: string;
  status: EventStatus;
  capacity: number;
}

/** Punto de control de un evento, con su política de verificación. */
export interface Checkpoint {
  id: string;
  name: string;
  direction: CheckpointDirection;
  /** Vacía en un punto de salida sin verificación. */
  policy: readonly PolicyGroup[];
}

/** Resultado de negocio de un intento de acceso. */
export type AccessDecision = "GRANTED" | "DENIED";

/**
 * Motivo de una denegación. El catálogo completo está pendiente en el contrato (⚑): estos son
 * los que este mock modela, en el orden en que se comprueban.
 */
export type DenyReason =
  | "EVENT_NOT_LIVE"
  | "NOT_ADMITTED"
  | "ALREADY_INSIDE"
  | "NOT_INSIDE"
  | "CAPACITY_FULL"
  | "QR_INVALID"
  | "QR_EXPIRED"
  | "QR_USED"
  | "IDENTITY_MISMATCH"
  | "ENROLLMENT_MISSING"
  | "NO_MATCH"
  | "LIVENESS_FAILED"
  | "VERIFICATION_ERROR";

/**
 * Resultado que fuerza el panel de demostración para una captura biométrica. En producción lo
 * decide el Face/Fingerprint Service; el navegador nunca decide.
 */
export type SimulatedOutcome = "match" | "no_match" | "liveness_failed" | "unavailable";

/** Captura biométrica enviada al servicio. En el mock solo lleva el desenlace simulado. */
export interface BiometricCapture {
  simulate: SimulatedOutcome;
  /** Persona que se presenta ante el lector; si falta, la persona que se está verificando. */
  presenter?: string;
}

/** Factor aportado por el operador en un intento de acceso. */
export type AccessFactor =
  | { method: "QR"; code: string }
  | { method: "FACE" | "FINGERPRINT"; capture: BiometricCapture; operatorConfirmed?: boolean };

/** Persona que el servicio propone o que está dentro del evento. */
export interface Candidate {
  personId: string;
  displayName: string;
  /** Línea de apoyo para distinguir homónimos, por ejemplo la afiliación. */
  detail: string;
}

/** Respuesta de `POST /checkpoints/{cid}/identify`. */
export interface IdentifyResult {
  identified: boolean;
  personId?: string;
  displayName?: string;
  /** En 1:N, las personas más parecidas; el operador debe confirmar una. */
  candidates: Candidate[];
  requiresOperatorConfirmation: boolean;
  /** Motivo de negocio cuando `identified` es falso. */
  reason?: DenyReason;
}

/** Petición de acceso (`POST /checkpoints/{cid}/access-requests`). */
export interface AccessRequest {
  checkpointId: string;
  personId: string;
  direction: AccessDirection;
  factors: AccessFactor[];
}

/** Respuesta de `access-requests`: siempre `200`, también si se deniega. */
export interface AccessResult {
  decision: AccessDecision;
  denyReason: DenyReason | null;
  accessLogId: number;
  occupancy: number;
  personName: string;
}

/** Aforo del evento (`GET /events/{id}/occupancy`). */
export interface Occupancy {
  capacity: number;
  inside: number;
  entries: number;
  exits: number;
}

/** Fila del registro de accesos; nunca incluye imágenes, plantillas ni el valor del QR. */
export interface AccessLogEntry {
  id: number;
  at: string;
  checkpointName: string;
  direction: AccessDirection;
  personName: string | null;
  decision: AccessDecision;
  denyReason: DenyReason | null;
}
