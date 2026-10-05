"use client";
import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

type FieldProps = {
  label: ReactNode;
  help?: ReactNode;
  /** Mensaje de error: marca el campo como inválido y lo asocia con aria-describedby. */
  error?: ReactNode;
  id?: string;
  className?: string;
  /** Contenido a la derecha de la etiqueta (p. ej. «¿Olvidaste tu contraseña?»). */
  aside?: ReactNode;
  children: (a: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => ReactNode;
};

/** Etiqueta + control + ayuda + error. El control llega por render prop para recibir id y aria-*. */
export function Field({ label, help, error, id, className, aside, children }: FieldProps) {
  const auto = useId();
  const fid = id ?? auto;
  const msg = error ? `${fid}-err` : help ? `${fid}-help` : undefined;
  return (
    <div className={cn("hz-field", className)}>
      {aside ? (
        <div className="hz-label__row"><label className="hz-label" htmlFor={fid}>{label}</label>{aside}</div>
      ) : (
        <label className="hz-label" htmlFor={fid}>{label}</label>
      )}
      {children({ id: fid, "aria-invalid": error ? true : undefined, "aria-describedby": msg })}
      {error ? (
        <span className="hz-err" id={`${fid}-err`}><Icon name="exclamation-circle" />{error}</span>
      ) : help ? (
        <span className="hz-help" id={`${fid}-help`}>{help}</span>
      ) : null}
    </div>
  );
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & { ok?: boolean };
export function Input({ ok, className, ...props }: InputProps) {
  return <input className={cn("hz-input", ok && "hz-input--ok", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("hz-textarea", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("hz-select", className)} {...props}>{children}</select>;
}

export function Checkbox({ label, className, ...props }: { label: ReactNode } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <label className={cn("hz-check", className)}>
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}

export function Switch({ checked, onCheckedChange, label, ...props }: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className="hz-switch" onClick={() => onCheckedChange(!checked)} {...props} />
  );
}

/** Contraseña con botón «Mostrar». El indicador de fuerza va aparte (`PasswordStrength`). */
export function PasswordInput({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [shown, setShown] = useState(false);
  return (
    <div className="hz-pass">
      <input className={cn("hz-input", className)} type={shown ? "text" : "password"} {...props} />
      <button type="button" className="hz-pass__toggle" aria-label={shown ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={shown} onClick={() => setShown((s) => !s)}>
        {shown ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}
