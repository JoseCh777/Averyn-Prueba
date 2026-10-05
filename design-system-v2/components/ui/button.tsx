import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "light" | "ghost" | "ghost-inv" | "danger" | "text";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  /** Ocupa todo el ancho de su contenedor. */
  block?: boolean;
  /** Muestra el indicador y bloquea el reenvío; el texto del botón debe decir qué está pasando. */
  loading?: boolean;
};

export function Button({ variant = "primary", block, loading, className, children, disabled, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn("hz-btn", `hz-btn--${variant}`, block && "hz-btn--block", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="hz-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Obligatorio: un botón de solo icono necesita nombre accesible. */
  "aria-label": string;
  /** Cifra de la insignia (p. ej. notificaciones sin leer). Va dentro del nombre accesible. */
  badge?: ReactNode;
};

export function IconButton({ badge, className, children, type = "button", ...props }: IconButtonProps) {
  return (
    <button type={type} className={cn("hz-iconbtn", className)} {...props}>
      {children}
      {badge != null && <span className="badge" aria-hidden="true">{badge}</span>}
    </button>
  );
}
