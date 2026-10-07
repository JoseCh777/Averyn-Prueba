import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Alert, Chip } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { AFFILIATION_LABEL } from "@/features/identity/labels";
import { formatDocument } from "@/features/identity/person-rules";
import { personService } from "@/features/identity/services";
import { formatDateTime } from "@/lib/date-format";

import { VERIFICATION_THRESHOLD, formatScore } from "../biometric-rules";
import { captureFailure } from "../capture-state";
import { BIOMETRICS_PATH, VERIFICATION_PATH, capturePath, flowPath } from "../routes";
import { biometricService } from "../services";
import type { BiometricEvent } from "../types";
import { ScoreScale } from "./score-scale";

/** Frase del motivo de la decisión: la similitud contra el umbral. */
function similarityReason(score: number): string {
  const above = score >= VERIFICATION_THRESHOLD;
  return `${formatScore(score)} ${above ? "≥" : "<"} ${formatScore(VERIFICATION_THRESHOLD)}`;
}

/** Desenlace de la verificación: aceptada, rechazada, a repetir o sin dispositivo. */
function Outcome({ event }: { event: BiometricEvent }) {
  const failure = captureFailure(event.method);
  switch (event.result) {
    case "success":
      return (
        <Alert tone="success" title="Identidad verificada">
          La verificación biométrica coincide con el registro de la persona.
        </Alert>
      );
    case "rejected":
      return (
        <Alert tone="error" title="No pudimos verificar tu identidad">
          Vuelve a intentar la captura.
        </Alert>
      );
    case "retry":
      return (
        <Alert tone="warning" title={failure.title}>
          {failure.description}
        </Alert>
      );
    case "device":
      return (
        <Alert tone="warning" title="Sin dispositivo">
          No había un dispositivo conectado para esta modalidad. Conéctalo e inténtalo de nuevo.
        </Alert>
      );
    default:
      return null;
  }
}

/**
 * Resultado de una verificación biométrica.
 *
 * Lee el evento por su id y muestra lo que decidió el servicio: la persona no puede cambiar el
 * desenlace editando la URL. Con comparación muestra la similitud y el umbral; si hay que repetir
 * la captura, lo dice y ofrece hacerlo.
 *
 * @param props - El id del evento de verificación, tomado de la URL.
 * @returns El resultado o la pantalla «no encontrado».
 */
export async function VerificationResultView({ eventId }: { eventId: string }) {
  const event = await biometricService.getEvent(eventId);
  if (event === undefined || event.operation !== "verification") notFound();
  const person = await personService.getById(event.personId);
  const accepted = event.result === "success";
  const compared = event.score !== undefined && (event.result === "success" || event.result === "rejected");

  return (
    <div className="av-page bio-page bio-page--flow" role="region" aria-label="Contenido del resultado de verificación">
      <PageHeader
        icon="shield-check"
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Biometría", href: BIOMETRICS_PATH }, { label: "Verificar identidad", href: VERIFICATION_PATH }, { label: "Resultado" }]}
        title="Resultado de verificación"
        description="Desenlace de la comparación biométrica de la persona."
      />

      <section className="av-surface av-surface--pad av-surface--narrow bio-result" aria-label="Resultado de la verificación">
        <Outcome event={event} />

        {compared && event.score !== undefined ? (
          <div className="pt-vr">
            <div className="pt-vr__head">
              <h2 className="bio-result__title">Similitud biométrica</h2>
              <span className={accepted ? "pt-dec pt-dec--ok" : "pt-dec pt-dec--bad"} role="status">
                <Icon name={accepted ? "check-circle" : "x-circle"} />
                {accepted ? "Aceptada" : "Rechazada"}
              </span>
            </div>
            <div className="pt-score">
              <b>{formatScore(event.score)}</b>
              <span>
                {Math.abs(event.score - VERIFICATION_THRESHOLD) === 0
                  ? "Justo en el umbral."
                  : `${formatScore(Math.abs(event.score - VERIFICATION_THRESHOLD))} ${accepted ? "por encima" : "por debajo"} del umbral de ${formatScore(VERIFICATION_THRESHOLD)}.`}
              </span>
            </div>
            <ScoreScale score={event.score} />
            <ul className="pt-reasons">
              <li>
                <span>Similitud</span>
                <b className={accepted ? "ok" : "bad"}>
                  <Icon name={accepted ? "check-circle" : "x-circle"} />
                  {similarityReason(event.score)}
                </b>
              </li>
            </ul>
          </div>
        ) : null}

        {/* Solo la verificación aceptada abre el detalle de persona (biometrics-verification.js:84-95). */}
        {accepted ? (
          <dl className="av-detail">
            <div>
              <dt>Nombre</dt>
              <dd>{person?.name ?? "Persona eliminada"}</dd>
            </div>
            {person ? (
              <>
                <div>
                  <dt>Documento</dt>
                  <dd>{formatDocument(person.document)}</dd>
                </div>
                <div>
                  <dt>Afiliación</dt>
                  <dd>{AFFILIATION_LABEL[person.affiliation]}</dd>
                </div>
              </>
            ) : null}
            <div>
              <dt>Hora de verificación</dt>
              <dd>{formatDateTime(event.at)}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <Chip tone="success" icon="check-circle">
                  Verificado
                </Chip>
              </dd>
            </div>
          </dl>
        ) : null}

        <div className="bio-acta__actions">
          <ButtonLink href={BIOMETRICS_PATH}>Volver a Biometría</ButtonLink>
          {accepted && person ? (
            <ButtonLink href={`/identity/${person.id}`} variant="primary">
              Continuar <Icon name="arrow-right" />
            </ButtonLink>
          ) : person ? (
            <ButtonLink href={event.result === "device" ? flowPath("verification", person.id) : capturePath({ mode: "verification", personId: person.id, method: event.method })} variant="primary">
              <Icon name="arrow-repeat" /> {event.result === "retry" ? "Repetir captura" : "Reintentar"}
            </ButtonLink>
          ) : null}
        </div>
      </section>
    </div>
  );
}
