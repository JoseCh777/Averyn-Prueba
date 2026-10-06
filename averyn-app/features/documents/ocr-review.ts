import type { OcrField, OcrFieldKey, OcrValues } from "./types";

/**
 * Umbral de confianza: por debajo, la persona debe ver el campo antes de confirmar.
 * Es un valor de ejemplo; lo definirá el servicio de OCR.
 */
export const OCR_REVIEW_THRESHOLD = 90;

/**
 * Estado de revisión de un campo.
 *
 * - `confident`: lo leyó con confianza alta (o salió vacío): no hay nada que revisar.
 * - `needs-review`: confianza baja y la persona aún no lo vio.
 * - `reviewed`: confianza baja, pero la persona ya lo vio.
 * - `corrected`: la persona cambió lo que leyó el OCR.
 */
export type ReviewState = "confident" | "needs-review" | "reviewed" | "corrected";

/**
 * Decide en qué estado de revisión está un campo.
 *
 * @param field - El campo tal como lo leyó el OCR.
 * @param value - Lo que hay ahora en el formulario.
 * @param seen - Si la persona ya pasó por el campo.
 * @returns El estado de revisión.
 */
export function reviewStateOf(field: OcrField, value: string, seen: boolean): ReviewState {
  if (value !== field.value) return "corrected";
  if (field.confidence === null || field.confidence >= OCR_REVIEW_THRESHOLD) return "confident";
  return seen ? "reviewed" : "needs-review";
}

/**
 * Cuántos campos de baja confianza siguen sin revisar.
 *
 * @param fields - Campos leídos.
 * @param values - Valores actuales del formulario.
 * @param seen - Claves de los campos que la persona ya vio.
 * @returns El número de campos en `needs-review`.
 */
export function countPendingReviews(fields: readonly OcrField[], values: OcrValues, seen: ReadonlySet<OcrFieldKey>): number {
  return fields.filter((field) => reviewStateOf(field, values[field.key], seen.has(field.key)) === "needs-review").length;
}

/**
 * Confianza para mostrar, con coma decimal.
 *
 * @param confidence - De 0 a 100.
 * @returns Por ejemplo `97,8 %`.
 */
export function formatConfidence(confidence: number): string {
  return `${confidence.toFixed(1).replace(".", ",")} %`;
}

/**
 * Frase que resume cuánto falta por revisar (se anuncia con `role="status"`).
 *
 * @param pending - Campos pendientes de revisión.
 * @returns El texto para la persona.
 */
export function describePendingReviews(pending: number): string {
  if (pending === 0) return "Todo revisado. Puedes confirmar los datos.";
  if (pending === 1) return "1 campo con baja confianza. Revísalo antes de continuar.";
  return `${pending} campos con baja confianza. Revísalos antes de continuar.`;
}
