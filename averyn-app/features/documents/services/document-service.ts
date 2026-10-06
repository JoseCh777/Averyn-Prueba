import type { DocumentKind, DocumentRecord, OcrReadResult, OcrValues } from "../types";

/** Datos mínimos para leer o subir un documento. */
export interface DocumentInput {
  kind: DocumentKind;
  fileName: string;
}

/**
 * Frontera entre las pantallas y los documentos.
 *
 * Hoy la implementa `MockDocumentService`; cuando el Core exponga documentos y OCR se cambia
 * solo la implementación elegida en `services/index.ts` (coding-standard §79–81).
 */
export interface DocumentService {
  /** Todos los documentos, del más antiguo al más reciente. */
  list(): Promise<DocumentRecord[]>;
  /** El documento con ese id, o `undefined` si no existe. */
  getById(id: string): Promise<DocumentRecord | undefined>;
  /** Lee un documento con OCR sin guardarlo (lo usa el pre-registro). */
  read(input: DocumentInput): Promise<OcrReadResult>;
  /** Guarda el documento y lo procesa: queda `processed` o `failed`. */
  upload(input: DocumentInput): Promise<DocumentRecord>;
  /**
   * Guarda los valores revisados por la persona y marca el documento como confirmado.
   *
   * @returns El documento actualizado, o `undefined` si no existe o no está procesado.
   */
  confirm(id: string, values: OcrValues): Promise<DocumentRecord | undefined>;
}
