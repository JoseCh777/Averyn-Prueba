import type { Metadata } from "next";

import { AiView } from "@/features/ai/components/ai-view";

export const metadata: Metadata = { title: "IA · Averyn" };

/**
 * Página `/ai`: el módulo de IA (marcador).
 *
 * @returns La pantalla del módulo.
 */
export default function AiPage() {
  return <AiView />;
}
