import { Kpi, KpiRow } from "@/components/ui/display";

import { dashboardService } from "../services";
import type { DashboardKpi } from "../types";
import { DashboardHero } from "./dashboard-hero";
import { QuickAccessGrid } from "./quick-access-grid";
import { RecentActivity } from "./recent-activity";

/**
 * @param kpi - Indicador del resumen.
 * @returns El tono que entiende el componente `Kpi` (`neutral` no lleva color).
 */
function toKpiTone(kpi: DashboardKpi): "ok" | "warn" | undefined {
  return kpi.tone === "neutral" ? undefined : kpi.tone;
}

/**
 * Pantalla del dashboard base: bienvenida, indicadores, accesos rápidos y actividad reciente.
 *
 * Es un Server Component asíncrono: pide el resumen al servicio, así que mientras llega se
 * muestra `loading.tsx` y, si falla, `error.tsx`.
 *
 * @returns La pantalla completa del dashboard.
 */
export async function DashboardView() {
  const summary = await dashboardService.getSummary();

  return (
    <div className="av-dashboard">
      <DashboardHero />
      <div className="av-dashboard__wrap">
        <section aria-label="Indicadores principales">
          <KpiRow>
            {summary.kpis.map((kpi) => (
              <Kpi key={kpi.id} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={toKpiTone(kpi)} note={kpi.note} />
            ))}
          </KpiRow>
        </section>
        <div className="av-dashboard__split">
          <QuickAccessGrid />
          <RecentActivity summary={summary} />
        </div>
      </div>
    </div>
  );
}
