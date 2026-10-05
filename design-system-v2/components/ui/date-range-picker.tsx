"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./icon";

const fmtD = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short" });
const fmtY = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric" });
const fmtM = new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric" });
const fmtL = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const WEEKDAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const clean = (s: string) => s.replace(/\./g, "");
const add = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const same = (a: Date | null, b: Date | null) => !!a && !!b && a.getTime() === b.getTime();
const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export type DateRange = { from: Date; to: Date; label: string };

function rangeLabel(a: Date, b: Date) {
  return same(a, b) ? fmtY.format(a) : `${clean(fmtD.format(a))} – ${clean(fmtY.format(b))}`;
}

/**
 * Selector de periodo: atajos que aplican al instante y rango manual con «Aplicar».
 * Teclado: ←→ día, ↑↓ semana, Inicio/Fin semana, RePág/AvPág mes, Enter marca inicio y fin, Esc cierra.
 * Semana desde lunes, formato es-PE; las fechas futuras (después de `today`) quedan deshabilitadas.
 */
export function DateRangePicker({ today, value, onChange }: { today: Date; value: DateRange; onChange: (r: DateRange) => void }) {
  const popId = useId();
  const monthId = useId();
  const [open, setOpen] = useState(false);
  const [a, setA] = useState<Date | null>(value.from);
  const [b, setB] = useState<Date | null>(value.to);
  const [picking, setPicking] = useState(false);
  const [view, setView] = useState(monthStart(value.to));
  const [focus, setFocus] = useState(value.to);
  const trigger = useRef<HTMLButtonElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const wantFocus = useRef(false);

  const presets: [string, Date][] = [
    ["Hoy", today],
    ["Últimos 7 días", add(today, -6)],
    ["Últimos 30 días", add(today, -29)],
    ["Este trimestre", new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)],
    ["Este año", new Date(today.getFullYear(), 0, 1)],
  ];

  useEffect(() => {
    if (wantFocus.current) {
      wantFocus.current = false;
      grid.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
    }
  });

  const close = (back?: boolean) => {
    setOpen(false);
    if (back) trigger.current?.focus();
  };
  const commit = (from: Date, to: Date, label: string) => {
    onChange({ from, to, label });
    close(true);
  };
  const openIt = () => {
    setA(value.from); setB(value.to); setPicking(false); setView(monthStart(value.to)); setFocus(value.to);
    wantFocus.current = true;
    setOpen(true);
  };
  const pick = (d: Date) => {
    if (d > today) return;
    if (!picking || !a) { setA(d); setB(null); setPicking(true); }
    else {
      let x = a, y = d;
      if (y < x) [x, y] = [y, x];
      setA(x); setB(y); setPicking(false);
    }
    setFocus(d);
    wantFocus.current = true;
  };
  const go = (d: Date) => {
    const t = d > today ? today : d;
    setFocus(t);
    if (t.getMonth() !== view.getMonth() || t.getFullYear() !== view.getFullYear()) setView(monthStart(t));
    wantFocus.current = true;
  };
  const onGridKey = (e: KeyboardEvent) => {
    const k = e.key;
    const dow = (focus.getDay() + 6) % 7;
    let d: Date | null = null;
    if (k === "ArrowRight") d = add(focus, 1);
    else if (k === "ArrowLeft") d = add(focus, -1);
    else if (k === "ArrowDown") d = add(focus, 7);
    else if (k === "ArrowUp") d = add(focus, -7);
    else if (k === "Home") d = add(focus, -dow);
    else if (k === "End") d = add(focus, 6 - dow);
    else if (k === "PageUp") d = new Date(focus.getFullYear(), focus.getMonth() - 1, focus.getDate());
    else if (k === "PageDown") d = new Date(focus.getFullYear(), focus.getMonth() + 1, focus.getDate());
    if (d) { e.preventDefault(); go(d); }
  };

  const first = monthStart(view);
  const offset = (first.getDay() + 6) % 7;
  const lo = a && b ? (a < b ? a : b) : a;
  const hi = a && b ? (a < b ? b : a) : a;
  const monthTitle = fmtM.format(view);
  const summary = picking ? "Elige la fecha final." : a && b ? rangeLabel(a, b) : "Elige la fecha inicial.";

  return (
    <div className="cp-demo cp-demo--open" style={{ minHeight: open ? 600 : undefined }}>
      <button ref={trigger} className="cp-trig" type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={popId} onClick={() => (open ? close() : openIt())}>
        <Icon name="calendar3" /><span>{value.label}</span><Icon name="chevron-down" />
      </button>
      <div className="cp-pop dp" id={popId} role="dialog" aria-label="Elegir periodo" hidden={!open} onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); close(true); } }}>
        <div className="dp__presets" role="group" aria-label="Atajos de periodo">
          {presets.map(([name, from]) => (
            <button key={name} type="button" aria-pressed={value.label === name} onClick={() => commit(from, today, name)}>{name}</button>
          ))}
        </div>
        <div className="dp__cal">
          <div className="dp__nav">
            <button type="button" aria-label="Mes anterior" onClick={() => { const v = new Date(view.getFullYear(), view.getMonth() - 1, 1); setView(v); setFocus(v); }}><Icon name="chevron-left" /></button>
            <b id={monthId} aria-live="polite">{monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1)}</b>
            <button type="button" aria-label="Mes siguiente" onClick={() => { const n = new Date(view.getFullYear(), view.getMonth() + 1, 1); if (n <= today) { setView(n); setFocus(n); } }}><Icon name="chevron-right" /></button>
          </div>
          <div className="dp__grid" role="grid" aria-labelledby={monthId} ref={grid} onKeyDown={onGridKey}>
            {["L", "M", "X", "J", "V", "S", "D"].map((w, i) => (
              <div key={w} className="dp__wd" role="columnheader"><abbr title={WEEKDAYS[i]}>{w}</abbr></div>
            ))}
            {Array.from({ length: 42 }, (_, i) => {
              const d = add(first, i - offset);
              const out = d.getMonth() !== view.getMonth();
              const future = d > today;
              const inRange = !!lo && !!hi && d >= lo && d <= hi;
              const cls = ["dp__day", out && "is-out", inRange && "is-in", (same(d, lo) || same(d, hi)) && "is-edge", same(d, lo) && "is-start", same(d, hi) && "is-end", same(d, today) && "is-today"].filter(Boolean).join(" ");
              return (
                <button
                  key={d.getTime()}
                  type="button"
                  role="gridcell"
                  className={cls}
                  tabIndex={same(d, focus) ? 0 : -1}
                  aria-disabled={future || undefined}
                  aria-selected={inRange || undefined}
                  aria-label={fmtL.format(d) + (same(d, today) ? ", hoy" : "")}
                  onClick={() => pick(d)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          <div className="dp__foot">
            <span role="status">{summary}</span>
            <span style={{ display: "flex", gap: ".5rem" }}>
              <button className="hz-btn hz-btn--ghost" type="button" style={{ minHeight: 44, padding: "0 .9rem" }} onClick={() => close(true)}>Cancelar</button>
              <button className="hz-btn hz-btn--primary" type="button" style={{ minHeight: 44, padding: "0 .9rem" }} disabled={!(a && b) || picking} onClick={() => a && b && commit(a, b, rangeLabel(a, b))}>Aplicar</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { rangeLabel };
