"use client";

import { useState } from "react";

import { orderedFields, valuesOf } from "./document-rules";
import { countPendingReviews, reviewStateOf, type ReviewState } from "./ocr-review";
import type { OcrField, OcrFieldKey, OcrValues } from "./types";

/**
 * Estado de la revisión de los campos leídos por el OCR.
 *
 * Guarda lo que la persona escribe y qué campos ya vio. Las reglas (qué es «baja confianza»,
 * cuándo un campo está corregido) viven en `ocr-review.ts`; aquí solo se guarda el estado.
 *
 * @param initialFields - Campos leídos al empezar (vacío si aún no hay lectura).
 * @param initiallyReviewed - Si la persona ya había revisado estos datos (documento confirmado).
 * @returns Los campos, los valores, el conteo de pendientes y las funciones para cambiarlos.
 */
export function useOcrReview(initialFields: readonly OcrField[] = [], initiallyReviewed = false) {
  const [fields, setFields] = useState<OcrField[]>(() => orderedFields(initialFields));
  const [values, setValues] = useState<OcrValues>(() => valuesOf(initialFields));
  const [seen, setSeen] = useState<ReadonlySet<OcrFieldKey>>(() => new Set(initiallyReviewed ? fields.map((field) => field.key) : []));

  return {
    fields,
    values,
    /** Campos de baja confianza que la persona aún no ha visto. */
    pending: countPendingReviews(fields, values, seen),
    /** Cambia el valor de un campo; escribir en él cuenta como haberlo visto. */
    setValue(key: OcrFieldKey, value: string): void {
      setValues((current) => ({ ...current, [key]: value }));
      setSeen((current) => new Set(current).add(key));
    },
    /** Marca el campo como visto (al salir de él con el teclado o el puntero). */
    markSeen(key: OcrFieldKey): void {
      setSeen((current) => (current.has(key) ? current : new Set(current).add(key)));
    },
    /** Estado de revisión de un campo. */
    stateOf(field: OcrField): ReviewState {
      return reviewStateOf(field, values[field.key], seen.has(field.key));
    },
    /** Carga una lectura nueva (o vacía) y reinicia la revisión. */
    load(next: readonly OcrField[], reviewed = false): void {
      const ordered = orderedFields(next);
      setFields(ordered);
      setValues(valuesOf(next));
      setSeen(new Set(reviewed ? ordered.map((field) => field.key) : []));
    },
  };
}

/** Lo que devuelve `useOcrReview`, para pasarlo a los componentes de presentación. */
export type OcrReview = ReturnType<typeof useOcrReview>;
