import { AFFILIATION_LABEL } from "@/features/identity/labels";
import { parseAffiliation } from "@/features/identity/person-rules";
import type { Person } from "@/features/identity/types";

import { countParticipants, formatDateRange } from "../election-rules";
import { INSTITUTION_LABEL, PROCESS_KIND_LABEL, SETTING_SWITCHES, VOTING_MODE_LABEL, VOTING_TYPE_LABEL } from "../labels";
import type { ElectionSettings, GeneralInfoInput, InstitutionKind, ProcessKind } from "../types";

type ReviewStepProps = {
  general: GeneralInfoInput;
  /** Configuración ya validada. */
  settings: ElectionSettings;
  affiliation: string;
  people: readonly Person[];
  institution: InstitutionKind;
  kind: ProcessKind;
};

/** Una fila clave/valor del resumen. */
function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/**
 * Paso 4 del asistente: el resumen de lo que se va a crear, en tres bloques.
 *
 * Es solo lectura: para cambiar algo se vuelve a un paso anterior (los datos no se pierden).
 *
 * @param props - Los datos ya validados de los tres pasos anteriores.
 * @returns El resumen.
 */
export function ReviewStep({ general, settings, affiliation, people, institution, kind }: ReviewStepProps) {
  const chosen = parseAffiliation(affiliation) ?? "all";
  const counts = countParticipants(people, chosen);
  return (
    <div className="elec-review">
      <section className="elec-review__block" aria-labelledby="review-general">
        <h3 id="review-general" className="elec-subtitle">
          Información general
        </h3>
        <dl className="av-detail">
          <Row term="Nombre">{general.name.trim()}</Row>
          <Row term="Descripción">{general.description.trim()}</Row>
          <Row term="Institución">{INSTITUTION_LABEL[institution]}</Row>
          <Row term="Tipo de proceso">{PROCESS_KIND_LABEL[kind]}</Row>
          <Row term="Fechas">{formatDateRange(general.startDate, general.endDate)}</Row>
        </dl>
      </section>

      <section className="elec-review__block" aria-labelledby="review-settings">
        <h3 id="review-settings" className="elec-subtitle">
          Configuración
        </h3>
        <dl className="av-detail">
          <Row term="Tipo de votación">{VOTING_TYPE_LABEL[settings.votingType]}</Row>
          <Row term="Opciones por voto">{settings.choicesPerVote}</Row>
          <Row term="Modalidad">{VOTING_MODE_LABEL[settings.mode]}</Row>
          {SETTING_SWITCHES.map((option) => (
            <Row key={option.key} term={option.label}>
              {settings[option.key] ? "Sí" : "No"}
            </Row>
          ))}
        </dl>
      </section>

      <section className="elec-review__block" aria-labelledby="review-participants">
        <h3 id="review-participants" className="elec-subtitle">
          Participantes
        </h3>
        <dl className="av-detail">
          <Row term="Afiliación convocada">{chosen === "all" ? "Todas" : AFFILIATION_LABEL[chosen]}</Row>
          <Row term="Convocados">{counts.eligible}</Row>
          <Row term="Podrán votar (verificados)">{counts.verified}</Row>
        </dl>
      </section>
    </div>
  );
}
