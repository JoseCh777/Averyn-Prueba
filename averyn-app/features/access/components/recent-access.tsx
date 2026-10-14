import { Chip, EmptyState } from "@/components/ui/feedback";

import { DECISION_CHIP, DENY_REASON_MESSAGE, DIRECTION_LABEL } from "../labels";
import { accessService } from "../services";

/** Cuántos intentos recientes se muestran. */
const RECENT_LIMIT = 8;

const TIME_FORMAT = new Intl.DateTimeFormat("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Lima" });

/**
 * Últimos intentos de acceso, del más reciente al más antiguo.
 *
 * Cada fila dice el resultado con chip (icono y palabra), la persona, el punto de control, el
 * sentido, la hora y el motivo si se denegó. No muestra imágenes ni el valor del QR.
 *
 * @param props - El id del evento.
 * @returns La lista de accesos recientes.
 */
export async function RecentAccess({ eventId }: { eventId: string }) {
  const entries = await accessService.listRecent(eventId, RECENT_LIMIT);

  return (
    <section className="av-surface av-surface--pad acc-recent" aria-label="Accesos recientes">
      <h2 className="acc-title">Accesos recientes</h2>
      {entries.length === 0 ? (
        <EmptyState icon="clock-history" title="Aún no hay intentos de acceso">
          Los intentos aparecerán aquí a medida que atienda a las personas.
        </EmptyState>
      ) : (
        <ol className="acc-recent__list">
          {entries.map((entry) => {
            const chip = DECISION_CHIP[entry.decision];
            return (
              <li key={entry.id} className="acc-recent__item">
                <Chip tone={chip.tone} icon={chip.icon}>
                  {chip.label}
                </Chip>
                <div className="acc-recent__text">
                  <b>{entry.personName ?? "Sin identificar"}</b>
                  <small>
                    {entry.checkpointName} · {DIRECTION_LABEL[entry.direction]}
                    {entry.denyReason === null ? "" : ` · ${DENY_REASON_MESSAGE[entry.denyReason]}`}
                  </small>
                </div>
                <time className="acc-recent__time" dateTime={entry.at}>
                  {TIME_FORMAT.format(new Date(entry.at))}
                </time>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
