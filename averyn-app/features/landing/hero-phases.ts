/**
 * Matemática del hero guiado por scroll de la landing.
 *
 * El hero es una sección alta con un escenario fijo (`position: sticky`). A medida que se
 * desplaza, el progreso (0 a 1) se reparte en tres fases que la hoja `av-landing.css` lee
 * como variables `--t1`, `--t2` y `--t3`:
 *
 * - `t1`: la «A» negra se abre y aparece la palabra «Averyn».
 * - `t2`: el logo se reduce y sube; el navy cae desde abajo.
 * - `t3`: aparecen la figura de arcos, el título y los botones.
 *
 * Son funciones puras para poder probarlas sin navegador.
 */

/** Fases del hero, cada una entre 0 y 1. */
export interface HeroPhases {
  t1: number;
  t2: number;
  t3: number;
}

/** Tramo del progreso que ocupa cada fase (se solapan t2 y t3 para que la transición sea continua). */
export const HERO_PHASE_RANGES = {
  t1: [0.04, 0.3],
  t2: [0.3, 0.5],
  t3: [0.42, 0.72],
} as const;

/** Estado final: es el que se muestra sin movimiento (`prefers-reduced-motion`). */
export const HERO_FINAL_PHASES: HeroPhases = { t1: 1, t2: 1, t3: 1 };

/** Por debajo de este valor de `t2` el logo del encabezado no se ve: no recibe foco. */
export const BRAND_VISIBLE_FROM = 0.6;

/** Por debajo de este valor de `t3` el texto del hero no se ve: no recibe foco. */
export const COPY_VISIBLE_FROM = 0.5;

/** Ancho final del logo del hero, en px, y la fracción del viewport que ocupa. */
const FINAL_LOGO_MIN_PX = 186;
const FINAL_LOGO_MAX_PX = 372;
const FINAL_LOGO_VIEWPORT_RATIO = 0.258;

/**
 * Limita un valor al intervalo [0, 1].
 *
 * @param value - Valor de entrada.
 * @returns El valor recortado.
 */
export function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Curva suave (smoothstep): arranca y termina despacio.
 *
 * @param t - Valor entre 0 y 1.
 * @returns El valor suavizado, también entre 0 y 1.
 */
export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Avance de una fase dentro de su tramo del progreso.
 *
 * @param progress - Progreso total del hero (0 a 1).
 * @param from - Inicio del tramo.
 * @param to - Fin del tramo (mayor que `from`).
 * @returns 0 antes del tramo, 1 después y una curva suave en medio.
 */
export function phaseProgress(progress: number, from: number, to: number): number {
  return smoothstep(clampUnit((progress - from) / (to - from)));
}

/**
 * Calcula las tres fases a partir del progreso del scroll.
 *
 * @param progress - Progreso total del hero (0 a 1; se recorta si sale del rango).
 * @returns Las fases `t1`, `t2` y `t3`.
 */
export function heroPhases(progress: number): HeroPhases {
  const { t1, t2, t3 } = HERO_PHASE_RANGES;
  return {
    t1: phaseProgress(progress, t1[0], t1[1]),
    t2: phaseProgress(progress, t2[0], t2[1]),
    t3: phaseProgress(progress, t3[0], t3[1]),
  };
}

/**
 * Progreso del hero según la posición de la sección.
 *
 * @param stageTop - `top` de la sección respecto al viewport (negativo al bajar).
 * @param stageHeight - Alto total de la sección.
 * @param viewportHeight - Alto del viewport.
 * @returns 0 al empezar, 1 cuando el escenario fijo termina; 1 si la sección no es más alta que la pantalla.
 */
export function heroProgress(stageTop: number, stageHeight: number, viewportHeight: number): number {
  const span = stageHeight - viewportHeight;
  return span > 0 ? clampUnit(-stageTop / span) : 1;
}

/**
 * Escala final del logo del hero.
 *
 * El logo se maqueta grande y solo se reduce (así nunca se amplía y no se ve borroso).
 * Al final ocupa el 25,8 % del viewport, entre 186 y 372 px.
 *
 * @param lockupWidth - Ancho maquetado del logo, en px.
 * @param viewportWidth - Ancho del viewport, en px.
 * @returns La escala (de 0 a 1) que la hoja de estilos lee como `--sf`.
 */
export function finalLogoScale(lockupWidth: number, viewportWidth: number): number {
  if (lockupWidth <= 0) return 1;
  const finalWidth = Math.min(FINAL_LOGO_MAX_PX, Math.max(FINAL_LOGO_MIN_PX, viewportWidth * FINAL_LOGO_VIEWPORT_RATIO));
  return Math.min(1, finalWidth / lockupWidth);
}
