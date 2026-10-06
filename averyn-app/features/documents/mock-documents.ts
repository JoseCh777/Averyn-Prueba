import { OCR_FIELD_KEYS } from "./labels";
import type { DocumentRecord, OcrField } from "./types";

/** Campos leídos de un documento de demostración. */
function fieldsOf(values: readonly [string, number | null][]): OcrField[] {
  return OCR_FIELD_KEYS.map((key, index) => {
    const [value, confidence] = values[index] ?? ["", null];
    return { key, value, confidence };
  });
}

/**
 * [MOCK] Documentos de demostración (los cuatro del prototipo).
 * TODO(AVY-008): reemplazar por los documentos del Core.
 *
 * @returns Una copia nueva de la semilla.
 */
export function seedDocuments(): DocumentRecord[] {
  return [
    {
      id: "doc-0001",
      kind: "cc",
      fileName: "cedula-ana-torres.jpg",
      uploadedAt: "2026-09-10T15:00:00.000Z",
      status: "processed",
      confirmed: true,
      fields: fieldsOf([["Ana", 99.4], ["", null], ["Torres", 98.9], ["", null], ["10234567", 99.1], ["15/03/1999", 96.2]]),
    },
    {
      id: "doc-0002",
      kind: "passport",
      fileName: "pasaporte-escaneado.pdf",
      uploadedAt: "2026-09-11T16:30:00.000Z",
      status: "processing",
      confirmed: false,
      fields: [],
    },
    {
      id: "doc-0003",
      kind: "institutional",
      fileName: "carnet-reflejo.jpg",
      uploadedAt: "2026-09-12T14:10:00.000Z",
      status: "failed",
      confirmed: false,
      fields: [],
    },
    {
      id: "doc-0004",
      kind: "cc",
      fileName: "cedula-luis-perez.jpg",
      uploadedAt: "2026-09-12T18:45:00.000Z",
      status: "processed",
      confirmed: false,
      fields: fieldsOf([["Luis", 98.2], ["Alberto", 97.5], ["Pérez", 96.8], ["Gómez", 99.0], ["10345678", 98.4], ["02/07/2000", 86.3]]),
    },
  ];
}
