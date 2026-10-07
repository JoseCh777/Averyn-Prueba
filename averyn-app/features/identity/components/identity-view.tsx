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
 * Pantalla de Identidad: indicadores, filtros, la tabla de personas y su pie de paginación.
 *
 * Es un Server Component asíncrono: pide las personas al servicio, así que mientras llegan se
 * muestra `loading.tsx` y, si falla, `error.tsx`. Los indicadores cuentan **todas** las
 * personas; los filtros solo afectan a la tabla. Cuando no hay resultados, el estado vacío se
 * pinta dentro de la tabla y el pie sigue informando «Mostrando X de Y».
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
    <div className="av-page" role="region" aria-label="Contenido de Identidad">
      <PageHeader
        icon="person-vcard"
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
          <Kpi label="Pendientes" value={summary.pending} note="en revisión" />
          <Kpi label="Tasa de verificación" value={`${summary.verificationRate}%`} note={`${summary.verified} de ${summary.total} personas`} />
        </KpiRow>
      </section>

      <section className="av-surface" aria-label="Listado de personas">
        <PeopleFilters initial={filter} />
        <PeopleTable
          people={visible}
          empty={
            <EmptyState
              icon="person-x"
              title={hasFilter ? "Sin resultados" : "No hay personas registradas."}
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
              {hasFilter ? "No se encontraron personas con ese criterio de búsqueda." : null}
            </EmptyState>
          }
        />
        {/* Pie estático de una sola página, igual que el original (index.html:147-154). */}
        <div className="av-pagination">
          <span className="av-pagination__info" role="status">{`Mostrando ${visible.length} de ${people.length}`}</span>
          <div className="av-pagination__controls" role="group" aria-label="Paginación">
            <button type="button" className="av-pagination__btn" disabled aria-label="Página anterior">
              <Icon name="chevron-left" />
            </button>
            <button type="button" className="av-pagination__btn is-active" aria-current="page">
              1
            </button>
            <button type="button" className="av-pagination__btn" disabled aria-label="Página siguiente">
              <Icon name="chevron-right" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
