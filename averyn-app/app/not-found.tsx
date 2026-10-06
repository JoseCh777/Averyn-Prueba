import type { Metadata } from "next";

import { NotFoundPage } from "@/components/errors/not-found-page";

export const metadata: Metadata = { title: "Página no encontrada · Averyn" };

/**
 * Página 404 de toda la aplicación (la usa `notFound()` y cualquier ruta que no existe).
 *
 * @returns La página de error 404.
 */
export default function NotFound() {
  return <NotFoundPage />;
}
