import type { DocumentService } from "./document-service";
import { MockDocumentService } from "./mock-document-service";

/** Lo que tarda el OCR simulado: lo bastante para ver el estado «leyendo». */
const MOCK_OCR_LATENCY_MS = 700;

/**
 * Servicio de documentos que usa la aplicación: único lugar que elige la implementación.
 * TODO(AVY-008): cambiar `MockDocumentService` por el servicio que llama al Core.
 */
export const documentService: DocumentService = new MockDocumentService(MOCK_OCR_LATENCY_MS);

export type { DocumentInput, DocumentService } from "./document-service";
