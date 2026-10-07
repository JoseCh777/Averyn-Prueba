import type { Metadata } from "next";

import { ErrorPage } from "@/components/errors/error-page";

export const metadata: Metadata = { title: "Sin conexión · Averyn", robots: "noindex" };

/**
 * Página sin conexión: avisa y se recarga sola cuando vuelve la red.
 *
 * @returns La página de error.
 */
export default function OfflinePage() {
  return <ErrorPage variant="offline" homeHref="/" panelHref="/dashboard" />;
}
