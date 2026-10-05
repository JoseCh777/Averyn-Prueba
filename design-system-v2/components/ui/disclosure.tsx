"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon, type IconName } from "./icon";
import { cn } from "@/lib/utils";

/** Acordeón: botón dentro de un encabezado con aria-expanded/aria-controls. ↑↓ pasan entre títulos; Inicio/Fin saltan. */
export function Accordion({ items, multiple = false, defaultOpen = [0] }: { items: { title: string; content: ReactNode }[]; multiple?: boolean; defaultOpen?: number[] }) {
  const base = useId();
  const [open, setOpen] = useState<number[]>(defaultOpen);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (i: number) => {
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i]));
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === "ArrowDown" ? i + 1 : e.key === "ArrowUp" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : null;
    if (n === null) return;
    e.preventDefault();
    btns.current[(n + items.length) % items.length]?.focus();
  };
  // Al pasar de «varios» a «uno», se conserva solo el primero abierto.
  useEffect(() => { if (!multiple) setOpen((o) => (o.length > 1 ? [o[0]] : o)); }, [multiple]);

  return (
    <div className="ac">
      {items.map((it, i) => {
        const isOpen = open.includes(i);
        return (
          <div className="ac__item" key={it.title}>
            <h3 style={{ margin: 0 }}>
              <button ref={(el) => { btns.current[i] = el; }} className="ac__btn" type="button" id={`${base}-b${i}`} aria-expanded={isOpen} aria-controls={`${base}-p${i}`} onClick={() => toggle(i)} onKeyDown={(e) => onKey(e, i)}>
                {it.title}<Icon name="chevron-down" />
              </button>
            </h3>
            <div className="ac__panel" id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} hidden={!isOpen}>
              <div style={{ margin: 0 }}>{it.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Popover: Esc o clic fuera cierra y devuelve el foco al botón. No atrapa el foco (no es modal). */
export function Popover({ trigger, icon = "info-circle", title, children }: { trigger: string; icon?: IconName; title: string; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const out = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", out);
    return () => document.removeEventListener("click", out);
  }, [open]);
  return (
    <div className="po" ref={root} onKeyDown={(e) => { if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); btn.current?.focus(); } }}>
      <button ref={btn} className="cp-trig" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <Icon name={icon} />{trigger}
      </button>
      <div className="cp-pop" id={`${id}`} role="dialog" aria-labelledby={`${id}-t`} hidden={!open}>
        <h3 id={`${id}-t`}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

/** Panel lateral modal (<dialog>): foco al abrir y al cerrar lo gestiona el navegador. */
export function Drawer({ open, onClose, title, subtitle, children, footer }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const tid = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="cp-drawer" aria-labelledby={tid} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="cp-drawer__h">
        <div><h3 id={tid}>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
        <button className="cp-x" type="button" aria-label="Cerrar detalle" onClick={onClose}><Icon name="x-lg" /></button>
      </div>
      <div className="cp-drawer__b">{children}</div>
      {footer && <div className="cp-drawer__f">{footer}</div>}
    </dialog>
  );
}

/** Lista de clave/valor dentro de un drawer. */
export function KeyValue({ items }: { items: { term: string; value: ReactNode }[] }) {
  return (
    <dl className="cp-kv">
      {items.map((it) => <div key={it.term}><dt>{it.term}</dt><dd>{it.value}</dd></div>)}
    </dl>
  );
}

export type Step = { title: string; /** Titular del panel (recibe el foco al cambiar de paso); por defecto, `title`. */ heading?: string; content: ReactNode; /** Devuelve false para impedir avanzar. */ validate?: () => boolean };

/** Asistente por pasos: valida al avanzar, el foco va al titular del paso y «Atrás» nunca borra lo escrito. */
export function Stepper({ steps, label, onFinish, finishLabel = "Guardar" }: { steps: Step[]; label: string; onFinish: () => void; finishLabel?: string }) {
  const [cur, setCur] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  useEffect(() => { if (moved.current) heading.current?.focus(); }, [cur]);
  const next = () => {
    if (steps[cur].validate && !steps[cur].validate!()) return;
    moved.current = true;
    if (cur === steps.length - 1) { onFinish(); setCur(0); return; }
    setCur(cur + 1);
  };
  return (
    <div className="st">
      <ol className="st__list" aria-label={label}>
        {steps.map((s, i) => {
          const state = i < cur ? "done" : i === cur ? "now" : "pending";
          return (
            <li key={s.title} className="st__li" data-s={state} aria-current={i === cur ? "step" : undefined}>
              <span className="st__n" aria-hidden="true">{state === "done" ? "✓" : i + 1}</span>
              <span className="st__t">{s.title}{state === "done" && <span className="sr-only"> (completado)</span>}</span>
            </li>
          );
        })}
      </ol>
      <div>
        {steps.map((s, i) => (
          <div key={s.title} className="st__panel" hidden={i !== cur}>
            {i === cur ? <h3 tabIndex={-1} ref={heading}>{s.heading ?? s.title}</h3> : null}
            {s.content}
          </div>
        ))}
      </div>
      <div className="st__foot">
        <span className="st__count" role="status">Paso {cur + 1} de {steps.length}</span>
        <span style={{ display: "flex", gap: ".6rem" }}>
          <button className="av-btn av-btn--ghost" type="button" disabled={cur === 0} onClick={() => { moved.current = true; setCur(cur - 1); }}>Atrás</button>
          <button className={cn("av-btn av-btn--primary")} type="button" onClick={next}>{cur === steps.length - 1 ? finishLabel : "Siguiente →"}</button>
        </span>
      </div>
    </div>
  );
}
