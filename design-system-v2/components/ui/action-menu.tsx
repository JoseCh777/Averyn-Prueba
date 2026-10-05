"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon, type IconName } from "./icon";

export type ActionItem = { label: string; icon?: IconName; danger?: boolean; onSelect: () => void } | "separator";

/**
 * Menú de acciones (⋯) con teclado completo.
 * Enter, Espacio o ↓ abren y enfocan el primer ítem; ↑ abre en el último; ↑↓ recorren con vuelta; Inicio/Fin saltan;
 * Esc cierra y devuelve el foco al botón; Tab cierra y sigue.
 */
export function ActionMenu({ label, items }: { label: string; items: ActionItem[] }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const start = useRef<"first" | "last">("first");

  const entries = () => Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
  const openAt = (where: "first" | "last") => { start.current = where; setOpen(true); };
  const close = (back?: boolean) => { setOpen(false); if (back) btn.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    const els = entries();
    (start.current === "last" ? els[els.length - 1] : els[0])?.focus();
    const out = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", out);
    return () => document.removeEventListener("click", out);
  }, [open]);

  const onMenuKey = (e: KeyboardEvent) => {
    const els = entries();
    const i = els.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") { e.preventDefault(); els[(i + 1) % els.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); els[(i - 1 + els.length) % els.length].focus(); }
    else if (e.key === "Home") { e.preventDefault(); els[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); els[els.length - 1].focus(); }
    else if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "Tab") close();
  };

  return (
    <div className="am" ref={root}>
      <button
        ref={btn}
        className="am__btn"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => (open ? close() : openAt("first"))}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); openAt("first"); }
          else if (e.key === "ArrowUp") { e.preventDefault(); openAt("last"); }
        }}
      >
        <Icon name="three-dots" />
      </button>
      <div className="av-menu" id={id} role="menu" aria-label={label} ref={menu} hidden={!open} onKeyDown={onMenuKey}>
        {items.map((it, i) =>
          it === "separator" ? (
            <div key={`s${i}`} role="separator" />
          ) : (
            <button key={it.label} type="button" role="menuitem" tabIndex={-1} className={it.danger ? "is-danger" : undefined} onClick={() => { close(true); it.onSelect(); }}>
              {it.icon && <Icon name={it.icon} />}{it.label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
