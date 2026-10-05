"use client";
import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TipRow = { k: string; v: string; c?: string };
export type InspectItem = { title: string; rows: TipRow[]; say: string; at: () => { x: number; y: number } };

type Tip = { title: string; rows: TipRow[]; x: number; y: number } | null;
type Ctx = { show: (t: NonNullable<Tip>, say: string) => void; hide: () => void };
const TipCtx = createContext<Ctx | null>(null);

/** Tooltip único y región aria-live compartidos por todos los gráficos. El tooltip es decorativo: el valor se anuncia por la región. */
export function ChartTipProvider({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<Tip>(null);
  const [say, setSay] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  const show = useCallback((t: NonNullable<Tip>, s: string) => { setTip(t); setSay(s); }, []);
  const hide = useCallback(() => setTip(null), []);

  useLayoutEffect(() => {
    if (!tip || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const left = Math.min(Math.max(8, tip.x - r.width / 2), window.innerWidth - r.width - 8);
    let top = tip.y - r.height - 12;
    if (top < 8) top = tip.y + 18;
    setPos({ left, top });
  }, [tip]);

  return (
    <TipCtx.Provider value={{ show, hide }}>
      {children}
      <div ref={box} className={`vz-tip${tip ? " is-on" : ""}`} aria-hidden="true" style={{ left: pos.left, top: pos.top }}>
        {tip && (<>
          <span className="vz-tip__t">{tip.title}</span>
          {tip.rows.map((r) => <div key={r.k} className="vz-tip__r"><span>{r.c && <i style={{ ["--c" as string]: r.c }} />}{r.k}</span><b>{r.v}</b></div>)}
        </>)}
      </div>
      <div className="sr-only" aria-live="polite">{say}</div>
    </TipCtx.Provider>
  );
}

/**
 * Navegación con flechas y tooltip para un gráfico. `items` describe cada valor; `cols` activa ↑↓ por filas (mapa de calor).
 * Devuelve `host` (props para el contenedor enfocable), `active` (índice) y `go`/`off`.
 */
export function useInspector(items: InspectItem[], label: string, opts: { cols?: number } = {}) {
  const ctx = useContext(TipCtx);
  const [active, setActive] = useState(-1);
  const cur = useRef(-1);

  const go = useCallback((k: number) => {
    if (k < 0 || k >= items.length) return;
    cur.current = k; setActive(k);
    const it = items[k];
    const p = it.at();
    ctx?.show({ title: it.title, rows: it.rows, x: p.x, y: p.y }, it.say);
  }, [items, ctx]);
  const off = useCallback(() => { cur.current = -1; setActive(-1); ctx?.hide(); }, [ctx]);

  const onKeyDown = (e: KeyboardEvent) => {
    const c = opts.cols ?? 1, a = cur.current;
    let k = a;
    switch (e.key) {
      case "ArrowRight": k = a < 0 ? 0 : Math.min(items.length - 1, a + 1); break;
      case "ArrowLeft": k = a < 0 ? 0 : Math.max(0, a - 1); break;
      case "ArrowDown": k = a < 0 ? 0 : Math.min(items.length - 1, a + (opts.cols ? c : 1)); break;
      case "ArrowUp": k = a < 0 ? 0 : Math.max(0, a - (opts.cols ? c : 1)); break;
      case "Home": k = 0; break;
      case "End": k = items.length - 1; break;
      case "Escape": off(); return;
      default: return;
    }
    e.preventDefault();
    go(k);
  };

  const host = {
    tabIndex: 0,
    role: "group" as const,
    "aria-roledescription": "gráfico interactivo",
    "aria-label": `${label}. Usa las flechas para recorrer los valores y Escape para salir.`,
    onKeyDown,
    onFocus: (e: React.FocusEvent<HTMLElement>) => { if (cur.current < 0 && e.currentTarget.matches(":focus-visible")) go(0); },
    onBlur: off,
  };
  return { host, active, go, off };
}
