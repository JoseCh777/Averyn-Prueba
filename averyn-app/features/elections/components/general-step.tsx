"use client";

import { Field, Input, Select, Textarea } from "@/components/ui/field";

import { INSTITUTION_KINDS, INSTITUTION_LABEL, PROCESS_KINDS, PROCESS_KIND_LABEL } from "../labels";
import type { GeneralInfoField, GeneralInfoInput } from "../types";

type GeneralStepProps = {
  values: GeneralInfoInput;
  errors: Partial<Record<GeneralInfoField, string>>;
  onChange: (field: GeneralInfoField, value: string) => void;
  /** Hoy en `aaaa-mm-dd` (hora de Lima): es la fecha mínima de inicio. */
  today: string;
};

/**
 * Paso 1 del asistente: información general del proceso.
 *
 * Cada campo muestra su error debajo (se anuncia a los lectores de pantalla) y lo pierde al corregirlo.
 *
 * @param props - Los valores, los errores y quién avisa de los cambios.
 * @returns Los campos del paso.
 */
export function GeneralStep({ values, errors, onChange, today }: GeneralStepProps) {
  return (
    <div className="av-form-grid">
      <p className="av-note av-form-grid__span">Todos los campos son obligatorios. Podrás revisar todo antes de crear el proceso.</p>
      <Field id="election-name" label="Nombre del proceso" error={errors.name} className="av-form-grid__span">
        {(a) => <Input {...a} autoComplete="off" value={values.name} onChange={(event) => onChange("name", event.target.value)} />}
      </Field>
      <Field id="election-institution" label="Institución" error={errors.institution}>
        {(a) => (
          <Select {...a} value={values.institution} onChange={(event) => onChange("institution", event.target.value)}>
            <option value="">Selecciona una institución</option>
            {INSTITUTION_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {INSTITUTION_LABEL[kind]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field id="election-kind" label="Tipo de proceso" error={errors.kind}>
        {(a) => (
          <Select {...a} value={values.kind} onChange={(event) => onChange("kind", event.target.value)}>
            <option value="">Selecciona un tipo de proceso</option>
            {PROCESS_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {PROCESS_KIND_LABEL[kind]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field id="election-start" label="Fecha de inicio" error={errors.startDate}>
        {(a) => <Input {...a} type="date" min={today} value={values.startDate} onChange={(event) => onChange("startDate", event.target.value)} />}
      </Field>
      <Field id="election-end" label="Fecha de finalización" error={errors.endDate}>
        {(a) => <Input {...a} type="date" min={values.startDate || today} value={values.endDate} onChange={(event) => onChange("endDate", event.target.value)} />}
      </Field>
      <Field id="election-description" label="Descripción" error={errors.description} className="av-form-grid__span">
        {(a) => <Textarea {...a} rows={3} value={values.description} onChange={(event) => onChange("description", event.target.value)} />}
      </Field>
    </div>
  );
}
