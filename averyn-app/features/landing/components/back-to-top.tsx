"use client";

import { useEffect, useState } from "react";

/** El botón aparece tras bajar 1,5 pantallas. */
const VISIBLE_AFTER_SCREENS = 1.5;

/**
 * Botón flotante «Volver arriba». Mientras no se ve, tampoco recibe foco ni se anuncia.
 *
 * @returns El botón.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * VISIBLE_AFTER_SCREENS);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      className={visible ? "mn-top is-visible" : "mn-top"}
      type="button"
      aria-label="Volver arriba"
      inert={!visible}
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
}
