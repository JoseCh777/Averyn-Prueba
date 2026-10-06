import type { BiometricDevice, BiometricEvent, EventResult } from "@/features/biometrics/types";
import type { Election } from "@/features/elections/types";
import type { Person } from "@/features/identity/types";

import type { BiometricOutcome, DashboardSource } from "./types";

/** Resultado de un evento biométrico en el vocabulario del panel (`device` es un error técnico del dispositivo). */
const OUTCOME_OF: Record<EventResult, BiometricOutcome> = {
  success: "success",
  rejected: "rejected",
  retry: "retry",
  device: "device-error",
};

/**
 * Arma los datos de origen del panel con lo que entregan los módulos de Identidad, Biometría y Electoral.
 *
 * Es una función pura: solo traduce, no calcula. El resumen lo arma `buildDashboardSummary`. Los
 * eventos deben llegar del más reciente al más antiguo, tal como los entrega el servicio biométrico.
 *
 * @param modules - Personas, eventos, dispositivos y procesos electorales.
 * @returns Los datos de origen que entiende el resumen del panel.
 */
export function toDashboardSource(modules: {
  people: readonly Person[];
  events: readonly BiometricEvent[];
  devices: readonly BiometricDevice[];
  elections: readonly Election[];
}): DashboardSource {
  return {
    people: modules.people.map((person) => ({ id: person.id, name: person.name, status: person.status })),
    devices: modules.devices.map((device) => ({ id: device.id, status: device.status })),
    elections: modules.elections.map((election) => ({ status: election.status })),
    events: modules.events.map((event) => ({
      id: event.id,
      personId: event.personId,
      operation: event.operation,
      method: event.method,
      outcome: OUTCOME_OF[event.result],
      deviceId: event.deviceId,
      occurredAt: event.at,
    })),
  };
}
