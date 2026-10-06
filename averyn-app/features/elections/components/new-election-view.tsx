import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { personService } from "@/features/identity/services";
import { limaDay } from "@/lib/date-format";

import { electionService } from "../services";
import { ElectionWizard } from "./election-wizard";

/**
 * Pantalla «Nuevo proceso electoral»: la cabecera y el asistente de cuatro pasos.
 *
 * El servidor entrega el padrón, los nombres que ya existen y el día de hoy en hora de Lima, para
 * que el asistente valide igual que lo hará el servidor.
 *
 * @returns La pantalla del asistente.
 */
export async function NewElectionView() {
  const [people, elections] = await Promise.all([personService.list(), electionService.list()]);

  return (
    <div className="av-page">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Procesos electorales", href: "/elections" }, { label: "Nuevo proceso" }]}
        title="Nuevo proceso electoral"
        description="Crea y configura una convocatoria electoral."
        actions={
          <ButtonLink href="/elections">
            <Icon name="arrow-left" /> Volver a Procesos electorales
          </ButtonLink>
        }
      />
      <ElectionWizard people={people} existingNames={elections.map((election) => election.name)} today={limaDay(new Date())} />
    </div>
  );
}
