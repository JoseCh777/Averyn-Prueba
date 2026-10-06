import { PageHeader } from "@/components/layout/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Kpi, KpiRow } from "@/components/ui/display";
import { EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";

import { filterPeople, summarizePeople } from "../person-rules";
import { personService } from "../services";
import type { PeopleFilter } from "../types";
import { NewPersonDialog } from "./new-person-dialog";
import { PeopleFilters } from "./people-filters";
import { PeopleTable } from "./people-table";

/**
 * Pantalla de Identidad: indicadores, filtros y la tabla de personas.
 *
 * Es un Server Component asíncrono: pide las personas al servicio, así que mientras llegan se
 * muestra `loading.tsx` y, si falla, `error.tsx`. Los indicadores cuentan **todas** las
 * personas; los filtros solo afectan a la tabla.
 *
 * @param props - Los filtros que vienen de la URL.
 * @returns La pantalla completa.
 */
export async function IdentityView({ filter }: { filter: PeopleFilter }) {
  const people = await personService.list();
  const summary = summarizePeople(people);
  const visible = filterPeople(people, filter);
  const hasFilter = filter.query.trim() !== "" || filter.status !== "all";

  return (
    <div className="av-page">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Identidad" }]}
        title="Personas verificadas"
        description="Registro de personas con identidad confirmada y su estado de verificación."
        actions={
          <>
            <Button variant="ghost" disabled title="Próximamente">
              <Icon name="download" /> Exportar
            </Button>
            <NewPersonDialog />
          </>
        }
      />

      <section aria-label="Indicadores de identidad">
        <KpiRow>
          <Kpi label="Total de personas" value={summary.total} note="registros en el sistema" />
          <Kpi label="Verificadas" value={summary.verified} note="identidad confirmada" />
          <Kpi label="Pendientes" value={summary.pending} note="en revisión" tone={summary.pending > 0 ? "warn" : undefined} />
          <Kpi label="Tasa de verificación" value={`${summary.verificationRate}%`} note={`${summary.verified} de ${summary.total} personas`} />
        </KpiRow>
      </section>

      <section className="av-surface" aria-label="Listado de personas">
        <PeopleFilters initial={filter} shown={visible.length} total={people.length} />
        {visible.length > 0 ? (
          <PeopleTable people={visible} />
        ) : (
          <EmptyState
            icon="person-x"
            title={hasFilter ? "Sin resultados" : "Aún no hay personas registradas"}
            action={
              hasFilter ? (
                <ButtonLink href="/identity" variant="ghost">
                  Quitar filtros
                </ButtonLink>
              ) : (
                <NewPersonDialog />
              )
            }
          >
            {hasFilter ? "No encontramos personas con ese criterio de búsqueda." : "Registra a la primera persona para empezar."}
          </EmptyState>
        )}
      </section>
    </div>
  );
}
