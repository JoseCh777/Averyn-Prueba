/** Logo del panel de marca: wordmark negro sobre la zona clara del degradado. */
const BRAND_LOGO_SRC = "/assets/images/averyn-logo-font-black.avif";

/** Pausa entre el trazo de un arco y el siguiente, en segundos. */
const ARC_DELAY_STEP_S = 0.14;

/** Arcos de la figura de marca (viewBox 640×300): los tres concéntricos y las dos diagonales. */
const ARCS = [
  { path: "M30 290 C110 60 330 40 450 290", stroke: "#FFFFFF", width: 1.5 },
  { path: "M90 290 C150 110 300 95 390 290", stroke: "#00ACD2", width: 2 },
  { path: "M150 290 C190 170 270 160 330 290", stroke: "#55D6FF", width: 1.5 },
  { path: "M300 8 L545 290", stroke: "#3D86FF", width: 2 },
  { path: "M326 -32 L605 290", stroke: "#3D86FF", width: 2 },
] as const;

/**
 * Panel de marca del login: logo, figura de arcos y el mensaje de bienvenida.
 *
 * Es decorativo salvo el texto; la figura va oculta a los lectores de pantalla y sus
 * trazos respetan `prefers-reduced-motion` (ver `av-login.css`).
 *
 * @returns El panel lateral del login.
 */
export function LoginBrandPanel() {
  return (
    <aside className="av-login__side" aria-label="Información de Averyn">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="av-login__brand" src={BRAND_LOGO_SRC} alt="Averyn" />

      <div className="av-login__figure" aria-hidden="true">
        <svg viewBox="0 0 640 300" focusable="false">
          <path d="M0 290 H640" stroke="rgba(255,255,255,.22)" strokeWidth={1} />
          {ARCS.map((arc, index) => (
            <path
              key={arc.path}
              className="av-login__arc"
              d={arc.path}
              pathLength={1}
              stroke={arc.stroke}
              strokeWidth={arc.width}
              style={{ animationDelay: `${index * ARC_DELAY_STEP_S + 0.15}s` }}
            />
          ))}
        </svg>
      </div>

      <div className="av-login__copy">
        <p className="av-login__copy-title">Ingresa a tu panel.</p>
        <p>
          Centraliza la identidad, la verificación biométrica y la automatización de tus procesos institucionales en una sola
          plataforma.
        </p>
      </div>
    </aside>
  );
}
