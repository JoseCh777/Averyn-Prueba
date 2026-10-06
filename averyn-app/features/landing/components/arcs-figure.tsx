/** Un trazo de una figura de arcos. */
interface Arc {
  path: string;
  stroke: string;
  width: number;
}

/** Arcos del hero (viewBox 640×300): la misma firma de marca que el login. */
const HERO_ARCS: readonly Arc[] = [
  { path: "M0 290 H640", stroke: "rgba(255,255,255,.22)", width: 1 },
  { path: "M30 290 C110 60 330 40 450 290", stroke: "#FFFFFF", width: 1.5 },
  { path: "M90 290 C150 110 300 95 390 290", stroke: "#00ACD2", width: 2 },
  { path: "M150 290 C190 170 270 160 330 290", stroke: "#55D6FF", width: 1.5 },
  { path: "M300 8 L545 290", stroke: "#3D86FF", width: 2 },
  { path: "M326 -32 L605 290", stroke: "#3D86FF", width: 2 },
];

/** Arcos del cierre (viewBox 760×520), sobre el fondo azul. */
const CTA_ARCS: readonly Arc[] = [
  { path: "M0 520 H760", stroke: "rgba(255,255,255,.28)", width: 1 },
  { path: "M40 520 C120 120 520 60 700 520", stroke: "rgba(255,255,255,.9)", width: 1.5 },
  { path: "M120 520 C190 230 460 190 600 520", stroke: "#55D6FF", width: 2 },
  { path: "M200 520 C250 340 400 320 500 520", stroke: "rgba(255,255,255,.55)", width: 1.5 },
  { path: "M280 520 C310 430 360 425 400 520", stroke: "#00ACD2", width: 2 },
  { path: "M470 20 L760 400", stroke: "rgba(0,12,36,.45)", width: 2 },
  { path: "M507 -37 L840 400", stroke: "rgba(0,12,36,.45)", width: 2 },
];

const FIGURES = {
  hero: { viewBox: "0 0 640 300", arcs: HERO_ARCS },
  cta: { viewBox: "0 0 760 520", arcs: CTA_ARCS },
} as const;

interface ArcsFigureProps {
  /** Qué figura dibujar. */
  variant: keyof typeof FIGURES;
  className: string;
}

/**
 * Figura decorativa de arcos de la marca (oculta a los lectores de pantalla).
 *
 * Los trazos usan `pathLength=1`: en el hero la hoja de estilos los dibuja con `--t3`.
 *
 * @returns El SVG dentro de su contenedor.
 */
export function ArcsFigure({ variant, className }: ArcsFigureProps) {
  const figure = FIGURES[variant];
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox={figure.viewBox} focusable="false">
        {figure.arcs.map((arc) => (
          <path key={arc.path} d={arc.path} pathLength={1} stroke={arc.stroke} strokeWidth={arc.width} />
        ))}
      </svg>
    </div>
  );
}
