import type { Metadata } from "next";

import { ErrorPage } from "@/components/errors/error-page";

export const metadata: Metadata = { title: "Mantenimiento · Averyn", robots: "noindex" };

/**
 * Página de mantenimiento: se muestra mientras la plataforma está en mejoras.
 *
 * @returns La página de error.
 */
export default function MaintenancePage() {
  return <ErrorPage variant="mantenimiento" homeHref="/" panelHref="/dashboard" />;
}
