"use client";

import { Field, Input } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";

import { OCR_FIELD_LABEL } from "../labels";
import { describePendingReviews, formatConfidence, type ReviewState } from "../ocr-review";
import type { OcrField, OcrFieldKey } from "../types";
import type { OcrReview } from "../use-ocr-review";

/**
 * Indicador de confianza de un campo. Siempre lleva texto: el color nunca es el único canal.
 *
 * @param props - El campo, su estado de revisión y su valor actual.
 * @returns El indicador, o nada si el campo salió vacío.
 */
function ConfidenceBadge({ field, state }: { field: OcrField; state: ReviewState }) {
  if (state === "corrected") {
    return (
      <span className="pt-conf fixed">
        <Icon name="pencil" />
        Corregido
      </span>
    );
  }
  if (field.confidence === null) return null;
  const percent = formatConfidence(field.confidence);
  if (state === "needs-review") {
    return (
      <span className="pt-conf low">
        <Icon name="exclamation-triangle" />
        Revisar · {percent}
      </span>
    );
  }
  if (state === "reviewed") {
    return (
      <span className="pt-conf">
        <Icon name="check2" />
        Revisado · {percent}
      </span>
    );
  }
  return <span className="pt-conf">{percent}</span>;
}

type OcrFieldsFormProps = {
  review: OcrReview;
  /** Errores que devolvió el servidor, por campo. */
  errors?: Partial<Record<OcrFieldKey, string>>;
  /** Prefijo de los ids de los campos, para que no se repitan si hay más de un formulario en la página. */
  idPrefix: string;
};

/**
 * Formulario de revisión de los datos leídos por el OCR.
 *
 * Cada campo muestra su confianza; los de baja confianza piden que la persona los vea antes de
 * confirmar, y un cambio queda marcado como «Corregido». El resumen se anuncia con `role="status"`.
 *
 * @param props - El estado de revisión (`useOcrReview`), los errores y un prefijo para los ids.
 * @returns La lista de campos y el resumen de pendientes.
 */
export function OcrFieldsForm({ review, errors = {}, idPrefix }: OcrFieldsFormProps) {
  const hasReading = review.fields.some((field) => field.confidence !== null);
  return (
    <div className="ocr-form">
      <p className="ocr-form__status" role="status">
        {hasReading ? describePendingReviews(review.pending) : "Aún no hay datos leídos. Puedes escribirlos a mano."}
      </p>
      <div className="ocr-form__grid">
        {review.fields.map((field) => {
          const value = review.values[field.key];
          const filled = value.trim().length > 0;
          return (
            <Field
              key={field.key}
              id={`${idPrefix}-${field.key}`}
              label={OCR_FIELD_LABEL[field.key]}
              error={errors[field.key]}
              aside={<ConfidenceBadge field={field} state={review.stateOf(field)} />}
            >
              {(a) => (
                <span className={filled ? "av-input-wrap--ocr" : undefined}>
                  <Input
                    {...a}
                    autoComplete="off"
                    value={value}
                    inputMode={field.key === "documentNumber" ? "numeric" : undefined}
                    placeholder={field.key === "birthDate" ? "dd/mm/aaaa" : undefined}
                    onChange={(event) => review.setValue(field.key, event.target.value)}
                    onBlur={() => review.markSeen(field.key)}
                  />
                  {filled && <Icon name="check-circle-fill" className="av-input-wrap__check" />}
                </span>
              )}
            </Field>
          );
        })}
      </div>
    </div>
  );
}
