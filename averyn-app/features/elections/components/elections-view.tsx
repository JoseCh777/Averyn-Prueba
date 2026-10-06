import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";

import { electionService } from "../services";
import { ElectionsTable } from "./elections-table";

/** Ruta del asistente de creación. */
export const NEW_ELECTION_PATH = "/elections/new";

/**
 * Pantalla de Procesos electorales: las convocatorias creadas y su estado.
 *
 * Es un Server Component asíncrono: pide los procesos al servicio, así que mientras llegan se muestra
 * `loading.tsx` y, si falla, `error.tsx`.
 *
 * @returns La pantalla completa.
 */
export async function ElectionsView() {
  const elections = await electionService.list();

  return (
    <div className="av-page">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Procesos electorales" }]}
        title="Procesos electorales"
        description="Convocatorias creadas y su estado dentro de la institución."
        actions={
          <ButtonLink href={NEW_ELECTION_PATH} variant="primary">
            <Icon name="plus-lg" /> Nuevo proceso electoral
          </ButtonLink>
        }
      />
      <section className="av-surface" aria-label="Listado de procesos electorales">
        {elections.length > 0 ? (
          <ElectionsTable elections={elections} />
        ) : (
          <EmptyState icon="check2-square" title="No hay procesos electorales." action={<ButtonLink href={NEW_ELECTION_PATH}>Crear el primero</ButtonLink>}>
            Crea el primero para comenzar.
          </EmptyState>
        )}
      </section>
    </div>
  );
}
