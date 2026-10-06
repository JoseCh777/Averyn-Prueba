import type { DashboardSummary } from "../types";

/**
 * Frontera entre el dashboard y quien le entrega los datos.
 *
 * Hoy la implementa `MockDashboardService`; cuando el Core exponga el resumen, la
 * reemplaza un cliente HTTP y la pantalla no cambia (coding-standard 81).
 */
export interface DashboardService {
  /**
   * @returns Indicadores, resultados y actividad reciente del panel principal.
   * @throws Error when the data source cannot be reached (lo muestra `error.tsx`).
   */
  getSummary(): Promise<DashboardSummary>;
}
