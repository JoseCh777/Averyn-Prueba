import type { ComponentType, SVGProps } from "react";
import { CheckLg, ClipboardCheck, InfoCircle, LockFill, People, Sliders } from "react-bootstrap-icons";

type StepState = "done" | "current" | "locked";

/** Icono de cada paso cuando está en curso: el `data-icono` del original (bi-info-circle, bi-sliders, …). */
const STEP_ICON: readonly ComponentType<SVGProps<SVGSVGElement>>[] = [InfoCircle, Sliders, People, ClipboardCheck];

/** Estado escrito de cada paso: el original no deja el estado solo en el color. */
const STATE_STATUS: Record<StepState, string> = { done: "Completado", current: "En curso", locked: "Bloqueado" };

/**
 * Stepper vertical del asistente, con la forma del original (`.av-stepper`): marcador circular con conector,
 * título y estado de cada paso.
 *
 * Solo presentación: los anteriores quedan «Completado» con el check, el actual «En curso» con su icono y
 * los siguientes «Bloqueado» con el candado.
 *
 * @param props - Los títulos de los pasos, el paso actual (1 en adelante) y el nombre accesible de la lista.
 * @returns La lista de pasos.
 */
export function ElectionStepper({ steps, current, label }: { steps: readonly string[]; current: number; label: string }) {
  return (
    <ol className="av-stepper" aria-label={label}>
      {steps.map((title, index) => {
        const state: StepState = index + 1 < current ? "done" : index + 1 === current ? "current" : "locked";
        const StepIcon = state === "done" ? CheckLg : state === "locked" ? LockFill : STEP_ICON[index] ?? InfoCircle;
        return (
          <li key={title} className={`av-stepper__step av-stepper__step--${state}`} aria-current={state === "current" ? "step" : undefined}>
            <span className="av-stepper__marker" aria-hidden="true">
              <StepIcon />
            </span>
            <span className="av-stepper__info">
              <span className="av-stepper__title">{title}</span>
              <span className="av-stepper__status">{STATE_STATUS[state]}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
