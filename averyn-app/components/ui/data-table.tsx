"use client";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "./icon";
import { normalize } from "./combobox";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  /** Fuente monoespaciada (números, documentos, fechas). */
  mono?: boolean;
  render?: (row: T) => ReactNode;
};

/**
 * Tabla avanzada: búsqueda, orden (aria-sort), selección con casilla «indeterminada», acciones masivas, densidad y paginación.
 * La casilla de la cabecera selecciona solo la página visible; el conteo seleccionado se anuncia con role="status".
 */
export function DataTable<T extends { id: number | string }>({ rows, columns, label, searchKeys, searchLabel = "Buscar", searchPlaceholder, perPage = 5, noun = ["persona", "personas"], bulkActions, who }: {
  rows: T[];
  columns: Column<T>[];
  label: string;
  searchKeys: (keyof T & string)[];
  searchLabel?: string;
  searchPlaceholder?: string;
  perPage?: number;
  noun?: [string, string];
  /** Botones de la barra de acciones masivas. Reciben los ids seleccionados. */
  bulkActions?: (selected: (T["id"])[]) => ReactNode;
  /** Primera columna con nombre y detalle debajo. */
  who?: { key: keyof T & string; detail: keyof T & string };
}) {
  const id = useId();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: string; dir: 1 | -1 }>({ k: columns.find((c) => c.sortable)?.key ?? columns[0]!.key, dir: 1 });
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<Set<T["id"]>>(new Set());
  const [compact, setCompact] = useState(false);
  const all = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const f = rows.filter((r) => !q || normalize(searchKeys.map((k) => String(r[k])).join(" ")).includes(normalize(q)));
    return [...f].sort((a, b) => {
      const x = a[sort.k as keyof T] as unknown as string | number;
      const y = b[sort.k as keyof T] as unknown as string | number;
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
    });
  }, [rows, q, sort, searchKeys]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const cur = Math.min(page, pages);
  const visible = filtered.slice((cur - 1) * perPage, cur * perPage);
  const nVisSel = visible.filter((r) => sel.has(r.id)).length;

  useEffect(() => {
    if (all.current) {
      all.current.checked = visible.length > 0 && nVisSel === visible.length;
      all.current.indeterminate = nVisSel > 0 && nVisSel < visible.length;
    }
  });

  const total = sel.size;
  const toggle = (rid: T["id"], on: boolean) => setSel((s) => { const n = new Set(s); if (on) n.add(rid); else n.delete(rid); return n; });
  const sortBy = (k: string) => { setSort((s) => ({ k, dir: s.k === k ? (s.dir === 1 ? -1 : 1) : 1 })); setPage(1); };

  return (
    <div className={cn("cp-demo ta", compact && "ta--compact")}>
      {total === 0 ? (
        <div className="ta__bar">
          <div style={{ flex: 1, minWidth: "12rem", maxWidth: "18rem" }}>
            <label className="sr-only" htmlFor={`${id}-q`}>{searchLabel}</label>
            <input ref={searchRef} className="av-input" id={`${id}-q`} type="search" placeholder={searchPlaceholder} autoComplete="off" value={q} onChange={(e) => { setQ(e.target.value.trim()); setPage(1); }} />
          </div>
          <span className="ta__sp" />
          <div className="vz-seg" role="group" aria-label="Densidad de filas">
            <button type="button" aria-pressed={!compact} onClick={() => setCompact(false)}>Cómoda</button>
            <button type="button" aria-pressed={compact} onClick={() => setCompact(true)}>Compacta</button>
          </div>
        </div>
      ) : (
        <div className="ta__bar ta__bar--sel">
          <b role="status">{total} {total === 1 ? `${noun[0]} seleccionada` : `${noun[1]} seleccionadas`}</b>
          <span className="ta__sp" />
          {bulkActions?.([...sel])}
          <button className="av-btn av-btn--text" type="button" style={{ minHeight: 44 }} onClick={() => { setSel(new Set()); searchRef.current?.focus(); }}>Limpiar selección</button>
        </div>
      )}
      <div className="ta__wrap" tabIndex={0} role="region" aria-label={`${label} (desplazable)`}>
        <table>
          <thead>
            <tr>
              <th className="ta__ck" scope="col">
                <label><input ref={all} type="checkbox" aria-label="Seleccionar todas las filas de esta página" onChange={(e) => visible.forEach((r) => toggle(r.id, e.target.checked))} /></label>
              </th>
              {columns.map((c) => (
                <th key={c.key} scope="col" aria-sort={c.sortable ? (sort.k === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none") : undefined}>
                  {c.sortable ? (
                    <button className="ta__sort" type="button" onClick={() => sortBy(c.key)}>
                      {c.header}<Icon name={sort.k === c.key ? (sort.dir === 1 ? "arrow-up" : "arrow-down") : "arrow-down-up"} />
                    </button>
                  ) : c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length ? visible.map((r) => {
              const s = sel.has(r.id);
              return (
                <tr key={r.id} aria-selected={s}>
                  <td className="ta__ck"><label><input type="checkbox" checked={s} aria-label={`Seleccionar a ${String(r[who?.key ?? columns[0]!.key])}`} onChange={(e) => toggle(r.id, e.target.checked)} /></label></td>
                  {columns.map((c, i) => (
                    <td key={c.key} className={cn(c.mono && "ta__mono", who && i === 0 && "ta__who")}>
                      {who && i === 0 ? <><b>{String(r[who.key])}</b><small>{String(r[who.detail])}</small></> : c.render ? c.render(r) : String(r[c.key])}
                    </td>
                  ))}
                </tr>
              );
            }) : (
              <tr><td colSpan={columns.length + 1} className="ta__empty">
                Sin resultados para «{q}». Prueba con otro nombre o <button type="button" className="av-btn av-btn--text" style={{ minHeight: 44, display: "inline" }} onClick={() => { setQ(""); if (searchRef.current) searchRef.current.value = ""; setPage(1); }}>limpia la búsqueda</button>.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="ta__foot">
        <span role="status">{filtered.length ? `Mostrando ${(cur - 1) * perPage + 1}–${(cur - 1) * perPage + visible.length} de ${filtered.length}` : "0 resultados"}</span>
        <div className="ta__pg" aria-label="Paginación" role="group">
          <button type="button" aria-label="Página anterior" disabled={cur === 1} onClick={() => setPage(cur - 1)}><Icon name="chevron-left" /></button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" aria-label={`Página ${p}`} aria-current={p === cur ? "page" : undefined} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button type="button" aria-label="Página siguiente" disabled={cur === pages} onClick={() => setPage(cur + 1)}><Icon name="chevron-right" /></button>
        </div>
      </div>
    </div>
  );
}
