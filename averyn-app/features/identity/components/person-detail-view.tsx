import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Chip, EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { newestFirst } from "@/features/biometrics/biometric-rules";
import { METHOD_ICON, METHOD_LABEL, METHODS } from "@/features/biometrics/labels";
import { HISTORY_PATH, capturePath, flowPath } from "@/features/biometrics/routes";
import { biometricService } from "@/features/biometrics/services";
import type { BiometricMethod } from "@/features/biometrics/types";
import { DocumentsTable } from "@/features/documents/components/documents-table";
import { documentService } from "@/features/documents/services";
import { formatDate, formatDateTime } from "@/lib/date-format";

import { personService } from "../services";
import { AffiliationTag, StatusChip } from "./person-badges";
import { EventsTable } from "@/features/biometrics/components/events-table";
import { PersonAvatar } from "./person-avatar";

/**
 * Ficha completa de una persona: identidad, biometría, actividad reciente y documentos.
 *
 * La tarjeta de identidad enseña lo mismo que la ficha original (dashboard-identity.js:247-260)
 * — perfil, `Afiliación` y `Estado` — y se completa con el correo y la fecha de nacimiento
 * cuando la persona los registró. Las secciones de biometría, actividad y documentos se alimentan
 * de los servicios de los otros módulos (`getProfile`, `listEvents` y `list` con `personId`),
 * de modo que la ficha refleja lo que ya existe en la plataforma.
 *
 * @param props - El id de la persona, tomado de la URL.
 * @returns La pantalla de detalle.
 */
export async function PersonDetailView({ personId }: { personId: string }) {
  const [person, profile, events, documents] = await Promise.all([
    personService.getById(personId),
    biometricService.getProfile(personId),
    biometricService.listEvents(),
    documentService.list(),
  ]);
  if (person === undefined) notFound();

  const activity = newestFirst(events.filter((event) => event.personId === personId)).slice(0, 5);
  const personDocuments = [...documents]
    .filter((document) => document.personId === personId)
    .sort((a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt));
  const registered: Record<BiometricMethod, boolean> = {
    face: profile?.face === true,
    fingerprint: profile?.fingerprint === true,
  };
  const hasBiometrics = registered.face || registered.fingerprint;
  const people = new Map([[person.id, person]]);

  return (
    <div className="av-page" role="region" aria-label="Detalle de persona">
      <PageHeader
        title="Detalle de persona"
        description="Información de la persona, su biometría y su actividad en la plataforma."
        actions={
          <>
            <ButtonLink href={hasBiometrics ? flowPath("verification", person.id) : flowPath("enrollment", person.id)} variant="primary">
              <Icon name="shield-check" /> {hasBiometrics ? "Verificar identidad" : "Registrar biometría"}
            </ButtonLink>
            <ButtonLink href="/identity">
              <Icon name="arrow-left" /> Volver al listado
            </ButtonLink>
          </>
        }
      />

      <div className="av-ficha">
        <section className="av-surface av-surface--pad" aria-label={`Ficha de ${person.name}`}>
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
            {person.email !== undefined ? (
              <div>
                <dt>Correo</dt>
                <dd>{person.email}</dd>
              </div>
            ) : null}
            {person.birthDate !== undefined ? (
              <div>
                <dt>Fecha de nacimiento</dt>
                <dd>{formatDate(person.birthDate)}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="av-surface av-surface--pad" aria-label="Biometría de la persona">
          <div className="av-surface__head">
            <h2>Biometría</h2>
            <p>Modalidades registradas de {person.name}.</p>
          </div>
          <dl className="av-detail">
            <div>
              <dt>Rostro</dt>
              <dd>
                {registered.face ? (
                  <Chip tone="success" icon="check-circle">
                    Registrado
                  </Chip>
                ) : (
                  <span className="av-cell-sub">Sin registro</span>
                )}
              </dd>
            </div>
            <div>
              <dt>Huella</dt>
              <dd>
                {registered.fingerprint ? (
                  <Chip tone="success" icon="check-circle">
                    Registrado
                  </Chip>
                ) : (
                  <span className="av-cell-sub">Sin registro</span>
                )}
              </dd>
            </div>
            {profile?.registeredAt !== undefined ? (
              <div>
                <dt>Último registro</dt>
                <dd>{formatDateTime(profile.registeredAt)}</dd>
              </div>
            ) : null}
          </dl>
          <div className="id-ficha__actions">
            {METHODS.map((method) => (
              <ButtonLink key={method} href={capturePath({ mode: registered[method] ? "verification" : "enrollment", personId: person.id, method })}>
                <Icon name={METHOD_ICON[method]} /> {registered[method] ? "Verificar" : "Registrar"} {METHOD_LABEL[method].toLowerCase()}
              </ButtonLink>
            ))}
          </div>
        </section>
      </div>

      <section className="av-surface" aria-labelledby="ficha-activity-title">
        <div className="av-toolbar av-toolbar--head">
          <h2 className="av-toolbar__title" id="ficha-activity-title">
            <Icon name="activity" /> Actividad reciente
          </h2>
          <Link className="av-link" href={`${HISTORY_PATH}?person=${person.id}`}>
            Ver todo el historial <Icon name="arrow-right" />
          </Link>
        </div>
        <EventsTable
          events={activity}
          people={people}
          variant="person"
          label="Actividad de la persona"
          empty={
            <EmptyState icon="activity" title="Sin actividad registrada">
              Registra o verifica a esta persona para ver eventos aquí.
            </EmptyState>
          }
        />
      </section>

      <section className="av-surface" aria-labelledby="ficha-docs-title">
        <div className="av-toolbar av-toolbar--head">
          <h2 className="av-toolbar__title" id="ficha-docs-title">
            <Icon name="file-earmark" /> Documentos
          </h2>
          <Link className="av-link" href="/documents">
            Ir a Documentos <Icon name="arrow-right" />
          </Link>
        </div>
        <DocumentsTable
          documents={personDocuments}
          label="Documentos de la persona"
          empty={
            <EmptyState icon="file-earmark" title="Sin documentos">
              Esta persona aún no tiene documentos en la plataforma.
            </EmptyState>
          }
        />
      </section>
    </div>
  );
}
