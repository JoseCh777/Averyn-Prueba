"use client";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export function BrandChip({ logoSrc, alt = "Averyn" }: { logoSrc: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <span className="hz-brandchip"><img src={logoSrc} alt={alt} /></span>;
}

export type DockItem = { label: string; href?: string; current?: boolean };

/** Dock de módulos. Sin `href`, el módulo aún no existe y se muestra atenuado («Próximamente»). */
export function Dock({ items, label = "Módulos" }: { items: DockItem[]; label?: string }) {
  return (
    <nav className="hz-dock" aria-label={label}>
      {items.map((it) =>
        it.href ? (
          <a key={it.label} href={it.href} aria-current={it.current ? "page" : undefined}>{it.label}</a>
        ) : (
          <span key={it.label} className="soon" title="Próximamente" aria-disabled="true">{it.label}</span>
        ),
      )}
    </nav>
  );
}

export function Avatar({ initials, name, role, ...props }: { initials: string; name: string; role?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className="hz-avatar" {...props}>
      <span className="hz-avatar__c" aria-hidden="true">{initials}</span>
      <span><b>{name}</b>{role && <small>{role}</small>}</span>
    </button>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="hz-crumb mono" aria-label="Ruta de navegación">
      {items.map((it, i) => (
        <span key={it.label}>
          {i > 0 && " / "}
          {it.href ? <a href={it.href}>{it.label}</a> : <b aria-current="page">{it.label}</b>}
        </span>
      ))}
    </nav>
  );
}

/** Pestañas con teclado completo: ← → Inicio Fin cambian de pestaña (activación automática). */
export function Tabs({ tabs, label, defaultIndex = 0 }: { tabs: { label: string; content: ReactNode }[]; label: string; defaultIndex?: number }) {
  const base = useId();
  const [active, setActive] = useState(defaultIndex);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(tabs.length - 1); }
  };
  return (
    <div>
      <div className="hz-tabs" role="tablist" aria-label={label} onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => { refs.current[i] = el; }}
            id={`${base}-t${i}`}
            role="tab"
            type="button"
            className="hz-tab"
            aria-selected={i === active}
            aria-controls={`${base}-p${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} id={`${base}-p${i}`} role="tabpanel" className="hz-tabpanel" aria-labelledby={`${base}-t${i}`} hidden={i !== active} tabIndex={0}>
          {t.content}
        </div>
      ))}
    </div>
  );
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  return (
    <div className="hz-pager" role="navigation" aria-label="Paginación">
      <button type="button" disabled={page <= 1} aria-label="Anterior" onClick={() => onPage(page - 1)}>←</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" aria-current={p === page ? "page" : undefined} onClick={() => onPage(p)}>{p}</button>
      ))}
      <button type="button" disabled={page >= pages} aria-label="Siguiente" onClick={() => onPage(page + 1)}>→</button>
    </div>
  );
}

/** Menú de usuario/acciones simple (botón + lista de elementos de menú). */
export function SimpleMenu({ label, items }: { label: ReactNode; items: { label: string; icon?: Parameters<typeof Icon>[0]["name"]; onSelect: () => void }[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button type="button" className="hz-btn hz-btn--ghost" aria-haspopup="menu" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>{label}</button>
      <div className={cn("hz-menu")} id={id} role="menu" hidden={!open}>
        {items.map((it) => (
          <button key={it.label} type="button" role="menuitem" onClick={() => { setOpen(false); it.onSelect(); }}>
            {it.icon && <Icon name={it.icon} />}{it.label}
          </button>
        ))}
      </div>
    </div>
  );
}
