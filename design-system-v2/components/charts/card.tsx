"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/overlay";
import { cn } from "@/lib/utils";
import { DeltaBadge, Sparkline, type Delta } from "./charts";
import { csvOf, type TableSpec } from "./utils";

/** Mide el ancho de un elemento y avisa al cambiar (con ResizeObserver). */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const nw = el.clientWidth; if (nw) setW((p) => (Math.abs(nw - p) > 2 ? nw : p)); }); });
    ro.observe(el);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return [ref, w] as const;
}

export type CardMeta = { value: ReactNode; period?: string; delta?: Delta };
export type RangeSpec = { def: string; keys: { key: string; label: string }[] };

/**
 * Tarjeta de gráfico: cascarón con título, periodo opcional, valor y variación, menú (ver como tabla, copiar y descargar CSV)
 * y pie. Cada gráfico debe ofrecer su tabla alternativa. Los datos son de ejemplo.
 */
export function ChartCard({ id, label, wide, range, meta, showValue, foot, render, table }: {
  id: string;
  label: string;
  wide?: boolean;
  range?: RangeSpec;
  meta?: (key: string) => CardMeta;
  showValue?: boolean;
  foot?: ReactNode;
  render: (width: number, key: string) => ReactNode;
  table: (key: string) => TableSpec;
}) {
  const toast = useToast();
  const menuId = useId();
  const [key, setKey] = useState(range?.def ?? "");
  const [tableMode, setTableMode] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLButtonElement>(null);
  const [fig, width] = useWidth<HTMLDivElement>();
  const m = showValue && meta ? meta(key) : null;
  const t = table(key);

  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const out = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", out);
    return () => document.removeEventListener("click", out);
  }, [open]);

  const close = (back?: boolean) => { setOpen(false); if (back) btn.current?.focus(); };
  const menuKey = (e: React.KeyboardEvent) => {
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === "Tab") close();
  };
  const download = () => {
    const a = document.createElement("a");
    a.download = `${id}.csv`;
    a.href = URL.createObjectURL(new Blob(["﻿" + csvOf(t)], { type: "text/csv;charset=utf-8" }));
    document.body.appendChild(a); a.click(); a.remove();
    close(true);
    toast({ title: "Descarga lista", text: `${id}.csv`, kind: "ok" });
  };

  return (
    <article ref={root} className={cn("cc", wide && "cc--wide")} aria-label={label}>
      <header className="cc__head">
        <h3 className="cc__label" style={{ margin: 0 }}>{label}</h3>
        <div className="cc__tools">
          {range && (
            <div className="vz-seg" role="group" aria-label="Periodo">
              {range.keys.map((k) => <button key={k.key} type="button" aria-pressed={k.key === key} onClick={() => setKey(k.key)}>{k.label}</button>)}
            </div>
          )}
          <button ref={btn} className="cc__menu" type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} aria-label={`Opciones del gráfico ${label}`} onClick={() => setOpen((o) => !o)}><Icon name="three-dots" /></button>
        </div>
      </header>
      {m && (<>
        <p className="cc__value">{m.value}</p>
        <p className="cc__meta">{m.delta && <DeltaBadge d={m.delta} />}<span>{m.period}</span></p>
      </>)}
      <div className="cc__body">
        <div ref={fig}>
          {tableMode ? (
            <div className="vz-table-wrap" tabIndex={0} role="region" aria-label={t.caption}>
              <table className="vz-table">
                <caption>{t.caption}</caption>
                <thead><tr>{t.head.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
                <tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j ? <td key={j}>{c}</td> : <th key={j} scope="row" style={{ fontWeight: 500 }}>{c}</th>))}</tr>)}</tbody>
              </table>
            </div>
          ) : width > 0 ? render(width, key) : null}
        </div>
      </div>
      {foot && <footer className="cc__foot">{foot}</footer>}
      <div className="cc__pop" hidden={!open}>
        <div className="av-menu" id={menuId} role="menu" aria-label={`Opciones de ${label}`} onKeyDown={menuKey}>
          <button ref={first} type="button" role="menuitem" onClick={() => { setTableMode((x) => !x); close(true); }}><Icon name="table" /><span>{tableMode ? "Ver gráfico" : "Ver como tabla"}</span></button>
          <button type="button" role="menuitem" onClick={() => { navigator.clipboard?.writeText(csvOf(t)); toast({ title: "Copiado", text: "Datos", kind: "ok" }); close(true); }}><Icon name="clipboard" /><span>Copiar datos (CSV)</span></button>
          <button type="button" role="menuitem" onClick={download}><Icon name="download" /><span>Descargar CSV</span></button>
        </div>
      </div>
    </article>
  );
}

/** Pie estándar de las tarjetas de ejemplo. */
export function SampleFoot({ children }: { children?: ReactNode }) {
  return <><span className="cc__sample">Datos de ejemplo</span>{children}</>;
}

/** Ficha KPI con sparkline. */
export function KpiTile({ label, value, delta, color, vals }: { label: string; value: ReactNode; delta: Delta; color: string; vals: number[] }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  return (
    <article className="kt" aria-label={label}>
      <h3 className="cc__label" style={{ margin: 0 }}>{label}</h3>
      <p className="cc__value">{value}</p>
      <p className="cc__meta"><DeltaBadge d={delta} /><span>vs ayer</span></p>
      <div ref={ref} className="kt__spark" role="img" aria-label={`Tendencia de ${label} en las últimas 12 mediciones`}>{w > 0 && <Sparkline vals={vals} color={color} width={w} />}</div>
    </article>
  );
}

/** Estados de una tarjeta de gráfico: cargando, vacío y error. */
export function ChartStateCard({ kind }: { kind: "loading" | "empty" | "error" }) {
  const toast = useToast();
  const act = (t: string) => toast({ title: t, text: "Aquí se volvería a pedir el dato al servidor.", kind: "ok" });
  return (
    <article className="cc" aria-busy={kind === "loading" || undefined}>
      <header className="cc__head"><h3 className="cc__label" style={{ margin: 0 }}>Verificaciones por día</h3></header>
      <div className="cc__body">
        {kind === "loading" && <div className="sk" role="status" aria-label="Cargando gráfico"><i className="big" /><i style={{ width: "30%" }} /><i className="chart" /></div>}
        {kind === "empty" && (
          <div className="cc-state"><Icon name="bar-chart" /><h3>Sin verificaciones en este periodo</h3><p>Cuando haya actividad, la tendencia aparecerá aquí. Prueba con un periodo más amplio.</p>
            <button className="av-btn av-btn--ghost" type="button" onClick={() => act("Ampliar a 90 días")}>Ampliar a 90 días</button></div>
        )}
        {kind === "error" && (
          <div className="cc-state" role="alert"><Icon name="exclamation-triangle" /><h3>No pudimos cargar este gráfico</h3><p>Hubo un problema al pedir los datos. Tus datos no se perdieron.</p>
            <button className="av-btn av-btn--ghost" type="button" onClick={() => act("Reintentar")}>Reintentar</button></div>
        )}
      </div>
    </article>
  );
}
