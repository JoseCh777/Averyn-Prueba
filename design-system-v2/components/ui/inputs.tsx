"use client";
import { useEffect, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "./icon";
import { normalize } from "./combobox";
import { Chip } from "./feedback";
import { cn } from "@/lib/utils";

/** Resalta la coincidencia sin tildes ni mayúsculas. */
export function Mark({ text, query }: { text: string; query: string }): ReactNode {
  if (!query) return text;
  const i = normalize(text).indexOf(normalize(query));
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + query.length)}</mark>{text.slice(i + query.length)}</>;
}

/**
 * Campo de búsqueda. `/` lo enfoca desde cualquier parte (si no se escribe en otro campo); Esc limpia y, vacío, quita el foco.
 * El conteo se anuncia con role="status".
 */
export function SearchField({ value, onChange, label, placeholder, countText }: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  /** Texto de conteo, p. ej. «3 resultados» o «Sin resultados para «x»». */
  countText?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const key = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable) return;
      e.preventDefault();
      input.current?.focus();
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  return (
    <>
      <div className="sf">
        <label className="sr-only" htmlFor={id}>{label}</label>
        <Icon name="search" className="sf__ic" />
        <input
          ref={input}
          className="av-input sf__in"
          id={id}
          type="search"
          placeholder={placeholder}
          autoComplete="off"
          aria-describedby={`${id}-count`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Escape") { if (value) onChange(""); else input.current?.blur(); } }}
        />
        <button className="sf__x" type="button" aria-label="Limpiar búsqueda" hidden={!value} onClick={() => { onChange(""); input.current?.focus(); }}><Icon name="x-lg" /></button>
        <kbd className="cp-k sf__k" aria-hidden="true">/</kbd>
      </div>
      <p className="sf__count" id={`${id}-count`} role="status">{countText}</p>
    </>
  );
}

/**
 * Código de un solo uso: una casilla por dígito, pegado repartido, ←→ Inicio Fin y Retroceso entre casillas.
 * `onComplete` se llama al llenar todas; devuelve el estado a mostrar.
 */
