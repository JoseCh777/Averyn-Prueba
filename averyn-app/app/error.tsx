"use client";

import { ErrorPage } from "@/components/errors/error-page";

/**
 * Límite de error de toda la aplicación: algo falló de nuestro lado (500) y se puede reintentar.
 * Los errores de cada módulo los atrapa antes el `error.tsx` de su ruta.
 *
 * @param props - `reset` vuelve a intentar renderizar la pantalla.
 * @returns La página de error 500.
 */
export default function RootError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorPage variant="500" onRetry={reset} homeHref="/" />;
}
