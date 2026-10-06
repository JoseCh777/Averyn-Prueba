import type { Metadata } from "next";

import { ElectionsView } from "@/features/elections/components/elections-view";

export const metadata: Metadata = { title: "Procesos electorales · Averyn" };

/**
 * Página `/elections`: las convocatorias creadas y su estado.
 *
 * @returns La pantalla de Procesos electorales.
 */
export default function ElectionsPage() {
  return <ElectionsView />;
}
