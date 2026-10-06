import type { BiometricDevice, BiometricEvent, BiometricMethod, BiometricProfile } from "../types";

/** Quién hace la operación y qué modalidad usa. */
export interface OperationInput {
  personId: string;
  method: BiometricMethod;
  /** Nombre de quien opera (sale de la sesión). */
  operator: string;
}

/**
 * Frontera entre las pantallas y los datos biométricos.
 *
 * Hoy la implementa `MockBiometricService`; cuando el Core exponga el módulo de biometría se
 * cambia solo la implementación elegida en `services/index.ts` (coding-standard §79–81).
 * Los dispositivos y la plantilla biométrica viven en el Core: el navegador nunca los toca.
 */
export interface BiometricService {
  /** Perfil de cada persona que tiene o tuvo biometría. */
  listProfiles(): Promise<BiometricProfile[]>;
  /** Perfil de una persona, o `undefined` si nunca se registró nada. */
  getProfile(personId: string): Promise<BiometricProfile | undefined>;
  /** Eventos del historial, del más reciente al más antiguo. */
  listEvents(): Promise<BiometricEvent[]>;
  /** Un evento del historial, o `undefined` si no existe. */
  getEvent(id: string): Promise<BiometricEvent | undefined>;
  /** Dispositivos de captura conocidos. */
  listDevices(): Promise<BiometricDevice[]>;
  /**
   * Registra una modalidad para una persona y deja el evento en el historial.
   * Sin un dispositivo conectado de esa modalidad no cambia el perfil y el evento queda como `device`.
   */
  enroll(input: OperationInput): Promise<BiometricEvent>;
  /**
   * Verifica a una persona (comparación 1:1) y deja el evento en el historial. El desenlace lo
   * decide el servicio, no el navegador.
   */
  verify(input: OperationInput): Promise<BiometricEvent>;
}
