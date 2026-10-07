import type { Metadata } from "next";

import { ForbiddenPageClient } from "./forbidden-page";

export const metadata: Metadata = { title: "Sin permiso · Averyn", robots: "noindex" };

/**
 * Página 403: la cuenta no tiene permiso para esa sección. Se usa cuando el Core responde `403`.
 *
 * @returns La página de error.
 */
export default function ForbiddenPage() {
  return <ForbiddenPageClient />;
}
