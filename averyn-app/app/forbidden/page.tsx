import type { Metadata } from "next";

import { ErrorPage } from "@/components/errors/error-page";

export const metadata: Metadata = { title: "Sin permiso · Averyn" };

/**
 * Página 403: la cuenta no tiene permiso para esa sección. Se usa cuando el Core responde `403`.
 *
 * @returns La página de error.
 */
export default function ForbiddenPage() {
  return <ErrorPage variant="403" homeHref="/" panelHref="/dashboard" />;
}
