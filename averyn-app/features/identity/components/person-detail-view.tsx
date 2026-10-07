import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { personService } from "../services";
import { PersonAvatar } from "./person-avatar";
import { AffiliationTag, StatusChip } from "./person-badges";

/**
 * Ficha de una persona: nombre, documento, afiliación y estado de verificación.
 *
 * Si la persona no existe (o se eliminó) muestra la pantalla «no encontrado» de la ruta.
 * La tarjeta enseña lo mismo que la ficha original (dashboard-identity.js:247-260): perfil,
 * las filas `Afiliación` y `Estado`, y el enlace «Volver al listado» dentro de la tarjeta.
 *
 * @param props - El id de la persona, tomado de la URL.
 * @returns La pantalla de detalle.
 */
export async function PersonDetailView({ personId }: { personId: string }) {
  const person = await personService.getById(personId);
  if (person === undefined) notFound();

  return (
    <div className="av-page" role="region" aria-label="Detalle de persona">
      <PageHeader
        icon="person-vcard"
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Identidad", href: "/identity" }, { label: "Detalle" }]}
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
        </dl>
        <ButtonLink href="/identity" className="av-detail-back">
          <Icon name="arrow-left" /> Volver al listado
        </ButtonLink>
      </section>
    </div>
  );
}
