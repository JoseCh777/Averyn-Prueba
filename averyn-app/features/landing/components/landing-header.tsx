"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { LOGIN_PATH } from "@/features/authentication/routes";

import { LANDING_NAV } from "../content";
import { useHeroScrollScope } from "./hero-scroll-scope";

const MENU_ID = "mn-nav";

/**
 * Encabezado fijo de la landing: logo, píldora de navegación y botón «Ingresar».
 *
 * El logo aparece cuando el del hero ya subió; antes no recibe foco (`inert`).
 * Por debajo de 1100 px la píldora se vuelve un menú desplegable (botón MENÚ/CERRAR).
 * El menú se cierra al elegir un enlace o con Escape, y el foco vuelve al botón.
 *
 * @returns El encabezado.
 */
export function LandingHeader() {
  const { brandVisible } = useHeroScrollScope();
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      burgerRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="mn-header">
      <div className="mn-wrap mn-header__grid">
        <a className="mn-brand" href="#inicio" aria-label="Averyn, inicio" inert={!brandVisible}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/averyn-logo-font-black.avif" alt="Averyn" />
        </a>

        <button
          ref={burgerRef}
          className="mn-burger"
          type="button"
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "CERRAR" : "MENÚ"}
        </button>

        <nav
          id={MENU_ID}
          className={menuOpen ? "mn-pill mn-mono is-open" : "mn-pill mn-mono"}
          aria-label="Navegación principal"
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) setMenuOpen(false);
          }}
        >
          {LANDING_NAV.map((link) => (
            <a key={link.id} href={`#${link.id}`}>
              {link.label}
            </a>
          ))}
          <span className="mn-pill__mobile">
            <Link className="mn-btn mn-btn--blue" href={LOGIN_PATH}>
              Ingresar
            </Link>
          </span>
        </nav>

        <div className="mn-actions mn-mono">
          <Link className="mn-btn mn-btn--blue" href={LOGIN_PATH}>
            Ingresar
          </Link>
        </div>
      </div>
    </header>
  );
}
