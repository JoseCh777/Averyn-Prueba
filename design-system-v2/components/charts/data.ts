/* Modelos de datos de ejemplo de la biblioteca de gráficos (los mismos que muestra la documentación). Sin estado: sirven en servidor y cliente. */
import type { BarDatum, BreakdownTab, StackRow, StackSeries } from "./charts";
import { END, N, nf1, nf2, rng, shortDate, sgn, sum, trendSpec, type RangeKey, type TableSpec } from "./utils";

export const bars: { name: string; label: string; data: BarDatum[] } = {
  name: "Registros", label: "Registros por semana",
  data: [412, 530, 486, 602, 574, 690, 655, 742].map((v, i) => { const t = END - (7 - i) * 7 * 864e5; return { label: shortDate(t), long: `Semana del ${shortDate(t - 6 * 864e5)} al ${shortDate(t)}`, v }; }),
};
export const ocr = { rows: [{ label: "N.º de documento", v: 99.1 }, { label: "Apellidos", v: 97.8 }, { label: "Nombres", v: 97.2 }, { label: "Fecha de nacimiento", v: 95.4 }, { label: "Dirección", v: 88.9 }, { label: "Lugar de nacimiento", v: 86.3 }] };
export const stack: { label: string; series: StackSeries[]; rows: StackRow[] } = {
  label: "Verificaciones por dispositivo",
  series: [{ id: "ok", name: "Exitosas", color: "var(--viz-ok)", icon: "check-circle" }, { id: "retry", name: "Reintentos", color: "var(--viz-retry)", icon: "arrow-repeat" }, { id: "rej", name: "Rechazadas", color: "var(--viz-bad)", icon: "x-circle" }],
  rows: [
    { label: "CAM-001", vals: { ok: 1840, retry: 212, rej: 96 } }, { label: "CAM-002", vals: { ok: 1522, retry: 188, rej: 74 } }, { label: "LEC-001", vals: { ok: 1204, retry: 64, rej: 41 } },
    { label: "LEC-002", vals: { ok: 968, retry: 120, rej: 88 } }, { label: "KIOSCO-01", vals: { ok: 612, retry: 35, rej: 20 } },
  ],
};
export const donut = { name: "Verificaciones por método", label: "Verificaciones por método", unit: "verificaciones", segs: [{ label: "Rostro", v: 7240, color: "var(--viz-1)" }, { label: "Huella", v: 3868, color: "var(--viz-2)" }, { label: "Documento (OCR)", v: 1372, color: "var(--viz-3)" }] };
export const bullet = { name: "Participación", goal: 80, rows: [{ label: "Mesa 1", v: 88 }, { label: "Mesa 2", v: 72 }, { label: "Mesa 3", v: 54 }, { label: "Mesa 4", v: 81 }] };
export const kpis = [
  { id: "k1", label: "Verificaciones hoy", value: "1,284", delta: { dir: "up" as const, tone: "good", text: "+4.2%" }, color: "var(--viz-1)", vals: [22, 25, 24, 28, 27, 31, 30, 34, 33, 38, 36, 41] },
  { id: "k2", label: "Tasa de coincidencia", value: "98.4%", delta: { dir: "up" as const, tone: "good", text: "+0.6 pp" }, color: "var(--viz-1)", vals: [96, 96.4, 96.1, 97, 97.3, 97.1, 97.8, 97.6, 98, 98.2, 98.1, 98.4] },
  { id: "k3", label: "Tiempo medio", value: "1.8 s", delta: { dir: "down" as const, tone: "good", text: "−0.2 s" }, color: "var(--viz-1)", vals: [2.3, 2.2, 2.25, 2.1, 2.05, 2.0, 2.05, 1.95, 1.9, 1.9, 1.85, 1.8] },
  { id: "k4", label: "Dispositivos activos", value: "18 / 20", delta: { dir: "flat" as const, tone: "flat", text: "Sin cambios" }, color: "var(--viz-other)", vals: [19, 19, 20, 20, 19, 18, 18, 19, 18, 18, 18, 18] },
];
const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
const dnames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const rh = rng(7);
export const heat = {
  name: "Accesos", label: "Accesos por día y franja horaria",
  cols: hours.map((h) => ({ short: `${h}h`, long: `${h}–${h + 2} h` })),
  rows: dnames.map((n, d) => ({ label: n, v: hours.map((h) => { const wk = d < 5; const base = wk ? (h >= 8 && h < 10 ? 320 : h >= 12 && h < 14 ? 260 : h >= 6 && h < 18 ? 150 : 24) : (h >= 10 && h < 14 ? 70 : 12); return Math.round(base * (0.85 + rh() * 0.3)); }) })),
};
export const funnel = { rows: [{ label: "Captura iniciada", v: 1240 }, { label: "Calidad suficiente", v: 1102 }, { label: "Prueba de vida", v: 1046 }, { label: "Coincidencia ≥ 0.68", v: 981 }] };
const below = [1, 2, 3, 5, 8, 12, 17, 22, 26, 24, 19, 14, 10, 7, 5, 4, 3], above = [6, 14, 30, 52, 74, 90, 55, 20];
export const hist = { label: "Distribución de puntajes de similitud", threshold: 0.68, bins: [...below, ...above].map((n, i) => ({ from: +(i * 0.04).toFixed(2), to: +((i + 1) * 0.04).toFixed(2), n })) };
export const breakdown: { label: string; tabs: BreakdownTab[] } = {
  label: "Desglose de eventos de auditoría",
  tabs: [
    { name: "Por evento", col: "Evento", totalD: 3.9, rows: [{ label: "LOGIN", n: 4812, d: 3.1 }, { label: "PERSON_CREATED", n: 612, d: 8.4 }, { label: "DOCUMENT_REGISTERED", n: 587, d: 7.9 }, { label: "BIOMETRIC_ENROLLED", n: 436, d: -2.2, tone: "bad" }, { label: "BIOMETRIC_VERIFIED", n: 9744, d: 1.5 }, { label: "VOTE_CAST", n: 1953, d: 12.6 }] },
    { name: "Por dispositivo", col: "Dispositivo", totalD: 2.4, rows: [{ label: "CAM-001", n: 2148, d: 3.8 }, { label: "CAM-002", n: 1784, d: 1.2 }, { label: "LEC-001", n: 1309, d: 0 }, { label: "LEC-002", n: 1176, d: -4.6, tone: "bad" }, { label: "KIOSCO-01", n: 667, d: 9.1 }] },
  ],
};

