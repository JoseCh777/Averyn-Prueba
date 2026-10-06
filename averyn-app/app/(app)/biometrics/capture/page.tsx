import type { Metadata } from "next";

import { CaptureView, type CaptureSearchParams } from "@/features/biometrics/components/capture-view";

export const metadata: Metadata = { title: "Captura biométrica · Averyn" };

/**
 * Página `/biometrics/capture?mode=…&person=…&method=…`: la captura compartida por el registro y la verificación.
 *
 * @param props - Los parámetros de búsqueda de la URL.
 * @returns La estación de captura o el aviso de que no hay captura en curso.
 */
export default async function CapturePage({ searchParams }: { searchParams: Promise<CaptureSearchParams> }) {
  return <CaptureView params={await searchParams} />;
}