export function OtpInput({ length = 6, label = "Código de verificación", help, state, message, onComplete, children }: {
  length?: number;
  label?: string;
  help?: ReactNode;
  state?: "error" | "ok" | "";
  message?: string;
  /** Se llama con el código completo. */
  onComplete: (code: string) => void;
  /** Acciones bajo el campo (verificar, reenviar). */
  children?: (a: { code: string; clear: () => void }) => ReactNode;
}) {
  const id = useId();
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const code = digits.join("");
  const locked = state === "ok";

  // Tras un código incorrecto se vacían las casillas y el foco vuelve a la primera (como en la guía).
  useEffect(() => {
    if (state === "error") { setDigits(Array(length).fill("")); refs.current[0]?.focus(); }
  }, [state, message, length]);

  const update = (next: string[]) => {
    setDigits(next);
    if (next.every(Boolean)) onComplete(next.join(""));
  };
  const clear = () => { setDigits(Array(length).fill("")); refs.current[0]?.focus(); };
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) { e.preventDefault(); const n = [...digits]; n[i - 1] = ""; setDigits(n); refs.current[i - 1]?.focus(); }
    else if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); refs.current[i - 1]?.focus(); }
    else if (e.key === "ArrowRight" && i < length - 1) { e.preventDefault(); refs.current[i + 1]?.focus(); }
    else if (e.key === "Home") { e.preventDefault(); refs.current[0]?.focus(); }
    else if (e.key === "End") { e.preventDefault(); refs.current[length - 1]?.focus(); }
  };
  const onPaste = (e: ClipboardEvent, i: number) => {
    e.preventDefault();
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!t) return;
    const from = t.length === length ? 0 : i;
    const n = [...digits];
    for (let k = 0; k < t.length && from + k < length; k++) n[from + k] = t[k];
    refs.current[Math.min(length - 1, from + t.length)]?.focus();
    update(n);
  };

  return (
    <fieldset className="otp" data-s={state || ""} aria-describedby={`${id}-help ${id}-msg`}>
      <legend className="av-label">{label}</legend>
      <div className="otp__row">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            className="otp__d"
            type="text"
            inputMode="numeric"
            maxLength={1}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Dígito ${i + 1} de ${length}`}
            aria-invalid={state === "error" || undefined}
            disabled={locked}
            value={d}
            onFocus={(e) => e.currentTarget.select()}
            onKeyDown={(e) => onKey(e, i)}
            onPaste={(e) => onPaste(e, i)}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(-1);
              const n = [...digits]; n[i] = v;
              if (v && i < length - 1) refs.current[i + 1]?.focus();
              update(n);
            }}
          />
        ))}
      </div>
      {help && <span className="av-help" id={`${id}-help`}>{help}</span>}
      <p className="otp__msg" id={`${id}-msg`} role="status">{message}</p>
      {children?.({ code, clear })}
    </fieldset>
  );
}

const REQUIREMENTS: [string, (v: string) => boolean][] = [
  ["Al menos 10 caracteres", (v) => v.length >= 10],
  ["Mayúsculas y minúsculas", (v) => /[a-z]/.test(v) && /[A-Z]/.test(v)],
  ["Un número", (v) => /\d/.test(v)],
  ["Un símbolo (por ejemplo ! ? # $)", (v) => /[^A-Za-z0-9]/.test(v)],
];
const LEVELS = ["", "Muy débil", "Débil", "Buena", "Fuerte"];

/** Estimación simple de fuerza (0–4). La validación definitiva y la lista de contraseñas filtradas la hace el servidor. */
export function passwordStrength(v: string) {
  const met = REQUIREMENTS.map(([, f]) => f(v));
  const n = met.filter(Boolean).length;
  let level = !v ? 0 : n <= 1 ? 1 : n === 2 ? 2 : n === 3 ? 3 : 4;
  if (v.length >= 14 && n >= 3) level = 4;
  return { met, n, level };
}

/** Campo de contraseña nueva con requisitos visibles desde el principio y fuerza anunciada con calma (aria-live polite). */
export function PasswordWithStrength({ label = "Nueva contraseña", value, onChange }: { label?: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const [announce, setAnnounce] = useState("Escribe una contraseña.");
  const { met, n, level } = passwordStrength(value);
  useEffect(() => {
    const t = setTimeout(() => setAnnounce(!value ? "Escribe una contraseña." : `Seguridad: ${LEVELS[level]}. Cumples ${n} de ${REQUIREMENTS.length} requisitos.`), value ? 450 : 0);
    return () => clearTimeout(t);
  }, [value, level, n]);
  return (
    <div className="pw" data-lv={level}>
      <div className="av-field">
        <div className="av-label__row">
          <label className="av-label" htmlFor={`${id}-in`}>{label}</label>
          <button className="av-btn av-btn--text" type="button" aria-pressed={shown} onClick={() => setShown((s) => !s)}
                  style={{ minHeight: 44, fontSize: ".8125rem", textTransform: "none", letterSpacing: 0, fontFamily: "var(--av-font-body)" }}>
            {shown ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <input className="av-input" id={`${id}-in`} type={shown ? "text" : "password"} autoComplete="new-password" aria-describedby={`${id}-req ${id}-st`} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      <div className="pw__bar" aria-hidden="true"><i /><i /><i /><i /></div>
      <p className="pw__st" id={`${id}-st`} role="status" aria-live="polite">{announce}</p>
      <ul className="pw__req" id={`${id}-req`} aria-label="Requisitos">
        {REQUIREMENTS.map(([text], i) => (
          <li key={text} className={met[i] ? "ok" : ""}>
            <Icon name={met[i] ? "check-circle-fill" : "circle"} /><span>{text}</span><span className="sr-only">{met[i] ? ": cumplido" : ": falta"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RemovableChip({ value, onRemove }: { value: string; onRemove: (v: string) => void }) {
  return (
    <span className="chipx">{value}
      <button type="button" aria-label={`Quitar ${value}`} onClick={() => onRemove(value)}><Icon name="x-lg" /></button>
    </span>
  );
}

/**
 * Selección múltiple con chips. ↑↓ mueven la opción activa, Espacio/Enter marcan y mantienen abierta la lista,
 * Retroceso con el campo vacío quita el último, Esc cierra. Los filtros activos se muestran en `ActiveFilters`.
 */
export function MultiSelect({ label, options, selected, onChange, describe, help = "Usa las flechas y Espacio o Enter para marcar. Retroceso quita el último." }: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  /** Texto secundario de cada opción (p. ej. «412 eventos»). */
  describe?: (o: string) => string;
  help?: string;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [act, setAct] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const shown = options.filter((o) => normalize(o).includes(normalize(query.trim())));
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
  const remove = (v: string) => { onChange(selected.filter((x) => x !== v)); input.current?.focus(); };

  useEffect(() => {
    const out = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) { setOpen(false); setAct(-1); } };
    document.addEventListener("click", out);
    return () => document.removeEventListener("click", out);
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setAct((a) => Math.min(shown.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setAct((a) => Math.max(0, a - 1)); }
    else if ((e.key === "Enter" || (e.key === " " && !query)) && open && act >= 0) { e.preventDefault(); toggle(shown[act]); }
    else if (e.key === "Backspace" && !query && selected.length) remove(selected[selected.length - 1]);
    else if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); setAct(-1); }
  };

  return (
    <div className="ms" ref={root}>
      <label className="av-label" id={`${id}-lab`} htmlFor={`${id}-in`}>{label}</label>
      <div className="ms__field" onClick={(e) => { if (!(e.target as HTMLElement).closest("button")) input.current?.focus(); }}>
        <span className="ms__chips">{selected.map((v) => <RemovableChip key={v} value={v} onRemove={remove} />)}</span>
        <input
          ref={input}
          className="ms__in"
          id={`${id}-in`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-describedby={`${id}-help`}
          aria-activedescendant={open && act >= 0 ? `${id}-o${act}` : undefined}
          autoComplete="off"
          placeholder="Elige uno o varios…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setAct(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
        />
      </div>
      <ul className="cb__list" id={`${id}-list`} role="listbox" aria-multiselectable="true" aria-labelledby={`${id}-lab`} hidden={!open}>
        {shown.length ? shown.map((o, i) => (
          <li key={o} id={`${id}-o${i}`} className="cb__opt cb__opt--m" role="option" aria-selected={selected.includes(o)} style={{ background: i === act ? "var(--av-blue-tint)" : undefined }}
              onMouseDown={(e) => { e.preventDefault(); toggle(o); input.current?.focus(); }}>
            <span className="cb__ck"><Icon name="check-lg" /></span>
            <span>{o}{describe && <small>{describe(o)}</small>}</span>
          </li>
        )) : <li className="cb__none" role="presentation">Sin resultados para «{query}».</li>}
      </ul>
      <span className="av-help" id={`${id}-help`}>{help}</span>
    </div>
  );
}

/** Fila de filtros activos sobre los resultados, con conteo y «Limpiar filtros». */
export function ActiveFilters({ values, onRemove, onClear, summary }: { values: string[]; onRemove: (v: string) => void; onClear: () => void; summary: string }) {
  return (
    <>
      <div className="fa" aria-label="Filtros activos">
        <span className="fa__t mono">Filtros</span>
        <span className="fa__chips">{values.map((v) => <RemovableChip key={v} value={v} onRemove={onRemove} />)}</span>
        <button className="av-btn av-btn--text" type="button" style={{ minHeight: 44 }} hidden={!values.length} onClick={onClear}>Limpiar filtros</button>
      </div>
      <p className="fa__n" role="status">{summary}</p>
    </>
  );
}

export type FileState = "load" | "ok" | "err" | "rej";
export type UploadRow = { id: number; name: string; bytes: number; p: number; state: FileState; why?: string; failAt?: number; retried?: boolean };

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = /\.(pdf|jpe?g|png)$/i;
const fmtSize = (b: number) => (b >= 1048576 ? `${(b / 1048576).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const fileIcon = (n: string) => (/\.pdf$/i.test(n) ? "file-earmark-pdf" : /\.(jpe?g|png)$/i.test(n) ? "file-earmark-image" : "file-earmark");

/**
 * Carga de archivos (simulada: no sube nada). Valida formato y tamaño en el navegador, muestra avance y
 * anuncia solo el resultado de cada archivo. Arrastrar es una mejora; siempre existe el selector nativo.
 */
export function FileUpload({ simulate = true }: { simulate?: boolean }) {
  const id = useId();
  const [rows, setRows] = useState<UploadRow[]>([]);
  const [over, setOver] = useState(false);
  const [live, setLive] = useState("");
  const seq = useRef(0);
  const timers = useRef<Record<number, ReturnType<typeof setInterval>>>({});
  const demoBtn = useRef<HTMLButtonElement>(null);
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => () => { Object.values(timers.current).forEach(clearInterval); }, []);
  const say = (t: string) => { setLive(""); setTimeout(() => setLive(t), 30); };
  const patch = (rid: number, p: Partial<UploadRow>) => setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, ...p } : r)));

  const run = (r: UploadRow) => {
    clearInterval(timers.current[r.id]);
    let p = 0;
    patch(r.id, { state: "load", p: 0 });
    timers.current[r.id] = setInterval(() => {
      p = Math.min(1, p + 0.09 + Math.random() * 0.06);
      if (r.failAt && p >= r.failAt && !r.retried) { clearInterval(timers.current[r.id]); patch(r.id, { state: "err", p: r.failAt }); say(`${r.name}: error de red. Puedes reintentar.`); return; }
      if (p >= 1) { clearInterval(timers.current[r.id]); patch(r.id, { state: "ok", p: 1 }); say(`${r.name}: listo.`); return; }
      patch(r.id, { p });
    }, reduce ? 60 : 180);
  };
  const add = (name: string, bytes: number, opt?: { failAt?: number }) => {
    const r: UploadRow = { id: ++seq.current, name, bytes, p: 0, state: "load", failAt: opt?.failAt };
    if (!ALLOWED.test(name)) { setRows((rs) => [...rs, { ...r, state: "rej", why: "Formato no permitido: usa PDF, JPG o PNG" }]); say(`${name}: rechazado, formato no permitido.`); return; }
    if (bytes > MAX_BYTES) { setRows((rs) => [...rs, { ...r, state: "rej", why: `Pesa ${fmtSize(bytes)}: el máximo es 5 MB` }]); say(`${name}: rechazado, pesa más de 5 MB.`); return; }
    setRows((rs) => [...rs, r]);
    setTimeout(() => run(r), 0);
  };
  const take = (files: FileList | null) => { if (files) Array.from(files).forEach((f) => add(f.name, f.size)); };
  const remove = (r: UploadRow, cancel?: boolean) => {
    clearInterval(timers.current[r.id]);
    setRows((rs) => rs.filter((x) => x.id !== r.id));
    say(`${r.name}${cancel ? ": carga cancelada." : ": quitado de la lista."}`);
    demoBtn.current?.focus();
  };

  const CHIP = { load: ["info", "arrow-repeat", "Cargando"], ok: ["success", "check-circle", "Listo"], err: ["warning", "exclamation-circle", "Error de red"], rej: ["error", "x-circle", "Rechazado"] } as const;

  return (
    <div>
      <label className={cn("up__drop", over && "is-over")} htmlFor={`${id}-in`}
             onDragEnter={(e) => { e.preventDefault(); setOver(true); }} onDragOver={(e) => { e.preventDefault(); setOver(true); }}
             onDragLeave={(e) => { e.preventDefault(); setOver(false); }} onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}>
        <Icon name="cloud-arrow-up" />
        <span className="up__t"><b>Arrastra los archivos aquí</b> o elígelos desde tu equipo</span>
        <span className="up__h" id={`${id}-h`}>PDF, JPG o PNG · hasta 5 MB cada uno</span>
      </label>
      <input className="sr-only" id={`${id}-in`} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" aria-describedby={`${id}-h`} onChange={(e) => { take(e.target.files); e.target.value = ""; }} />
      <ul className="up__list" aria-label="Archivos seleccionados">
        {rows.map((r) => {
          const [tone, icon, text] = CHIP[r.state];
          const pct = Math.round(r.p * 100);
          const meta = r.state === "rej" ? r.why : fmtSize(r.bytes) + (r.state === "load" ? ` · ${pct} %` : r.state === "err" ? " · se cortó la conexión" : "");
          return (
            <li key={r.id} className="up__row" data-state={r.state}>
              <Icon name={fileIcon(r.name)} className="up__ic" />
              <div className="up__nm">
                <b title={r.name}>{r.name}</b>
                <span className="up__meta"><Chip tone={tone} icon={icon}>{text}</Chip><small>{meta}</small></span>
              </div>
              <div className="up__act">
                {r.state === "load" && <button className="up__btn" type="button" onClick={() => remove(r, true)}>Cancelar<span className="sr-only"> {r.name}</span></button>}
                {r.state === "err" && <button className="up__btn" type="button" onClick={() => { r.retried = true; run({ ...r, retried: true }); }}>Reintentar<span className="sr-only"> {r.name}</span></button>}
                {r.state !== "load" && <button className="up__btn" type="button" onClick={() => remove(r)}>Quitar<span className="sr-only"> {r.name}</span></button>}
              </div>
              {r.state === "load" && <div className="up__bar" role="progressbar" aria-label={`Carga de ${r.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ ["--p" as string]: r.p }} /></div>}
            </li>
          );
        })}
      </ul>
      <p className="sr-only" role="status">{live}</p>
      {simulate && (
        <div className="up__acts">
          <button ref={demoBtn} className="av-btn av-btn--ghost" type="button" onClick={() => { add("cedula-frente.jpg", 1.3 * 1048576); add("cedula-reverso.png", 2.1 * 1048576, { failAt: 0.55 }); add("constancia-matricula.docx", 380 * 1024); }}>Simular 3 archivos</button>
          <button className="av-btn av-btn--ghost" type="button" onClick={() => { Object.values(timers.current).forEach(clearInterval); setRows([]); say("Lista vaciada."); }}>Vaciar lista</button>
        </div>
      )}
    </div>
  );
}
