"use client";

import { useSyncExternalStore } from "react";

import { ErrorPage } from "@/components/errors/error-page";

/** La ruta pedida no cambia mientras se ve la página: no hay nada a lo que suscribirse. */
function subscribe(): () => void {
  return () => undefined;
}

/** Ruta que pidió el navegador, ya legible (`%20` → espacio). */
function requestedPath(): string {
  try {
    return decodeURIComponent(window.location.pathname);
  } catch {
    return window.location.pathname;
  }
}

/**
 * 403 con la ruta que se pidió: el original la muestra en la página («Ruta /…»).
 *
 * La ruta se lee del navegador y no de `usePathname`: en el servidor ese valor es interno y no
 * coincidiría con el del navegador al hidratar, así que en el servidor no se muestra ruta.
 *
 * @returns La página de error 403.
 */
export function ForbiddenPageClient() {
  const path = useSyncExternalStore(subscribe, requestedPath, () => undefined);
  return <ErrorPage variant="403" path={path} homeHref="/" panelHref="/dashboard" />;
}
