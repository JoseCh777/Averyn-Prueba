import type { Metadata } from "next";

import { BiometricsView } from "@/features/biometrics/components/biometrics-view";

export const metadata: Metadata = { title: "Biometría · Averyn" };

/**
 * Página `/biometrics`: el módulo de Biometría.
 *
 * @returns La pantalla del módulo.
 */
export default function BiometricsPage() {
  return <BiometricsView />;
}