/* ---------- Tablas alternativas (cada gráfico debe tener una) ---------- */
export const tables = {
  area: (key: RangeKey): TableSpec => { const t = trendSpec(key); return { caption: "Verificaciones por día · ejemplo", head: ["Fecha", "Periodo actual", "Periodo anterior"], rows: t.cur.map((p, i) => [p.long, N(p.v), N(t.prev[i].v)]) }; },
  bars: (): TableSpec => ({ caption: "Registros por semana · ejemplo", head: ["Semana", "Registros"], rows: bars.data.map((d) => [d.long ?? d.label, N(d.v)]) }),
  ocr: (): TableSpec => ({ caption: "Confianza del OCR por campo · ejemplo", head: ["Campo", "Confianza"], rows: ocr.rows.map((r) => [r.label, `${nf1.format(r.v)}%`]) }),
  stack: (): TableSpec => ({ caption: "Verificaciones por dispositivo · ejemplo", head: ["Dispositivo", "Exitosas", "Reintentos", "Rechazadas", "Total"], rows: stack.rows.map((r) => [r.label, N(r.vals.ok), N(r.vals.retry), N(r.vals.rej), N(r.vals.ok + r.vals.retry + r.vals.rej)]) }),
  donut: (): TableSpec => { const t = sum(donut.segs.map((s) => s.v)); return { caption: "Verificaciones por método · ejemplo", head: ["Método", "Verificaciones", "% del total"], rows: donut.segs.map((s) => [s.label, N(s.v), `${nf1.format((s.v / t) * 100)}%`]) }; },
  bullet: (): TableSpec => ({ caption: "Participación por mesa · meta 80% · ejemplo", head: ["Mesa", "Participación", "Meta cumplida"], rows: bullet.rows.map((r) => [r.label, `${r.v}%`, r.v >= 80 ? "Sí" : "No"]) }),
  heat: (): TableSpec => ({ caption: "Accesos por día y franja horaria · ejemplo", head: ["Día", ...heat.cols.map((c) => c.long)], rows: heat.rows.map((r) => [r.label, ...r.v.map(N)]) }),
  funnel: (): TableSpec => ({ caption: "Embudo de verificación · ejemplo", head: ["Paso", "Personas", "% del anterior"], rows: funnel.rows.map((r, i) => [r.label, N(r.v), i ? `${nf1.format((r.v / funnel.rows[i - 1].v) * 100)}%` : "100%"]) }),
  hist: (): TableSpec => ({ caption: "Puntajes de similitud por intervalo · umbral 0.68 · ejemplo", head: ["Intervalo", "Verificaciones", "Decisión"], rows: hist.bins.map((b) => [`${nf2.format(b.from)}–${nf2.format(b.to)}`, N(b.n), b.from >= 0.68 - 1e-9 ? "Aceptada" : "Rechazada"]) }),
  breakdown: (): TableSpec => ({ caption: "Eventos de auditoría · ejemplo", head: ["Evento", "Total", "Variación"], rows: breakdown.tabs[0].rows.map((r) => [r.label, N(r.n), `${sgn(r.d)}%`]) }),
};

