import { OCR_FIELD_KEYS } from "./labels";
import type { OcrField, OcrFieldKey, OcrReadResult } from "./types";

/**
 * [MOCK] Lectura OCR simulada.
 * TODO(AVY-008): reemplazar por el servicio de OCR del Core (la lectura real la hace un servicio de IA).
 */

/** Un campo leído: el valor y la confianza (0 a 100). */
type Reading = readonly [value: string, confidence: number];

/**
 * Identidades ficticias que el mock «lee», una distinta en cada lectura. Algunas confianzas quedan
 * bajo el umbral de revisión para que haya algo que revisar. Un valor vacío no lleva confianza.
 */
const SAMPLES: readonly Record<OcrFieldKey, Reading>[] = [
  { firstName: ["Ana", 99.4], middleName: ["", 0], firstSurname: ["Torres", 98.9], secondSurname: ["", 0], documentNumber: ["10234567", 99.1], birthDate: ["15/03/1999", 96.2] },
  { firstName: ["Luis", 98.2], middleName: ["Alberto", 97.5], firstSurname: ["Pérez", 96.8], secondSurname: ["Gómez", 99.0], documentNumber: ["10345678", 98.4], birthDate: ["02/07/2000", 88.7] },
  { firstName: ["María", 97.8], middleName: ["Elena", 97.2], firstSurname: ["Gómez", 98.1], secondSurname: ["", 0], documentNumber: ["10456789", 99.1], birthDate: ["14/03/1998", 86.3] },
  { firstName: ["Carlos", 99.0], middleName: ["", 0], firstSurname: ["Ruiz", 97.9], secondSurname: ["Mora", 89.5], documentNumber: ["10567890", 98.8], birthDate: ["23/11/2001", 95.0] },
  { firstName: ["Laura", 98.6], middleName: ["Sofía", 98.1], firstSurname: ["Díaz", 96.9], secondSurname: ["", 0], documentNumber: ["10678901", 97.3], birthDate: ["09/05/1997", 94.1] },
];

/** Un nombre de archivo con estas palabras simula una imagen ilegible. */
const UNREADABLE_FILE_NAME = /error|borroso|blur|reflejo/i;

/**
 * Lee un documento de forma simulada.
 *
 * Cada lectura entrega la siguiente identidad ficticia. Un archivo cuyo nombre diga «error»,
 * «borroso», «blur» o «reflejo» simula una imagen que no se pudo leer.
 *
 * @param fileName - Nombre del archivo recibido.
 * @param sequence - Número de lectura (decide qué identidad ficticia se entrega).
 * @returns Los campos leídos, o `unreadable`.
 */
export function mockReadDocument(fileName: string, sequence: number): OcrReadResult {
  if (UNREADABLE_FILE_NAME.test(fileName)) return { ok: false, reason: "unreadable" };

  const sample = SAMPLES[sequence % SAMPLES.length];
  if (sample === undefined) return { ok: false, reason: "unreadable" };

  const fields: OcrField[] = OCR_FIELD_KEYS.map((key) => {
    const [value, confidence] = sample[key];
    return { key, value, confidence: value === "" ? null : confidence };
  });
  return { ok: true, fields };
}
