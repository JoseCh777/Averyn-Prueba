import type { Metadata } from "next";

import { DocumentsView } from "@/features/documents/components/documents-view";

export const metadata: Metadata = { title: "Documentos · Averyn" };

/**
 * Página `/documents`: carga de documentos con OCR y su historial.
 *
 * @returns La pantalla de Documentos.
 */
export default function DocumentsPage() {
  return <DocumentsView />;
}
