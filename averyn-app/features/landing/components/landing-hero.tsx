"use client";

import Link from "next/link";

import { LOGIN_PATH } from "@/features/authentication/routes";

import { HERO_COPY } from "../content";
import { ArcsFigure } from "./arcs-figure";
import { useHeroScrollScope } from "./hero-scroll-scope";

/**
 * Hero guiado por scroll: la «A» negra, luego la palabra completa y por último la figura,
 * el título y los botones. Las fases las escribe `useHeroScroll` como variables CSS.
 * El texto no recibe foco hasta que aparece (`inert`).
 *
 * @returns La sección `#inicio`.
 */
export function LandingHero() {
  const { stageRef, lockupRef, copyVisible } = useHeroScrollScope();
  return (
    <section ref={stageRef} id="inicio" className="mn-stage" aria-label="Averyn">
      <div className="mn-sticky">
        <div ref={lockupRef} className="mn-lockup">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mn-lockup__word" src="/assets/images/averyn-logo-font-black.avif" alt="Averyn" />
        </div>

        <div className="mn-copy" inert={!copyVisible}>
          <ArcsFigure variant="hero" className="mn-fig" />
          <h1>{HERO_COPY.title}</h1>
          <p>{HERO_COPY.lead}</p>
          <div className="mn-copy__cta">
            <Link className="mn-btn mn-btn--blue" href={LOGIN_PATH}>
              Ingresar al sistema →
            </Link>
            <a className="mn-btn mn-btn--ghost" href="#que-es">
              Conocer Averyn ↓
            </a>
          </div>
        </div>

        <div className="mn-cue mn-mono" aria-hidden="true">
          Desplaza
          <i />
        </div>
      </div>
    </section>
  );
}
