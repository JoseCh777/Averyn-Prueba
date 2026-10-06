import { MOCK_DASHBOARD_SOURCE } from "../mock-dashboard-data";
import { buildDashboardSummary } from "../summary";
import type { DashboardSummary } from "../types";
import type { DashboardService } from "./dashboard-service";

/**
 * [MOCK] Resumen del panel calculado sobre datos de demostración.
 * TODO(AVY-006): reemplazar por un cliente HTTP del resumen del Core.
 */
export class MockDashboardService implements DashboardService {
  /** @returns El resumen de los datos de demostración. */
  public async getSummary(): Promise<DashboardSummary> {
    return buildDashboardSummary(MOCK_DASHBOARD_SOURCE);
  }
}
