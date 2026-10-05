import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

export type Tone = "success" | "warning" | "error" | "info";

/** Alerta en línea. `error` se anuncia de inmediato (role="alert"); el resto, con calma (role="status"). */
export function Alert({ tone = "info", title, children, className, ...props }: { tone?: Tone; title?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("av-alert", `av-alert--${tone}`, className)} role={tone === "error" ? "alert" : "status"} {...props}>
      {title && <strong>{title}</strong>}
      {children}
    </div>
  );
}

export type ChipTone = Tone | "brand" | "neutral";

const DEFAULT_ICON: Record<ChipTone, IconName> = {
  success: "check-circle",
  error: "x-circle",
  warning: "exclamation-circle",
  info: "info-circle",
  neutral: "clock",
  brand: "stars",
};

/** Píldora de estado: siempre icono + palabra (el color nunca es el único canal). */
export function Chip({ tone = "neutral", icon, variant, wrap, children, className }: {
  tone?: ChipTone;
  icon?: IconName;
  variant?: "outline" | "solid";
  wrap?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("av-chip", `av-chip--${tone}`, variant && `av-chip--${variant}`, wrap && "av-chip--wrap", className)}>
      <Icon name={icon ?? DEFAULT_ICON[tone]} />
      {children}
    </span>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("av-tag", className)}>{children}</span>;
}

export function Skeleton({ width, className }: { width?: string | number; className?: string }) {
  return <span className={cn("av-skel", className)} style={{ width }} aria-hidden="true" />;
}

/** Varias líneas de esqueleto con un único anuncio «Cargando». */
export function SkeletonLines({ lines = 4, label = "Cargando" }: { lines?: number; label?: string }) {
  return (
    <div role="status" aria-label={label} className="grid gap-3">
      {Array.from({ length: lines }, (_, i) => <Skeleton key={i} width={`${100 - i * 9}%`} />)}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <span className={cn("av-spin", className)} aria-hidden="true" />;
}

/** Progreso determinado. `value` entre 0 y 1. */
export function Progress({ value, label }: { value: number; label: string }) {
  const v = Math.min(1, Math.max(0, value));
  return (
    <div className="av-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
      <i style={{ ["--p" as string]: v }} />
    </div>
  );
}

export function EmptyState({ icon = "inbox", title, children, action }: { icon?: IconName; title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="av-empty">
      <span className="av-empty__icon"><Icon name={icon} /></span>
      <h4>{title}</h4>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
