"use client";

import { useSyncExternalStore } from "react";

import { ErrorPage } from "./error-page";

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
 * Página 404: «No encontramos esa página», con la ruta que se pidió y los caminos de vuelta.
 *
 * La ruta se lee del navegador y no de `usePathname`: en el servidor ese valor es interno
 * (`/_not-found`) y no coincidiría con el del navegador al hidratar. En el servidor no se muestra ruta.
 * Ofrece siempre «Ir al panel»: sin sesión, el panel lleva al login.
 *
 * @returns La página de error 404.
 */
export function NotFoundPage() {
  const path = useSyncExternalStore(subscribe, requestedPath, () => undefined);
  return <ErrorPage variant="404" path={path} homeHref="/" panelHref="/dashboard" />;
}
