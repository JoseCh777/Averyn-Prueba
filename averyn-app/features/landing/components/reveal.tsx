"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Fracción visible del bloque que dispara el revelado. */
const REVEAL_THRESHOLD = 0.06;

type RevealState = "idle" | "hidden" | "visible";

interface RevealProps {
  className: string;
  children: ReactNode;
}

/**
 * Bloque que aparece suave al entrar en pantalla.
 *
 * Se renderiza visible en el servidor (sin JavaScript el contenido se ve). Al montar, solo se
 * oculta si está por debajo del viewport; así lo que ya está a la vista no parpadea.
 * Con `prefers-reduced-motion` la hoja de estilos anula el movimiento.
 *
 * @returns Un `div` con la clase `mn-reveal`.
 */
export function Reveal({ className, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const element = ref.current;
    if (element === null || !("IntersectionObserver" in window)) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setState("visible");
        observer.disconnect();
      },
      { threshold: REVEAL_THRESHOLD },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} mn-reveal`} data-reveal={state}>
      {children}
    </div>
  );
}
