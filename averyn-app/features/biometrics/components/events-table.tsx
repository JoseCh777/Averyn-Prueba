import type { ReactNode } from "react";

import { Table } from "@/components/ui/display";
import { Chip } from "@/components/ui/feedback";
import type { Person } from "@/features/identity/types";
import { formatDateTime } from "@/lib/date-format";

import { METHOD_LABEL, OPERATION_LABEL, resultChip } from "../labels";
import type { BiometricEvent } from "../types";

type EventsTableProps = {
  events: readonly BiometricEvent[];
  /** Personas por id, para mostrar su nombre; una persona eliminada sale como «Persona eliminada». */
  people: ReadonlyMap<string, Person>;
  /** `full` agrega el dispositivo y el operador (historial); `compact` es el resumen del módulo. */
  variant: "compact" | "full";
  label: string;
  /** Estado vacío: va dentro de la tabla, en una fila que cruza todas las columnas. */
  empty?: ReactNode;
};

/**
 * Tabla de eventos biométricos: quién, qué operación, con qué método y cómo salió.
 *
 * Es un Server Component. El nombre de la persona se busca por id; si la persona se eliminó el
 * evento se conserva (es auditoría) y se marca como «Persona eliminada».
 *
 * @param props - Los eventos, las personas y la variante.
 * @returns La tabla.
 */
export function EventsTable({ events, people, variant, label, empty }: EventsTableProps) {
  const full = variant === "full";
  const columns = full ? 7 : 5;
  return (
    <div className="av-tablewrap" tabIndex={0} role="region" aria-label={`${label} (desplazable)`}>
      <Table>
        <thead>
          <tr>
            <th scope="col">Persona</th>
            <th scope="col">Operación</th>
            <th scope="col">Método</th>
            <th scope="col">Resultado</th>
            {full ? <th scope="col">Dispositivo</th> : null}
            <th scope="col">Fecha</th>
            {full ? <th scope="col">Operador</th> : null}
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr className="av-table__empty">
              <td colSpan={columns}>{empty}</td>
            </tr>
          ) : (
            events.map((event) => {
              const person = people.get(event.personId);
              const chip = resultChip(event.result, event.operation);
              return (
                <tr key={event.id}>
                  <td>
                    <div className="av-who__text">
                      {person ? <span className="av-who__name">{person.name}</span> : <span className="av-cell-sub">Persona eliminada</span>}
                      {full && person ? <span className="av-who__sub">Cédula {person.document}</span> : null}
                    </div>
                  </td>
                  <td>{OPERATION_LABEL[event.operation]}</td>
                  <td>{METHOD_LABEL[event.method]}</td>
                  <td>
                    <Chip tone={chip.tone} icon={chip.icon}>
                      {chip.label}
                    </Chip>
                  </td>
                  {full ? <td className="av-cell-mono">{event.deviceId}</td> : null}
                  <td className="av-cell-mono">{formatDateTime(event.at)}</td>
                  {full ? <td>{event.operator}</td> : null}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
}
