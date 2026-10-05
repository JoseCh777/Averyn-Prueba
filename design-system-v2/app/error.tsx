"use client";
import { ErrorPage } from "@/components/errors/error-page";

/** Frontera de error: una excepción no controlada muestra la página 500 y «Reintentar» vuelve a renderizar. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorPage variant="500" onRetry={reset} />;
}
