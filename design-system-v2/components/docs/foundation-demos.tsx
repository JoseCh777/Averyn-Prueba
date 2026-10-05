/* Muestras de «Fundamentos» y piezas de datos de «Componentes» (antes: foundations.js). Sin estado: se renderizan en el servidor. */
import { COLORS, CONTRAST_PAIRS, ICON_SAMPLES, RADII, SPACES } from "@/lib/foundations-data";
import { Chip, type ChipTone } from "@/components/ui/feedback";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/* ---------- Contraste WCAG ---------- */
const lum = (hex: string) => {
  const h = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => { const v = parseInt(h.slice(i, i + 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a: string, b: string) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

/** Muestras de color: un botón por color; al hacer clic se copia el hex (lo gestiona DocBehaviors con data-hex). */
export function ColorSwatches({ group }: { group: keyof typeof COLORS }) {
  return (
    <div className="ds-grid ds-grid--4">
      {COLORS[group].map(([name, token, hex, use]) => {
        const border = /^#(FFFFFF|F4F8FF|F4F6FA|EAF0FE|E8F8F0|FEF3E2|FDECEA|E3F6FA|DCE5F5|CFDCF3|DCECFF)$/i.test(hex) ? "inset 0 0 0 1px rgba(0,12,36,.08)" : undefined;
        const ink = contrast("#FFFFFF", hex) >= contrast("#000C24", hex) ? "#FFFFFF" : "#000C24";
        return (
          <button key={token} className="sw" type="button" data-hex={hex} aria-label={`Copiar ${name} ${hex}`}>
            <span className="sw__chip" style={{ background: hex, color: ink, boxShadow: border }}>{hex}</span>
            <span className="sw__meta"><b>{name}</b><span>{token}</span><em>{use}</em></span>
          </button>
        );
      })}
    </div>
  );
}

export function ContrastTable() {
  return (
    <div className="doc-wrap">
      <table className="doc-table" id="contrast-table">
        <thead><tr><th>Muestra</th><th>Texto / elemento</th><th>Fondo</th><th>Ratio</th><th>Uso</th></tr></thead>
        <tbody>
          {CONTRAST_PAIRS.map(([fg, bg, name, use]) => {
            const r = contrast(fg, bg);
            const level = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "Solo grande / componente" : "No cumple";
            const banned = /NO USAR|nunca texto|Solo separador/.test(use);
            const ok = (r >= 4.5 && !banned) || (r >= 3 && /componente|foco/i.test(use));
            return (
              <tr key={`${fg}${bg}`}>
                <td><span aria-hidden="true" data-demo="contraste" style={{ display: "inline-block", padding: ".2rem .7rem", borderRadius: 6, background: bg, color: fg, fontWeight: 600, boxShadow: "inset 0 0 0 1px rgba(0,12,36,.1)" }}>Aa</span></td>
                <td>{name}<br /><code>{fg}</code></td>
                <td><code>{bg}</code></td>
                <td className={ok ? "pass" : "fail"}>{r.toFixed(2)}:1<br /><small>{level}</small></td>
                <td>{use}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SpaceScale() {
  return (
    <div className="scale">
      {SPACES.map(([token, px]) => (
        <div key={token} className="scale__row"><code>--av-{token}</code><span className="mono">{px} px</span><span className="scale__bar" style={{ width: px * 3 }} /></div>
      ))}
    </div>
  );
}

export function RadiiGrid() {
  return (
    <div className="ds-grid ds-grid--4">
      {RADII.map(([label, token, use, value]) => (
        <div key={token}><div className="rad" style={{ borderRadius: value }}>{label}<br />--av-radius-{token}</div><p className="ds-note">{use}</p></div>
      ))}
    </div>
  );
}

export function IconGrid() {
  return (
    <div className="icons ds-gap-top">
      {ICON_SAMPLES.map(([name, label]) => (
        <button key={name} type="button" data-icon={`bi bi-${name}`} aria-label={`Copiar clase del icono ${label}`}>
          <Icon name={name as IconName} /><span>{label}</span>
        </button>
      ))}
    </div>
  );
}

const CHIP_ROWS: [ChipTone, IconName, string][] = [["neutral", "clock", "Pendiente"], ["info", "info-circle", "En revisión"], ["success", "check-circle", "Verificada"], ["warning", "arrow-repeat", "Reintento"], ["error", "x-circle", "Rechazada"], ["brand", "stars", "Nueva"]];
export function ChipMatrix() {
  const variants: [("outline" | "solid" | undefined), string][] = [["outline", "Contorno"], [undefined, "Suave"], ["solid", "Sólida"]];
  return (
    <div className="stage chip-matrix">
      {variants.map(([v, label]) => (
        <div key={label} className="chip-matrix__row">
          <span>{label}</span>
          <div className="chip-matrix__chips">{CHIP_ROWS.map(([tone, icon, text]) => <Chip key={text} tone={tone} icon={icon} variant={v}>{text}</Chip>)}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Actividad: un único conjunto de eventos alimenta franja, barras y lista ---------- */
type Ev = { r: "ok" | "bad" | "retry"; who: string; what: string; dev: string; when: string };
const EVENTS: Ev[] = [
  { r: "ok", who: "Ana Torres", what: "Rostro verificado", dev: "CAM-001", when: "02/10/2026, 10:42" },
  { r: "bad", who: "Laura Díaz", what: "Huella rechazada", dev: "LEC-003", when: "02/10/2026, 10:31" },
  { r: "retry", who: "Andrés Molina", what: "Rostro: reintento requerido", dev: "CAM-002", when: "02/10/2026, 09:55" },
  { r: "ok", who: "Carlos Mendoza", what: "Huella verificada", dev: "LEC-001", when: "02/10/2026, 09:15" },
  { r: "ok", who: "Valeria Quispe", what: "Rostro verificado", dev: "CAM-001", when: "01/10/2026, 17:20" },
  { r: "retry", who: "Jorge Salazar", what: "Huella: reintento requerido", dev: "LEC-001", when: "01/10/2026, 16:48" },
];
const count = { ok: EVENTS.filter((e) => e.r === "ok").length, bad: EVENTS.filter((e) => e.r === "bad").length, retry: EVENTS.filter((e) => e.r === "retry").length };
const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;

export function ActivityKpi() {
  return (
    <div className="av-kpi">
      <span className="av-kpi__label mono">Verificaciones</span>
      <span className="av-kpi__value">{EVENTS.length}</span>
      <span className="av-kpi__delta av-kpi__delta--ok">{plural(count.ok, "exitosa", "exitosas")}</span>
      <span className="av-kpi__note">{plural(count.bad, "rechazada", "rechazadas")} · {plural(count.retry, "reintento", "reintentos")}</span>
    </div>
  );
}

export function ActivityPanelDemo() {
  const total = EVENTS.length;
  const row = (cls: string, name: string, n: number) => (
    <div className={cn("av-bar", cls)}><span>{name}</span><span className="av-bar__track" aria-hidden="true"><i style={{ ["--w" as string]: `${Math.round((n / total) * 100)}%` }} /></span><b>{n}</b></div>
  );
  return (
    <div className="av-panel on-night">
      <h3>Actividad reciente</h3><p className="av-panel__sub">Últimas acciones registradas</p>
      <div className="av-bars">
        <span className="mono" style={{ color: "var(--av-night-text)" }}>Resultados del log · {total} eventos</span>
        {row("", "Exitosas", count.ok)}{row("av-bar--bad", "Rechazadas", count.bad)}{row("av-bar--retry", "Reintentos", count.retry)}
      </div>
      <ul className="av-feed" aria-label="Últimos eventos">
        {EVENTS.slice(0, 3).map((e) => (
          <li key={e.when} className={e.r === "ok" ? undefined : e.r}><b>Verificación biométrica</b><span>{e.who} · {e.what}</span><small>{e.when} · {e.dev}</small></li>
        ))}
      </ul>
      <p className="av-panel__sub" style={{ margin: ".2rem 0 0" }}>Últimos 3 de {total} eventos</p>
    </div>
  );
}
