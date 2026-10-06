import { DOCUMENT_KINDS, OCR_FIELD_KEYS } from "./labels";
import type { DocumentKind, DocumentRecord, DocumentsSummary, OcrField, OcrValues, UploadMetadata } from "./types";

/** Tamaño máximo de un archivo: 10 MB. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Extensiones y tipos MIME que se aceptan. */
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|pdf)$/i;
const ALLOWED_MIME_TYPES: readonly string[] = ["image/jpeg", "image/png", "application/pdf"];

/**
 * Interpreta el tipo de documento recibido de un formulario.
 *
 * @param value - Valor sin validar.
 * @returns El tipo, o `undefined` si no es uno de los conocidos.
 */
export function parseDocumentKind(value: unknown): DocumentKind | undefined {
  return DOCUMENT_KINDS.find((kind) => kind === value);
}

/** Resultado de validar un archivo antes de procesarlo. */
export type UploadValidation = { ok: true; kind: DocumentKind } | { ok: false; error: string };

/**
 * Valida un archivo antes de subirlo: tipo de documento, formato y tamaño.
 *
 * Se usa en el navegador (para avisar al instante) y en el servidor (que no confía en el navegador).
 *
 * @param meta - Nombre, tamaño, tipo MIME y tipo de documento elegido.
 * @returns El tipo de documento, o el mensaje del primer problema encontrado.
 */
export function validateUpload(meta: UploadMetadata): UploadValidation {
  const kind = parseDocumentKind(meta.kind);
  if (kind === undefined) return { ok: false, error: "Elige el tipo de documento." };
  if (meta.fileName.trim() === "") return { ok: false, error: "Elige un archivo." };
  if (!ALLOWED_EXTENSIONS.test(meta.fileName) || (meta.mimeType !== "" && !ALLOWED_MIME_TYPES.includes(meta.mimeType))) {
    return { ok: false, error: "Formato no permitido: usa JPG, PNG o PDF." };
  }
  if (meta.sizeBytes <= 0) return { ok: false, error: "El archivo está vacío." };
  if (meta.sizeBytes > MAX_UPLOAD_BYTES) return { ok: false, error: `El archivo pesa ${formatFileSize(meta.sizeBytes)}: el máximo es 10 MB.` };
  return { ok: true, kind };
}

/**
 * Tamaño legible de un archivo.
 *
 * @param bytes - Tamaño en bytes.
 * @returns Por ejemplo `340 KB` o `2,5 MB`.
 */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1).replace(".", ",")} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Cuenta documentos por estado para los indicadores.
 *
 * @param documents - Todos los documentos.
 * @returns Total y conteo por estado.
 */
export function summarizeDocuments(documents: readonly DocumentRecord[]): DocumentsSummary {
  const count = (status: DocumentRecord["status"]) => documents.filter((document) => document.status === status).length;
  return { total: documents.length, processed: count("processed"), processing: count("processing"), failed: count("failed") };
}

/**
 * Valores iniciales de un formulario de revisión: lo que leyó el OCR, campo por campo.
 *
 * @param fields - Campos leídos.
 * @returns Un valor por cada clave; los campos que faltan quedan vacíos.
 */
export function valuesOf(fields: readonly OcrField[]): OcrValues {
  const values: OcrValues = { firstName: "", middleName: "", firstSurname: "", secondSurname: "", documentNumber: "", birthDate: "" };
  for (const field of fields) values[field.key] = field.value;
  return values;
}

/**
 * Nombre completo a partir de los campos del documento.
 *
 * @param values - Valores de los campos.
 * @returns Nombres y apellidos separados por un espacio, sin huecos.
 */
export function fullNameOf(values: OcrValues): string {
  return [values.firstName, values.middleName, values.firstSurname, values.secondSurname]
    .map((part) => part.trim())
    .filter((part) => part !== "")
    .join(" ");
}

/**
 * Campos con su orden de pantalla, rellenando con vacíos los que el OCR no devolvió.
 *
 * @param fields - Campos leídos.
 * @returns Siempre los seis campos, en el orden de `OCR_FIELD_KEYS`.
 */
export function orderedFields(fields: readonly OcrField[]): OcrField[] {
  return OCR_FIELD_KEYS.map((key) => fields.find((field) => field.key === key) ?? { key, value: "", confidence: null });
}
