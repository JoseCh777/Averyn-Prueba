"use client";

import { createContext, use, type ReactNode } from "react";

import { useHeroScroll } from "../use-hero-scroll";

type HeroScroll = ReturnType<typeof useHeroScroll>;

const HeroScrollContext = createContext<HeroScroll | null>(null);

/**
 * Contenedor raíz de la landing (`.mn`). Conduce el hero guiado por scroll y comparte su
 * estado con el encabezado y el hero, que están en zonas distintas de la página (el
 * encabezado fuera de `<main>`). Las variables `--t1/--t2/--t3` se escriben aquí y las
 * heredan los dos.
 *
 * El resto de la página llega como `children` y sigue siendo de servidor.
 *
 * @returns El contenedor con el contexto del hero.
 */
export function HeroScrollScope({ children }: { children: ReactNode }) {
  const heroScroll = useHeroScroll();
  return (
    <HeroScrollContext value={heroScroll}>
      <div ref={heroScroll.scopeRef} className="mn">
        {children}
      </div>
    </HeroScrollContext>
  );
}

/**
 * Lee el estado del hero desde un componente dentro de `HeroScrollScope`.
 *
 * @returns Referencias y visibilidad del hero.
 * @throws Error cuando se usa fuera de `HeroScrollScope`.
 */
export function useHeroScrollScope(): HeroScroll {
  const heroScroll = use(HeroScrollContext);
  if (heroScroll === null) throw new Error("useHeroScrollScope debe usarse dentro de HeroScrollScope");
  return heroScroll;
}
