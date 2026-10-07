import type { Metadata } from "next";

import { DocumentDetailView } from "@/features/documents/components/document-detail-view";
import { documentService } from "@/features/documents/services";

type DocumentPageProps = { params: Promise<{ id: string }> };

/**
 * El título de la pestaña lleva el archivo del documento; si no existe, el genérico.
 *
 * @param props - Los parámetros de la ruta.
 * @returns Los metadatos de la página.
 */
export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  const { id } = await params;
  const document = await documentService.getById(id);
  return { title: document === undefined ? "Documento no encontrado · Averyn" : `${document.fileName} · Averyn` };
}

/**
 * Página `/documents/[id]`: el detalle de un documento y su lectura OCR.
 *
 * @param props - Los parámetros de la ruta.
 * @returns La pantalla de detalle.
 */
export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;
  return <DocumentDetailView documentId={id} />;
}
