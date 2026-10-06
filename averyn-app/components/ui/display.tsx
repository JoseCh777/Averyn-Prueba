import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

export type TileTone = "signal" | "night" | "tint" | "soon";

/** Mosaico de acceso a un módulo. Con `href` es un enlace; sin él (o con tone="soon") es informativo. */
export function Tile({ tone = "tint", icon, title, description, href, tag }: {
  tone?: TileTone;
  icon: IconName;
  title: string;
  description?: string;
  href?: string;
  tag?: string;
}) {
  const inner = (
    <>
      <span className="av-tile__icon"><Icon name={icon} /></span>
      <span>
        <span className="av-tile__title">{title}</span>
        {description && <span className="av-tile__desc">{description}</span>}
      </span>
      {tag ? <span className="av-tile__tag">{tag}</span> : href && tone !== "soon" ? <span className="av-tile__arrow" aria-hidden="true">↗</span> : null}
    </>
  );
  const cls = cn("av-tile", `av-tile--${tone}`);
  return href && tone !== "soon" ? <a href={href} className={cls}>{inner}</a> : <div className={cls}>{inner}</div>;
}

export function KpiRow({ children }: { children: ReactNode }) {
  return <div className="av-kpis">{children}</div>;
}

export function Kpi({ label, value, delta, tone, note }: { label: string; value: ReactNode; delta?: string; tone?: "ok" | "warn"; note?: string }) {
  return (
    <div className="av-kpi">
      <span className="av-kpi__label mono">{label}</span>
      <span className="av-kpi__value">{value}</span>
      {delta && <span className={cn("av-kpi__delta", tone && `av-kpi__delta--${tone}`)}>{delta}</span>}
      {note && <span className="av-kpi__note">{note}</span>}
    </div>
  );
}

export type ActivityTone = "ok" | "bad" | "retry" | "other";
export type ActivityEvent = { title: string; detail: string; time: string; tone?: ActivityTone };

/**
 * Panel navy de actividad: barras de resultado + línea de eventos.
 *
 * `titleId` enlaza el encabezado con la sección (`aria-labelledby`) para que el panel
 * tenga nombre accesible; sin barras que mostrar no se pinta el bloque de resultados.
 */
export function ActivityPanel({ titleId, title, subtitle, barsTitle, bars, events, more }: {
  titleId: string;
  title: string;
  subtitle?: string;
  barsTitle?: string;
  bars: { label: string; value: number; max: number; tone?: ActivityTone }[];
  events: ActivityEvent[];
  more?: { href: string; label: string };
}) {
  return (
    <section className="av-panel on-night" aria-labelledby={titleId}>
      <header className="av-panel__head">
        <h2 id={titleId}>{title}</h2>
        {subtitle && <p className="av-panel__sub">{subtitle}</p>}
      </header>
      {bars.length > 0 && (
        <div className="av-bars">
          {barsTitle && <p className="av-bars__title mono">{barsTitle}</p>}
          {bars.map((b) => (
            <div key={b.label} className={cn("av-bar", b.tone && b.tone !== "ok" && `av-bar--${b.tone}`)}>
              <span>{b.label}</span>
              <span className="av-bar__track"><i style={{ ["--w" as string]: `${(b.value / b.max) * 100}%` }} /></span>
              <b>{b.value}</b>
            </div>
          ))}
        </div>
      )}
      <ul className="av-feed">
        {events.map((e, i) => (
          <li key={i} className={e.tone && e.tone !== "ok" ? e.tone : undefined}>
            <b>{e.title}</b><span>{e.detail}</span>{e.time && <small>{e.time}</small>}
          </li>
        ))}
      </ul>
      {more && <a className="av-more mono" href={more.href}>{more.label} →</a>}
    </section>
  );
}

export function Table({ className, ...props }: ComponentPropsWithoutRef<"table">) {
  return <table className={cn("av-table", className)} {...props} />;
}

export function Person({ initials, name, detail, href }: { initials: string; name: string; detail?: string; href?: string }) {
  const inner = (
    <>
      <span className="av-person__ini" aria-hidden="true">{initials}</span>
      <strong>{name}</strong>
      {detail && <small>{detail}</small>}
    </>
  );
  return href ? <a href={href} className="av-person">{inner}</a> : <div className="av-person">{inner}</div>;
}

export function Media({ ratio = "16 / 9", hint, children }: { ratio?: string; hint?: string; children?: ReactNode }) {
  return (
    <div className="av-media" style={{ ["--ratio" as string]: ratio }}>
      {children ?? <span className="av-media__hint mono">{hint}</span>}
    </div>
  );
}
