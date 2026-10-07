"use client";

import { useEffect, useRef, useState } from "react";

import {
  BRAND_VISIBLE_FROM,
  COPY_VISIBLE_FROM,
  HERO_FINAL_PHASES,
  finalLogoScale,
  heroPhases,
  heroProgress,
  type HeroPhases,
} from "./hero-phases";

/** Qué partes del hero se ven: lo que no se ve no recibe foco ni lo leen los lectores de pantalla. */
interface HeroVisibility {
  brandVisible: boolean;
  copyVisible: boolean;
}

/**
 * Escribe las fases como variables CSS (`--t1`, `--t2`, `--t3`) sobre un elemento.
 * Se escriben directo en el DOM para no volver a renderizar en cada cuadro del scroll.
 */
function writePhases(element: HTMLElement, phases: HeroPhases): void {
  element.style.setProperty("--t1", phases.t1.toFixed(4));
  element.style.setProperty("--t2", phases.t2.toFixed(4));
  element.style.setProperty("--t3", phases.t3.toFixed(4));
}

/**
 * Conduce el hero guiado por scroll.
 *
 * - `scopeRef`: el contenedor donde se escriben las variables (la raíz `.mn` de la landing).
 * - `stageRef`: la sección alta del hero; su posición da el progreso.
 * - `lockupRef`: el logo; recibe `--sf` (su escala final según el ancho de pantalla).
 *
 * Con `prefers-reduced-motion` muestra el estado final y no escucha el scroll.
 * El cálculo se agrupa en un `requestAnimationFrame` por cuadro.
 *
 * @returns Las referencias que hay que asignar y qué partes están visibles.
 */
export function useHeroScroll() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const [visibility, setVisibility] = useState<HeroVisibility>({ brandVisible: false, copyVisible: false });

  useEffect(() => {
    const scope = scopeRef.current;
    const stage = stageRef.current;
    const lockup = lockupRef.current;
    if (scope === null || stage === null || lockup === null) return;

    const apply = (phases: HeroPhases) => {
      writePhases(scope, phases);
      const next = { brandVisible: phases.t2 >= BRAND_VISIBLE_FROM, copyVisible: phases.t3 >= COPY_VISIBLE_FROM };
      setVisibility((current) =>
        current.brandVisible === next.brandVisible && current.copyVisible === next.copyVisible ? current : next,
      );
    };

    /* La escala final del logo se calcula siempre: también con movimiento reducido
       (igual que home.js del original, donde fitLogo corre antes de cualquier rama). */
    const fitLogo = () => {
      lockup.style.setProperty("--sf", finalLogoScale(lockup.offsetWidth, window.innerWidth).toFixed(4));
    };
    fitLogo();
    window.addEventListener("resize", fitLogo);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(HERO_FINAL_PHASES);
      return () => window.removeEventListener("resize", fitLogo);
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      apply(heroPhases(heroProgress(rect.top, stage.offsetHeight, window.innerHeight)));
    };
    const requestUpdate = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", fitLogo);
      window.removeEventListener("resize", requestUpdate);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  return { scopeRef, stageRef, lockupRef, ...visibility };
}
