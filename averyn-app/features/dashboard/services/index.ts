import { ComposedDashboardService } from "./composed-dashboard-service";
import type { DashboardService } from "./dashboard-service";

/**
 * Implementación de `DashboardService` que usa la aplicación.
 *
 * Es el único sitio que elige cuál. TODO(AVY-006): cambiar por el cliente HTTP del Core.
 */
export const dashboardService: DashboardService = new ComposedDashboardService();
