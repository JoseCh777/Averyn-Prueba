import { Table } from "@/components/ui/display";
import { Chip, Tag } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";

import { electionInitials, formatDateRange } from "../election-rules";
import { ELECTION_STATUS_CHIP, INSTITUTION_LABEL, PROCESS_KIND_LABEL } from "../labels";
import type { Election } from "../types";

/**
 * Tabla de procesos electorales: nombre y tipo, institución, fechas y estado.
 *
 * @param props - Los procesos a mostrar.
 * @returns La tabla.
 */
export function ElectionsTable({ elections }: { elections: readonly Election[] }) {
  return (
    <div className="av-tablewrap" tabIndex={0} role="region" aria-label="Procesos electorales (desplazable)">
      <Table>
        <thead>
          <tr>
            <th scope="col">Proceso</th>
            <th scope="col">Institución</th>
            <th scope="col">Fechas</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {elections.map((election) => {
            const status = ELECTION_STATUS_CHIP[election.status];
            return (
              <tr key={election.id}>
                <td>
                  <div className="av-who">
                    <span className="av-initials" data-tone="blue" aria-hidden="true">
                      {electionInitials(election.name)}
                    </span>
                    <div className="av-who__text">
                      <span className="av-who__name">{election.name}</span>
                      <span className="av-who__sub">{PROCESS_KIND_LABEL[election.kind]}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <Tag>
                    <Icon name="people" /> {INSTITUTION_LABEL[election.institution]}
                  </Tag>
                </td>
                <td className="av-cell-mono">{formatDateRange(election.startDate, election.endDate)}</td>
                <td>
                  <Chip tone={status.tone} icon={status.icon}>
                    {status.label}
                  </Chip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
