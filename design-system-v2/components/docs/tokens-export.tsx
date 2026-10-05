"use client";
import tokens from "@/lib/tokens.json";
import { useToast } from "@/components/ui/overlay";

type Group = Record<string, { $value: string }>;
const T = tokens as unknown as Record<string, Group | string>;
const TYPE: Record<string, string> = { color: "color", chart: "color", fontFamily: "fontFamily", fontSize: "dimension", space: "dimension", radius: "dimension", dimension: "dimension", shadow: "shadow", transition: "transition", easing: "cubicBezier", ratio: "other" };
const RAW = JSON.stringify(tokens, null, 2);
const groups = Object.keys(T).filter((k) => !k.startsWith("$"));

const sample = JSON.stringify({
  color: { blue: (T.color as Group).blue, navy: (T.color as Group).navy },
  space: { "4": (T.space as Group)["4"] },
  shadow: { key: (T.shadow as Group).key },
  transition: (T.transition as Group).fast,
}, null, 2);

/** Exportación de tokens en el formato W3C: tabla de grupos, descarga, copia y fragmento de ejemplo. */
export function TokensExport() {
  const toast = useToast();
  const copy = async (text: string, label: string) => { try { await navigator.clipboard.writeText(text); toast({ title: "Copiado", text: label, kind: "ok" }); } catch { toast({ title: "No se pudo copiar", text: "Selecciona el texto manualmente.", kind: "warn" }); } };
  const download = () => {
    const a = document.createElement("a");
    a.download = "tokens.json";
    a.href = URL.createObjectURL(new Blob([RAW + "\n"], { type: "application/json;charset=utf-8" }));
    document.body.appendChild(a); a.click(); a.remove();
    toast({ title: "Descarga lista", text: "tokens.json", kind: "ok" });
  };
  return (
    <div className="tk-grid">
      <div className="stage">
        <span className="stage__label mono">Grupos exportados</span>
        <div className="doc-wrap" style={{ margin: ".6rem 0 0" }}>
          <table className="doc-table">
            <thead><tr><th>Grupo</th><th>Tokens</th><th>Tipo W3C</th></tr></thead>
            <tbody>{groups.map((g) => <tr key={g}><td><code>{g}</code></td><td>{Object.keys(T[g] as Group).length}</td><td>{TYPE[g] ?? ""}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="pt-actions" style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginTop: "1rem" }}>
          <button className="av-btn av-btn--primary" type="button" onClick={download}>Descargar tokens.json</button>
          <button className="av-btn av-btn--ghost" type="button" onClick={() => copy(RAW, "tokens.json")}>Copiar JSON</button>
        </div>
      </div>
      <div><div className="codeblock" style={{ marginTop: 0 }}><pre id="tk-sample">{sample}</pre><button className="copy" type="button" data-copy="#tk-sample">Copiar</button></div></div>
    </div>
  );
}

/** Muestras de los colores exportados; clic para copiar. */
export function TokenSwatches() {
  const toast = useToast();
  const items: { g: string; n: string; v: string }[] = [];
  for (const g of ["color", "chart"]) for (const [n, t] of Object.entries((T[g] ?? {}) as Group)) if (/^#[0-9A-F]{6,8}$/i.test(t.$value)) items.push({ g, n, v: t.$value });
  return (
    <div className="tk-sw">
      {items.map(({ g, n, v }) => (
        <button key={`${g}-${n}`} type="button" style={{ ["--c" as string]: v }} aria-label={`Copiar ${g} ${n} ${v}`} onClick={() => { navigator.clipboard?.writeText(v); toast({ title: "Copiado", text: v, kind: "ok" }); }}>
          <i /><span><b>{g === "chart" ? "viz-" : ""}{n}</b>{v}</span>
        </button>
      ))}
    </div>
  );
}
