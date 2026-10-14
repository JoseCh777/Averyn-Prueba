import { Chip, Progress } from "@/components/ui/feedback";

import { accessService } from "../services";

/**
 * Aforo del evento: cuántas personas hay dentro frente a la capacidad, y las entradas y salidas.
 *
 * Es un Server Component: lee el aforo del servicio y se refresca cuando una acción de servidor
 * revalida la ruta. El estado completo se dice con texto y chip, no solo con color.
 *
 * @param props - El id del evento.
 * @returns El panel de aforo.
 */
export async function OccupancyPanel({ eventId }: { eventId: string }) {
  const { capacity, inside, entries, exits } = await accessService.getOccupancy(eventId);
  const ratio = capacity === 0 ? 0 : Math.min(1, inside / capacity);
  const full = inside >= capacity;
  const tone = full ? "error" : ratio >= 0.8 ? "warning" : "success";

  return (
    <section className="av-surface av-surface--pad acc-occupancy" aria-label="Aforo del evento">
      <div className="acc-occupancy__head">
        <h2 className="acc-title">Aforo</h2>
        <Chip tone={tone} icon={full ? "x-circle" : "people"}>
          {full ? "Completo" : `${Math.round(ratio * 100)} %`}
        </Chip>
      </div>
      <p className="acc-occupancy__count">
        <b>{inside}</b>
        <span>de {capacity} personas dentro</span>
      </p>
      <Progress value={ratio} label="Personas dentro del evento" />
      <dl className="acc-occupancy__stats">
        <div>
          <dt>Entradas</dt>
          <dd>{entries}</dd>
        </div>
        <div>
          <dt>Salidas</dt>
          <dd>{exits}</dd>
        </div>
      </dl>
    </section>
  );
}
