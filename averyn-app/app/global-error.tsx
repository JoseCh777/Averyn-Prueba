"use client";

import "./globals.css";

import { ErrorPage } from "@/components/errors/error-page";

/**
 * Último recurso: se muestra si falla el propio layout raíz. Reemplaza al layout, por eso trae su
 * `<html>` y sus estilos.
 *
 * @param props - `reset` vuelve a intentar renderizar la aplicación.
 * @returns La página de error 500 completa.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es">
      <body>
        {/* Igual que las páginas de error originales: ninguna se indexa. React 19 lo sube al <head>. */}
        <meta name="robots" content="noindex" />
        <ErrorPage variant="500" onRetry={reset} homeHref="/" />
      </body>
    </html>
  );
}
