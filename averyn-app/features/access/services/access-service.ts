import type { AccessEvent, AccessFactor, AccessLogEntry, AccessRequest, AccessResult, Candidate, Checkpoint, IdentifyResult, Occupancy } from "../types";

/** La petición no se puede evaluar: punto de control inexistente, sentido no permitido o política sin cubrir. */
export class InvalidAccessRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAccessRequestError";
  }
}

/**
 * Frontera entre las pantallas y el control en puerta (`contracts/access-contract.md`).
 *
 * Hoy la implementa `MockAccessService`; cuando exista AVY-048 se cambia solo la implementación
 * elegida en `services/index.ts`. Un `DENIED` es un resultado de negocio, no una excepción.
 */
export interface AccessService {
  /** Evento que se controla en esta puerta. */
  getEvent(): Promise<AccessEvent>;
  /** Puntos de control del evento. */
  listCheckpoints(eventId: string): Promise<Checkpoint[]>;
  /** Aforo del evento. */
  getOccupancy(eventId: string): Promise<Occupancy>;
  /** Últimos intentos de acceso, del más reciente al más antiguo. */
  listRecent(eventId: string, limit: number): Promise<AccessLogEntry[]>;
  /** Personas que figuran dentro del evento (para registrar una salida sin política). */
  listInside(eventId: string): Promise<Candidate[]>;
  /**
   * Identifica a la persona sin conceder el acceso (`POST /checkpoints/{cid}/identify`).
   *
   * @throws InvalidAccessRequestError si el punto de control no existe.
   */
  identify(checkpointId: string, factor: AccessFactor): Promise<IdentifyResult>;
  /**
   * Evalúa la política completa y registra la decisión (`POST /checkpoints/{cid}/access-requests`).
   *
   * @throws InvalidAccessRequestError si la petición no se puede evaluar.
   */
  requestAccess(request: AccessRequest): Promise<AccessResult>;
}
