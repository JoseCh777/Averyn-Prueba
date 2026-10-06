"use client";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Field, Input } from "./field";
import { Button } from "./button";

export type FieldSpec = {
  name: string;
  label: string;
  /** Devuelve el mensaje de error o "" si es válido. El mensaje dice qué hacer, no solo qué está mal. */
  check: (value: string) => string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

/**
 * Formulario con validación en tres momentos: al salir del campo (solo si ya se tocó), mientras se escribe (una vez inválido)
 * y al enviar (valida todo, muestra el resumen y mueve el foco a él). Nunca vacía el formulario por un error.
 */
export function ValidatedForm({ label, fields, submitLabel = "Guardar", onValid, extra }: {
  label: string;
  fields: FieldSpec[];
  submitLabel?: string;
  onValid: (values: Record<string, string>) => void;
  extra?: ReactNode;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.name, ""])));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [summary, setSummary] = useState<[string, string][] | null>(null);
  const sumRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { if (summary) sumRef.current?.focus(); }, [summary]);

  const validate = (f: FieldSpec, v: string) => {
    const e = f.check(v);
    setErrors((o) => ({ ...o, [f.name]: e }));
    return e;
  };
  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const errs: [string, string][] = [];
    fields.forEach((f) => { const e = validate(f, values[f.name]!); if (e) errs.push([f.name, e]); });
    if (errs.length) setSummary(errs);
    else { setSummary(null); onValid(values); }
  };
  const reset = () => { setValues(Object.fromEntries(fields.map((f) => [f.name, ""]))); setErrors({}); setTouched({}); setSummary(null); };

  return (
    <form className="fv" noValidate aria-label={label} onSubmit={submit} ref={formRef}>
      {summary && (
        <div className="av-alert av-alert--error fv__sum" role="alert" tabIndex={-1} ref={sumRef}>
          <strong>Corrige {summary.length} {summary.length === 1 ? "campo" : "campos"} para continuar</strong>
          <ul>
            {summary.map(([name, msg]) => (
              <li key={name}>
                <a href={`#${name}`} onClick={(e) => { e.preventDefault(); formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus(); }}>
                  {fields.find((f) => f.name === name)?.label}: {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {fields.map((f) => (
        <Field key={f.name} label={f.label} error={errors[f.name] || undefined}>
          {(a) => (
            <Input
              {...a}
              name={f.name}
              value={values[f.name]}
              {...f.inputProps}
              onChange={(e) => { setValues((v) => ({ ...v, [f.name]: e.target.value })); if (errors[f.name]) validate(f, e.target.value); }}
              onBlur={() => { if (values[f.name] || touched[f.name]) validate(f, values[f.name]!); setTouched((t) => ({ ...t, [f.name]: true })); }}
            />
          )}
        </Field>
      ))}
      {extra}
      <div className="pt-actions" style={{ display: "flex", gap: ".6rem", marginTop: ".4rem" }}>
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="ghost" onClick={reset}>Limpiar</Button>
      </div>
    </form>
  );
}
