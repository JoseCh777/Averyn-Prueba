import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { personService } from "@/features/identity/services";

import { filterEvents } from "../biometric-rules";
import { BIOMETRICS_PATH, HISTORY_PATH } from "../routes";
import { biometricService } from "../services";
import type { HistoryFilter } from "../types";
import { EventsTable } from "./events-table";
import { HistoryFilters } from "./history-filters";

/**
 * Historial biométrico: la trazabilidad de los registros y verificaciones, con filtros por método y resultado.
 *
 * Los eventos de una persona eliminada se conservan (es auditoría) y se marcan como «Persona eliminada».
 *
 * @param props - Los filtros que vienen de la URL.
 * @returns La pantalla del historial.
 */
export async function HistoryView({ filter }: { filter: HistoryFilter }) {
  const [events, people] = await Promise.all([biometricService.listEvents(), personService.list()]);
  const visible = filterEvents(events, filter);
  const peopleById = new Map(people.map((person) => [person.id, person]));

  return (
    <div className="av-page bio-page" role="region" aria-label="Contenido del historial biométrico">
      <PageHeader
        icon="clock-history"
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Biometría", href: BIOMETRICS_PATH }, { label: "Historial" }]}
        title="Historial biométrico"
        description="Trazabilidad de los registros y verificaciones realizados en la institución."
        actions={
          <ButtonLink href={BIOMETRICS_PATH}>
            <Icon name="arrow-left" /> Volver a Biometría
          </ButtonLink>
        }
      />
      <section className="av-surface" aria-label="Historial de eventos">
        <HistoryFilters initial={filter} shown={visible.length} total={events.length} />
        <EventsTable
          events={visible}
          people={peopleById}
          variant="full"
          label="Historial biométrico"
          empty={
            <EmptyState
              icon="funnel"
              title={events.length === 0 ? "Aún no hay eventos" : "No hay eventos con esos filtros"}
              action={events.length === 0 ? undefined : <ButtonLink href={HISTORY_PATH}>Quitar filtros</ButtonLink>}
            >
              {events.length === 0 ? "Registra o verifica una identidad para ver eventos aquí." : "Ajusta el método o el resultado para ver otros registros."}
            </EmptyState>
          }
        />
      </section>
    </div>
  );
}
