import { Icon } from "@/components/ui/icon";

import { METHOD_LABEL } from "../labels";
import type { PolicyGroup } from "../types";

type PolicyStepsProps = {
  policy: readonly PolicyGroup[];
  /** Cuántos grupos ya se cumplieron. */
  satisfied: number;
};

const STATUS_TEXT = { done: "Verificado", current: "En curso", locked: "Pendiente" } as const;

/**
 * Pasos de la política del punto de control: qué se pide a cada persona y cuánto va cumplido.
 *
 * Reutiliza el stepper vertical del Design System (`av-stepper`). Un grupo con alternativas se
 * lee «Rostro o huella». El estado se dice con texto además del marcador.
 *
 * @param props - La política y cuántos grupos están cumplidos.
 * @returns La lista de pasos, o un aviso si el punto no pide verificación.
 */
export function PolicySteps({ policy, satisfied }: PolicyStepsProps) {
  if (policy.length === 0) {
    return <p className="acc-hint">Este punto no pide verificación: elija quién sale.</p>;
  }
  return (
    <ol className="av-stepper acc-steps" aria-label="Pasos de verificación">
      {policy.map((group, index) => {
        const state = index < satisfied ? "done" : index === satisfied ? "current" : "locked";
        return (
          <li key={group.join("-")} className={`av-stepper__step av-stepper__step--${state}`} aria-current={state === "current" ? "step" : undefined}>
            <span className="av-stepper__marker">{state === "done" ? <Icon name="check-lg" /> : index + 1}</span>
            <span className="av-stepper__info">
              <span className="av-stepper__title">{group.map((method) => METHOD_LABEL[method]).join(" o ")}</span>
              <span className="av-stepper__status">{STATUS_TEXT[state]}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
