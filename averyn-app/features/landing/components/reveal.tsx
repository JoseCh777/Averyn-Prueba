"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Fracción visible del bloque que dispara el revelado. */
const REVEAL_THRESHOLD = 0.06;

interface RevealProps {
  className: string;
  children: ReactNode;
}

/**
 * Bloque que aparece suave al entrar en pantalla.
 *
 * Se renderiza sin `is-visible`; quien lo oculta es la hoja de estilos con la clase
 * `.js` de `<html>` (la añade el guion de la landing antes del primer pintado), así que
 * sin JavaScript el contenido siempre se ve. Al montar, un `IntersectionObserver` añade
 * `is-visible` al entrar un 6 % en pantalla y ya no se vuelve a ocultar: es el mismo
 * contrato que `home.js` del frontend original (`threshold: 0.06`, una sola observación).
 * Con `prefers-reduced-motion` la hoja de estilos anula el movimiento.
 *
 * @returns Un `div` con la clase `mn-reveal`.
 */
export function Reveal({ className, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (element === null) return;
    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: REVEAL_THRESHOLD },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} mn-reveal`}>
      {children}
    </div>
  );
}
