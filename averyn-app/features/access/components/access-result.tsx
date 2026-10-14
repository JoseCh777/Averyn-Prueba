"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";

import { RETRYABLE_REASONS, type GateOutcome } from "../gate-flow";
import { DECISION_LABEL, DENY_REASON_MESSAGE, DIRECTION_LABEL } from "../labels";
import type { AccessDirection } from "../types";

type AccessResultProps = {
  outcome: GateOutcome;
  direction: AccessDirection;
  onNext: () => void;
  onRetry: () => void;
};

type Tone = "ok" | "bad" | "warn";

const ICON: Record<Tone, IconName> = { ok: "check-circle-fill", bad: "x-circle-fill", warn: "exclamation-triangle" };

/**
 * Resultado del intento, pensado para leerse de lejos y de un vistazo: un icono grande, la palabra
 * «Autorizado» o «Denegado», la persona y el motivo en una frase.
 *
 * El color nunca va solo: siempre hay icono y texto. Un fallo del servicio de verificación se
 * muestra como advertencia y no como rechazo de la persona. El foco pasa a la tarjeta para que un
 * lector de pantalla anuncie el resultado y el operador pueda pulsar «Siguiente persona» con el teclado.
 *
 * @param props - El desenlace, el sentido y las acciones.
 * @returns La tarjeta de resultado.
 */
export function AccessResultCard({ outcome, direction, onNext, onRetry }: AccessResultProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  const granted = outcome.kind === "access" && outcome.data.decision === "GRANTED";
  const reason = outcome.kind === "identity" ? outcome.reason : outcome.data.denyReason;
  const tone: Tone = granted ? "ok" : reason === "VERIFICATION_ERROR" ? "warn" : "bad";
  const person = outcome.kind === "access" ? outcome.data.personName : undefined;
  const canRetry = !granted && reason !== null && RETRYABLE_REASONS.includes(reason) && outcome.kind === "access";

  return (
    <section ref={ref} tabIndex={-1} className={`acc-result acc-result--${tone}`} role="status" aria-live="polite">
      <span className="acc-result__icon" aria-hidden="true">
        <Icon name={ICON[tone]} />
      </span>
      <p className="acc-result__word">{granted ? DECISION_LABEL.GRANTED : DECISION_LABEL.DENIED}</p>
      {person !== undefined ? <p className="acc-result__person">{person}</p> : null}
      <p className="acc-result__reason">
        {granted ? `${DIRECTION_LABEL[direction]} registrada.` : reason === null ? "" : DENY_REASON_MESSAGE[reason]}
      </p>
      {outcome.kind === "access" ? (
        <p className="acc-result__meta">
          Registro n.º {outcome.data.accessLogId} · Dentro del evento: {outcome.data.occupancy}
        </p>
      ) : null}
      <div className="acc-result__actions">
        {canRetry ? (
          <Button variant="light" onClick={onRetry}>
            <Icon name="arrow-repeat" /> Repetir verificación
          </Button>
        ) : null}
        <Button onClick={onNext}>
          Siguiente persona <Icon name="arrow-right" />
        </Button>
      </div>
    </section>
  );
}
