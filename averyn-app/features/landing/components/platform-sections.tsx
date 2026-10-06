import { ARCHITECTURE_FLOW, ARCHITECTURE_ITEMS, PROCESS_STEPS, SECURITY_ITEMS, TECHNOLOGIES, orderLabel } from "../content";
import { ItemList, MediaSlot } from "./landing-parts";
import { Reveal } from "./reveal";

/**
 * «Tecnología»: las tecnologías como texto corrido.
 *
 * @returns La sección `#tecnologia`.
 */
export function TechnologySection() {
  return (
    <section id="tecnologia" className="mn-section mn-soft" aria-labelledby="tecnologia-title">
      <Reveal className="mn-wrap mn-grid">
        <div className="mn-tec__head">
          <h2 className="mn-title" id="tecnologia-title">
            Tecnología detrás de la plataforma.
          </h2>
          <p className="mn-lead mn-lead--spaced">
            Soluciones abiertas e interoperables, elegidas por necesidad concreta y no por acumular tecnologías.
          </p>
        </div>
        <ul className="mn-tec__words">
          {TECHNOLOGIES.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/**
 * «Proceso»: los tres pasos en escalera.
 *
 * @returns La sección `#proceso`.
 */
export function ProcessSection() {
  return (
    <section id="proceso" className="mn-section" aria-labelledby="proceso-title">
      <Reveal className="mn-wrap mn-grid">
        <div className="mn-proc__head">
          <h2 className="mn-title" id="proceso-title">
            Cómo funciona.
          </h2>
        </div>
        {PROCESS_STEPS.map((step, index) => (
          <article key={step.title} className="mn-step">
            <div className="mn-step__n" aria-hidden="true">
              {orderLabel(index)}
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </Reveal>
    </section>
  );
}

/**
 * «Arquitectura»: los dominios del núcleo y el flujo de alto nivel.
 *
 * @returns La sección `#arquitectura`.
 */
export function ArchitectureSection() {
  return (
    <section id="arquitectura" className="mn-section mn-soft" aria-labelledby="arquitectura-title">
      <Reveal className="mn-wrap mn-grid">
        <div className="mn-arq__head">
          <h2 className="mn-title" id="arquitectura-title">
            Arquitectura orientada a dominio.
          </h2>
        </div>
        <p className="mn-lead mn-arq__intro">
          Un monolito modular que separa responsabilidades del núcleo (identidad, biometría, IA, seguridad) de los módulos de
          negocio.
        </p>
        <ItemList className="mn-arq__list" items={ARCHITECTURE_ITEMS} />
        <MediaSlot className="mn-arq__media" hint="Video · 16:9" />
        <div className="mn-flow" role="group" aria-label="Flujo de integración de alto nivel de Averyn">
          {ARCHITECTURE_FLOW.map((stage, index) => (
            <FlowStage key={stage.label} label={stage.label} core={stage.core} last={index === ARCHITECTURE_FLOW.length - 1} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/** Una etapa del flujo y, si no es la última, la línea que la une con la siguiente. */
function FlowStage({ label, core, last }: { label: string; core: boolean; last: boolean }) {
  return (
    <>
      <span className={core ? "is-core" : undefined}>{label}</span>
      {last ? null : <i aria-hidden="true" />}
    </>
  );
}

/**
 * «Seguridad»: columna fija y la rejilla de controles.
 *
 * @returns La sección `#seguridad`.
 */
export function SecuritySection() {
  return (
    <section id="seguridad" className="mn-section" aria-labelledby="seguridad-title">
      <Reveal className="mn-wrap mn-grid">
        <div className="mn-seg__side">
          <h2 className="mn-title" id="seguridad-title">
            Seguridad por diseño.
          </h2>
          <p className="mn-lead">
            La seguridad es un dominio de primera clase: cada operación crítica genera auditoría y cada tenant permanece aislado.
          </p>
        </div>
        <ul className="mn-seg__grid">
          {SECURITY_ITEMS.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
