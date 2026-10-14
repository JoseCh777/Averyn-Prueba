import { PageHeader } from "@/components/layout/page-header";
import { Chip, EmptyState } from "@/components/ui/feedback";
import { AFFILIATION_LABEL } from "@/features/identity/labels";
import { personService } from "@/features/identity/services";

import { accessService } from "../services";
import type { Candidate, Checkpoint } from "../types";
import { GateConsole } from "./gate-console";
import { OccupancyPanel } from "./occupancy-panel";
import { RecentAccess } from "./recent-access";

/**
 * Consola del operador de puerta: eventos, punto de control, verificación y aforo en una pantalla.
 *
 * Es un Server Component: lee el evento, los puntos de control, quienes están dentro y el padrón, y
 * entrega la consola interactiva (cliente). Las acciones de servidor revalidan la ruta, así que el
 * aforo y los accesos recientes se actualizan solos tras cada intento.
 *
 * @returns La pantalla de Accesos.
 */
export async function AccessView() {
  const event = await accessService.getEvent();
  const [checkpoints, inside, people] = await Promise.all([
    accessService.listCheckpoints(event.id),
    accessService.listInside(event.id),
    personService.list(),
  ]);
  const [first, ...rest] = checkpoints;
  const list: [Checkpoint, ...Checkpoint[]] | undefined = first === undefined ? undefined : [first, ...rest];
  const candidates: Candidate[] = people.map((person) => ({ personId: person.id, displayName: person.name, detail: AFFILIATION_LABEL[person.affiliation] }));

  return (
    <div className="av-page acc-page" role="region" aria-label="Control de acceso en puerta">
      <PageHeader
        title="Control de acceso"
        description={`${event.name} · Verifique la identidad de cada persona y registre su ingreso o salida.`}
        actions={
          <Chip tone={event.status === "LIVE" ? "success" : "neutral"} icon="activity">
            {event.status === "LIVE" ? "Evento en curso" : "Evento cerrado"}
          </Chip>
        }
      />

      {list === undefined ? (
        <section className="av-surface av-surface--pad" aria-label="Sin puntos de control">
          <EmptyState icon="door-open" title="Este evento aún no tiene puntos de control">
            El organizador debe crearlos antes de abrir la puerta.
          </EmptyState>
        </section>
      ) : (
        <div className="acc-layout">
          <GateConsole checkpoints={list} inside={inside} people={candidates} />
          <aside className="acc-side" aria-label="Estado del evento">
            <OccupancyPanel eventId={event.id} />
            <RecentAccess eventId={event.id} />
          </aside>
        </div>
      )}
    </div>
  );
}
