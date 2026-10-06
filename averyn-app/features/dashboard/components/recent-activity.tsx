import { ActivityPanel, type ActivityEvent, type ActivityTone } from "@/components/ui/display";

import { formatCount } from "../summary";
import type { BiometricOutcome, DashboardSummary } from "../types";

const OUTCOME_TONE: Record<BiometricOutcome, ActivityTone | undefined> = {
  success: "ok",
  rejected: "bad",
  retry: "retry",
  "device-error": undefined,
};

const NO_ACTIVITY_EVENT: ActivityEvent = {
  title: "Sin actividad reciente",
  detail: "Aún no hay eventos en el registro biométrico. Registra o verifica una persona para empezar.",
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
 * Sin eventos muestra el estado vacío (coding-standard 22) en lugar de un panel en blanco.
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

  return (
    <ActivityPanel
      title="Actividad reciente"
      subtitle={`Últimas acciones registradas · ${formatCount(summary.totalEvents, "evento", "eventos")} en el registro`}
      bars={summary.outcomes.map((outcome) => ({
        label: outcome.label,
        value: outcome.count,
        max: Math.max(summary.totalEvents, 1),
        tone: OUTCOME_BAR_TONE[outcome.outcome],
      }))}
      events={events}
    />
  );
}
