"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "./icon";

export type ComboOption = { title: string; detail?: string };

/** Compara sin tildes ni mayúsculas. */
export const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  if (!query) return text;
  const i = normalize(text).indexOf(normalize(query));
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + query.length)}</mark>{text.slice(i + query.length)}</>;
}

/**
 * Combobox con lista filtrable (patrón ARIA 1.2). El foco se queda en el campo; la opción activa se anuncia con aria-activedescendant.
 * ↑↓ recorren, Enter elige, Esc cierra (y, ya cerrado, vacía el campo).
 */
export function Combobox({ label, options, help = "Usa las flechas para recorrer y Enter para elegir.", placeholder = "Escribe para buscar…", onChoose }: {
  label: string;
  options: ComboOption[];
  help?: string;
  placeholder?: string;
  onChoose?: (o: ComboOption) => void;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);

  const shown = options.filter((o) => !query || normalize(`${o.title} ${o.detail ?? ""}`).includes(normalize(query)));
  const live = !open ? "" : shown.length ? `${shown.length} ${shown.length === 1 ? "resultado disponible" : "resultados disponibles"}.` : "Sin resultados.";

  useEffect(() => {
    const out = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", out);
    return () => document.removeEventListener("click", out);
  }, []);

  const choose = (o: ComboOption | undefined) => {
    if (!o) return;
    setValue(o.detail ? `${o.title} · ${o.detail}` : o.title);
    setOpen(false);
    setActive(-1);
    onChoose?.(o);
  };
  const move = (d: number) => {
    if (!shown.length) return;
    setActive((a) => (a + d + shown.length) % shown.length);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) { setOpen(true); setActive(-1); } move(active < 0 ? 1 : 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (!open) setOpen(true); move(-1); }
    else if (e.key === "Enter") { if (open && active >= 0) { e.preventDefault(); choose(shown[active]); } }
    else if (e.key === "Escape") { if (open) { e.preventDefault(); setOpen(false); } else { setValue(""); setQuery(""); } }
  };

  return (
    <div className="cb" ref={root}>
      <label className="hz-label" htmlFor={`${id}-in`}>{label}</label>
      <div className="cb__wrap">
        <input
          className="hz-input"
          id={`${id}-in`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-describedby={`${id}-help`}
          aria-activedescendant={open && active >= 0 ? `${id}-o${active}` : undefined}
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => { setValue(e.target.value); setQuery(e.target.value.trim()); setOpen(true); setActive(-1); }}
          onFocus={() => { if (!open) { setQuery(""); setOpen(true); } }}
          onKeyDown={onKey}
        />
        <Icon name="search" className="cb__ic" />
      </div>
      <ul className="cb__list" id={`${id}-list`} role="listbox" aria-label={label} hidden={!open}>
        {shown.length ? shown.map((o, i) => (
          <li key={`${o.title}${o.detail}`} className="cb__opt" role="option" id={`${id}-o${i}`} aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); choose(o); }}>
            <span><Highlight text={o.title} query={query} /></span>
            {o.detail && <small>{o.detail}</small>}
          </li>
        )) : <li className="cb__none" role="presentation">Sin resultados para «{query}».</li>}
      </ul>
      <span className="hz-help" id={`${id}-help`}>{help}</span>
      <div className="sr-only" aria-live="polite">{live}</div>
    </div>
  );
}
