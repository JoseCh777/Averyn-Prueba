import { ABOUT_ITEMS, CAPABILITIES, SOLUTIONS, orderLabel } from "../content";
import { ItemList, MediaSlot, SectionLabel } from "./landing-parts";
import { Reveal } from "./reveal";

/**
 * «Qué es»: la definición del producto y sus tres rasgos.
 *
 * @returns La sección `#que-es`.
 */
export function AboutSection() {
  return (
    <section id="que-es" className="mn-section mn-que" aria-labelledby="que-es-title">
      <Reveal className="mn-wrap mn-grid">
        <h2 className="mn-title" id="que-es-title">
          Una plataforma institucional, no un simple sistema de votación.
        </h2>
        <p className="mn-lead">
          Averyn centraliza la identificación, la autenticación y la automatización de procesos institucionales mediante
          biometría, inteligencia artificial, OCR y mecanismos de seguridad.
        </p>
        <MediaSlot className="mn-que__media" hint="Imagen · 4:5" />
        <ItemList className="mn-que__list" items={ABOUT_ITEMS} />
      </Reveal>
    </section>
  );
}

/**
 * «Capacidades»: sección oscura con columna fija y la lista numerada.
 *
 * @returns La sección `#capacidades`.
 */
export function CapabilitiesSection() {
  return (
    <section id="capacidades" className="mn-section mn-dark" aria-labelledby="capacidades-title">
      <Reveal className="mn-wrap mn-grid">
        <div className="mn-cap__side">
          <SectionLabel>Capacidades</SectionLabel>
          <h2 className="mn-title" id="capacidades-title">
            Capacidades para operar con claridad.
          </h2>
          <p className="mn-lead">
            Desde la gestión de identidad y la biometría hasta el procesamiento documental y la auditoría, cada capacidad está
            conectada para automatizar procesos reales.
          </p>
        </div>
        <div className="mn-cap__list">
          {CAPABILITIES.map((capability, index) => (
            <article key={capability.title} className="mn-row">
              <span className="mn-mono">{orderLabel(index)}</span>
              <div>
                <h3>{capability.title}</h3>
                <p>{capability.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/**
 * «Soluciones»: columnas escalonadas y una panorámica descentrada.
 *
 * @returns La sección `#soluciones`.
 */
export function SolutionsSection() {
  return (
    <section id="soluciones" className="mn-section" aria-labelledby="soluciones-title">
      <Reveal className="mn-wrap mn-grid">
        <div className="mn-sol__head">
          <SectionLabel>Soluciones</SectionLabel>
          <h2 className="mn-title" id="soluciones-title">
            Soluciones para cada institución.
          </h2>
        </div>
        <p className="mn-lead mn-sol__intro">
          Elecciones deja de ser el centro absoluto del producto: el núcleo común respalda múltiples módulos de negocio.
        </p>
        <div className="mn-sol__items">
          {SOLUTIONS.map((solution) => (
            <article key={solution.title} className="mn-sol">
              <h3>{solution.title}</h3>
              <p>{solution.text}</p>
            </article>
          ))}
        </div>
        <MediaSlot className="mn-sol__media" hint="Imagen o video · 21:9" />
      </Reveal>
    </section>
  );
}
