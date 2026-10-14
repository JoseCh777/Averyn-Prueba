import { notFound } from "next/navigation";
import { Building } from "react-bootstrap-icons";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Tag } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { AFFILIATION_LABEL } from "@/features/identity/labels";
import { formatDateTime } from "@/lib/date-format";

import { electionInitials, formatDateRange } from "../election-rules";
import {
  ELECTION_STATUS_CHIP,
  INSTITUTION_LABEL,
  PROCESS_KIND_LABEL,
  SETTING_SWITCHES,
  VOTING_MODE_LABEL,
  VOTING_TYPE_LABEL,
} from "../labels";
import { electionService } from "../services";

/**
 * Detalle de un proceso electoral: identidad de la convocatoria, configuración de votación y padrón.
 *
 * Es un Server Component asíncrono: pide el proceso al servicio (`getById`), así que mientras
 * llega se muestra `loading.tsx` y, si no existe, `notFound()` dibuja el 404. El estado vacío del
 * listado y este detalle cubren el módulo: el prototipo no llega a tener detalle de proceso.
 *
 * @param props - El id del proceso, tomado de la URL.
 * @returns La pantalla de detalle.
 */
export async function ElectionDetailView({ electionId }: { electionId: string }) {
  const election = await electionService.getById(electionId);
  if (election === undefined) notFound();

  const status = ELECTION_STATUS_CHIP[election.status];
  const StatusIcon = status.icon;
  const { settings, participants } = election;
  const affiliation = participants.affiliation === "all" ? "Todas las afiliaciones" : AFFILIATION_LABEL[participants.affiliation];

  return (
    <div className="av-page" role="region" aria-label="Detalle del proceso electoral">
      <PageHeader
        title="Detalle del proceso"
        description="Convocatoria, configuración de votación y padrón del proceso."
        actions={
          <ButtonLink href="/elections">
            <Icon name="arrow-left" /> Volver al listado
          </ButtonLink>
        }
      />

      <div className="av-ficha">
        <section className="av-surface av-surface--pad" aria-label={`Proceso ${election.name}`}>
          <div className="av-profile">
            <span className="av-initials av-initials--lg" aria-hidden="true">
              {electionInitials(election.name)}
            </span>
            <div>
              <h2>{election.name}</h2>
              <p>{PROCESS_KIND_LABEL[election.kind]}</p>
            </div>
          </div>
          <dl className="av-detail">
            <div>
              <dt>Estado</dt>
              <dd>
                {/* Mismo chip que la tabla del listado, con el icono importado a mano. */}
                <span className={`av-chip av-chip--${status.tone}`}>
                  <StatusIcon aria-hidden="true" focusable="false" />
                  {status.label}
                </span>
              </dd>
            </div>
            <div>
              <dt>Institución</dt>
              <dd>
                <Tag>
                  <Building aria-hidden="true" focusable="false" /> {INSTITUTION_LABEL[election.institution]}
                </Tag>
              </dd>
            </div>
            <div>
              <dt>Periodo de votación</dt>
              <dd>{formatDateRange(election.startDate, election.endDate)}</dd>
            </div>
            <div>
              <dt>Creado</dt>
              <dd>{formatDateTime(election.createdAt)}</dd>
            </div>
            {election.description.trim() !== "" ? (
              <div>
                <dt>Descripción</dt>
                <dd>{election.description}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="av-surface av-surface--pad" aria-label="Configuración de votación">
          <div className="av-surface__head">
            <h2>Configuración</h2>
            <p>Cómo se emite el voto y qué se muestra en este proceso.</p>
          </div>
          <dl className="av-detail">
            <div>
              <dt>Tipo de voto</dt>
              <dd>{VOTING_TYPE_LABEL[settings.votingType]}</dd>
            </div>
            <div>
              <dt>Opciones por voto</dt>
              <dd>{settings.choicesPerVote}</dd>
            </div>
            <div>
              <dt>Modalidad</dt>
              <dd>{VOTING_MODE_LABEL[settings.mode]}</dd>
            </div>
            {SETTING_SWITCHES.map((option) => (
              <div key={option.key}>
                <dt>{option.label}</dt>
                <dd>{settings[option.key] ? "Sí" : "No"}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="av-surface av-surface--pad" aria-label="Padrón de votantes">
        <div className="av-surface__head">
          <h2>Padrón</h2>
          <p>Personas convocadas y cuántas pueden votar.</p>
        </div>
        <dl className="av-detail">
          <div>
            <dt>Convocatoria</dt>
            <dd>{affiliation}</dd>
          </div>
          <div>
            <dt>Convocados</dt>
            <dd>{participants.eligible} personas</dd>
          </div>
          <div>
            <dt>Pueden votar</dt>
            <dd>{participants.verified} verificadas</dd>
          </div>
        </dl>
        <p className="av-cell-sub">Solo las personas con identidad verificada podrán emitir su voto.</p>
      </section>
    </div>
  );
}
