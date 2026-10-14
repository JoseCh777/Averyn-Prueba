import type { Metadata } from "next";

import { AccessView } from "@/features/access/components/access-view";

export const metadata: Metadata = { title: "Accesos · Averyn" };

/**
 * Página `/access`: consola del operador de puerta.
 *
 * @returns La pantalla de Accesos.
 */
export default function AccessPage() {
  return <AccessView />;
}
