import { ActivityPanel, type ActivityEvent, type ActivityTone } from "@/components/ui/display";

import { formatCount } from "../summary";
import type { BiometricOutcome, DashboardSummary } from "../types";

const OUTCOME_TONE: Record<BiometricOutcome, ActivityTone> = {
  success: "ok",
  rejected: "bad",
  retry: "retry",
  "device-error": "other",
};

const NO_ACTIVITY_EVENT: ActivityEvent = {
  title: "Sin actividad reciente",
  detail: "Aún no hay eventos en el log biométrico. Registra o verifica una persona para empezar.",
  time: "",
};

const OUTCOME_BAR_TONE: Record<"success" | "rejected" | "retry", ActivityTone> = {
  success: "ok",
  rejected: "bad",
  retry: "retry",
};

/**
 * Panel de actividad reciente: barras por resultado y línea de tiempo de los últimos eventos.
 *
 * Sin eventos muestra el estado vacío (coding-standard 22) en lugar de un panel en blanco,
 * y omite el bloque de resultados (como el original, que lo deja `hidden`).
 *
 * @param props - El resumen del que se toman los resultados y los eventos.
 * @returns El panel oscuro de actividad.
 */
export function RecentActivity({ summary }: { summary: DashboardSummary }) {
  const events: ActivityEvent[] =
    summary.recentEvents.length === 0
      ? [NO_ACTIVITY_EVENT]
      : summary.recentEvents.map((event) => ({
          title: event.title,
          detail: event.detail,
          time: event.meta,
          tone: OUTCOME_TONE[event.outcome],
        }));

  const hasBars = summary.totalEvents > 0;

  return (
    <ActivityPanel
      titleId="titulo-actividad"
      title="Actividad reciente"
      subtitle="Últimas acciones registradas"
      barsTitle={hasBars ? `Resultados del log · ${formatCount(summary.totalEvents, "evento", "eventos")}` : undefined}
      bars={
        hasBars
          ? summary.outcomes.map((outcome) => ({
              label: outcome.label,
              value: outcome.count,
              max: Math.max(summary.totalEvents, 1),
              tone: OUTCOME_BAR_TONE[outcome.outcome],
            }))
          : []
      }
      events={events}
      more={{ href: "/biometrics/history", label: "Ver historial completo" }}
    />
  );
}
