import { biometricService } from "@/features/biometrics/services";
import { electionService } from "@/features/elections/services";
import { personService } from "@/features/identity/services";

import { toDashboardSource } from "../source-mapping";
import { buildDashboardSummary } from "../summary";
import type { DashboardSummary } from "../types";
import type { DashboardService } from "./dashboard-service";

/**
 * Resumen del panel armado con los servicios de Identidad, Biometría y Electoral.
 *
 * Lo que se registra en un módulo se ve en el panel. Cada servicio es hoy una implementación mock;
 * cuando el Core entregue el resumen ya calculado, esta clase la reemplaza un cliente HTTP.
 * TODO(AVY-006): reemplazar por un cliente HTTP del resumen del Core.
 */
export class ComposedDashboardService implements DashboardService {
  /** @returns El resumen calculado sobre los datos actuales de los tres módulos. */
  public async getSummary(): Promise<DashboardSummary> {
    const [people, events, devices, elections] = await Promise.all([
      personService.list(),
      biometricService.listEvents(),
      biometricService.listDevices(),
      electionService.list(),
    ]);
    return buildDashboardSummary(toDashboardSource({ people, events, devices, elections }));
  }
}
