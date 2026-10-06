import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { formatIsoDate } from "../person-rules";
import { personService } from "../services";
import { PersonAvatar } from "./person-avatar";
import { AffiliationTag, StatusChip } from "./person-badges";

/**
 * Ficha de una persona: nombre, documento, afiliación y estado de verificación.
 *
 * Si la persona no existe (o se eliminó) muestra la pantalla «no encontrado» de la ruta.
 *
 * @param props - El id de la persona, tomado de la URL.
 * @returns La pantalla de detalle.
 */
export async function PersonDetailView({ personId }: { personId: string }) {
  const person = await personService.getById(personId);
  if (person === undefined) notFound();

  return (
    <div className="av-page">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Identidad", href: "/identity" }, { label: person.name }]}
        title="Detalle de persona"
        description="Información de la persona y su estado de verificación."
        actions={
          <ButtonLink href="/identity">
            <Icon name="arrow-left" /> Volver al listado
          </ButtonLink>
        }
      />

      <section className="av-surface av-surface--pad av-surface--narrow" aria-label={`Ficha de ${person.name}`}>
        <div className="av-profile">
          <PersonAvatar person={person} large />
          <div>
            <h2>{person.name}</h2>
            <p>Cédula {person.document}</p>
          </div>
        </div>
        <dl className="av-detail">
          <div>
            <dt>Afiliación</dt>
            <dd>
              <AffiliationTag affiliation={person.affiliation} />
            </dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd>
              <StatusChip status={person.status} />
            </dd>
          </div>
          {person.birthDate === undefined ? null : (
            <div>
              <dt>Fecha de nacimiento</dt>
              <dd>{formatIsoDate(person.birthDate)}</dd>
            </div>
          )}
          {person.email === undefined ? null : (
            <div>
              <dt>Correo</dt>
              <dd>{person.email}</dd>
            </div>
          )}
          <div>
            <dt>Identificador</dt>
            <dd className="av-who__sub">{person.id}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
