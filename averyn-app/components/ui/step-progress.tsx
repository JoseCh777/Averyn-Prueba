import { Icon, type IconName } from "./icon";

/** Un paso de un proceso que ocupa varias pantallas. */
export type ProgressStep = {
  title: string;
  /** `done` ya se hizo, `current` es el actual y `locked` espera a los anteriores (se muestra como «Bloqueado»). */
  state: "done" | "current" | "locked";
  /** Icono propio del paso (el stepper original de Documentos/Electoral pinta uno por paso). */
  icon?: IconName;
};

const STATE_LABEL: Record<ProgressStep["state"], string> = { done: "Completado", current: "En curso", locked: "Bloqueado" };

/**
 * Progreso vertical de un proceso por pasos (por ejemplo, el registro de una persona).
 *
 * Es solo presentación: cada pantalla del proceso dice en qué paso está. El paso actual lleva
 * `aria-current="step"` y el estado de cada uno está escrito, no solo marcado con color.
 *
 * @param props - Los pasos y el nombre accesible de la lista.
 * @returns La lista de pasos.
 */
export function StepProgress({ steps, label }: { steps: readonly ProgressStep[]; label: string }) {
  return (
    <ol className="av-steps" aria-label={label}>
      {steps.map((step, index) => (
        <li key={step.title} className="av-steps__item" data-state={step.state} aria-current={step.state === "current" ? "step" : undefined}>
          <span className="av-steps__marker" aria-hidden="true">
            {step.state === "done" ? <Icon name="check-lg" /> : step.icon ? <Icon name={step.icon} /> : index + 1}
          </span>
          <span className="av-steps__text">
            <span className="av-steps__title">{step.title}</span>
            <span className="av-steps__status">{STATE_LABEL[step.state]}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
