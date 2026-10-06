/** Arcos de la figura de la bienvenida (viewBox 320×170): líneas finas que se leen como la firma de la marca. */
const HERO_ARCS = [
  { path: "M20 165 C60 30 190 20 240 165", stroke: "#145FEE", width: 1.5 },
  { path: "M60 165 C90 70 170 60 205 165", stroke: "#00ACD2", width: 2 },
  { path: "M100 165 C118 105 150 100 170 165", stroke: "#145FEE", width: 1 },
  { path: "M150 6 L290 165", stroke: "#145FEE", width: 1.5 },
  { path: "M176 -6 L316 153", stroke: "#00ACD2", width: 1.5 },
] as const;

/**
 * Bienvenida del panel: título, descripción y la figura de arcos de la marca.
 *
 * La figura es decorativa (`aria-hidden`); el contenido es el texto.
 *
 * @returns La sección de bienvenida.
 */
export function DashboardHero() {
  return (
    <section className="av-dashboard__hero" aria-labelledby="dashboard-title">
      <div>
        <h1 id="dashboard-title" className="av-dashboard__title">Todo en un solo lugar</h1>
        <p className="av-dashboard__lead">
          Gestiona identidad, documentos, biometría e inteligencia artificial desde un mismo panel, con visibilidad completa de la
          operación institucional.
        </p>
      </div>
      <svg className="av-dashboard__figure" viewBox="0 0 320 170" aria-hidden="true" focusable="false">
        <path d="M0 165 H320" stroke="rgba(20,95,238,.25)" strokeWidth={1} fill="none" />
        {HERO_ARCS.map((arc) => (
          <path key={arc.path} d={arc.path} stroke={arc.stroke} strokeWidth={arc.width} fill="none" />
        ))}
      </svg>
    </section>
  );
}