/* ---------- Modelos JSON mostrados en la documentación (versión resumida) ---------- */
function trunc(o: unknown): unknown {
  if (Array.isArray(o)) return o.length > 4 ? [...o.slice(0, 3).map(trunc), `… ${o.length - 3} más`] : o.map(trunc);
  if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, trunc(v)]));
  return o;
}
const t30 = trendSpec("30");
const pts = (a: { t: string; v: number }[]) => a.map((p) => ({ t: p.t, v: p.v }));
export const MODELS: Record<string, unknown> = {
  "mod-area": { metric: "verifications", unit: "count", granularity: "day", period: { from: t30.cur[0].t, to: t30.cur[29].t }, series: [{ id: "current", name: "Periodo actual", points: pts(t30.cur) }, { id: "previous", name: "Periodo anterior", points: pts(t30.prev) }], updatedAt: "2026-10-01T23:59:00-05:00" },
  "mod-bars": { metric: "registrations", unit: "count", granularity: "week", points: bars.data.map((d) => ({ t: d.label, v: d.v })) },
  "mod-ocr": { metric: "ocr_confidence", unit: "percent", max: 100, rows: ocr.rows },
  "mod-stack": { metric: "verifications_by_device", series: stack.series.map((s) => ({ id: s.id, name: s.name })), rows: stack.rows },
  "mod-donut": { metric: "verifications_by_method", unit: "count", segments: donut.segs.map((s) => ({ id: s.label.toLowerCase(), label: s.label, v: s.v })) },
  "mod-bullet": { metric: "turnout", unit: "percent", goal: 80, rows: bullet.rows },
  "mod-kpi": { metric: "verifications_today", value: 1284, display: "1,284", compare: { vs: "yesterday", change: 4.2, unit: "percent", tone: "good" }, spark: kpis[0].vals },
  "mod-heat": { metric: "accesses", unit: "count", cols: heat.cols.map((c) => c.long), rows: heat.rows },
  "mod-funnel": { metric: "verification_funnel", steps: funnel.rows },
  "mod-hist": { metric: "similarity_score", threshold: hist.threshold, binWidth: 0.04, bins: hist.bins },
  "mod-bd": { metric: "audit_events", tabs: breakdown.tabs.map((t) => ({ name: t.name, rows: t.rows.map((r) => ({ id: r.label, total: r.n, change: r.d, tone: r.tone || "auto" })) })) },
};
export const modelJson = (id: string) => JSON.stringify(trunc(MODELS[id]), null, 2);
