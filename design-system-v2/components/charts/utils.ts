/* Utilidades de la biblioteca de gráficos Horizonte (formato es-PE, escalas y curvas). Datos de ejemplo deterministas. */
export const nf0 = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });
export const nf1 = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
export const nf2 = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
export const N = (n: number) => nf0.format(n);

export const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
export const pct = (a: number, b: number) => (a / b - 1) * 100;
export const sgn = (n: number, f: Intl.NumberFormat = nf1) => (n > 0 ? "+" : n < 0 ? "−" : "") + f.format(Math.abs(n));

/** Marcas «redondas» del eje (1, 2, 2.5, 5, 10 × 10ⁿ), unas 4 en total. */
export function niceTicks(max: number): number[] {
  const raw = max / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  let step = mag;
  [1, 2, 2.5, 5, 10].some((m) => { step = m * mag; return step >= raw; });
  const top = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) out.push(v);
  return out;
}

/** Curva monótona (Fritsch–Carlson): suave y sin sobrepasar los datos. */
export function curve(p: [number, number][]): string {
  const n = p.length;
  if (n < 2) return "";
  const dx: number[] = [], m: number[] = [], t: number[] = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
  }
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    d += ` C${(p[i][0] + dx[i] / 3).toFixed(1)} ${(p[i][1] + (t[i] * dx[i]) / 3).toFixed(1)} ${(p[i + 1][0] - dx[i] / 3).toFixed(1)} ${(p[i + 1][1] - (t[i + 1] * dx[i]) / 3).toFixed(1)} ${p[i + 1][0].toFixed(1)} ${p[i + 1][1].toFixed(1)}`;
  }
  return d;
}

/* ---------- Datos deterministas ---------- */
export const rng = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
export const END = Date.UTC(2026, 9, 1);
const fShort = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", timeZone: "UTC" });
const fLong = new Intl.DateTimeFormat("es-PE", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
export const shortDate = (t: number) => fShort.format(t).replace(".", "");
export const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

export type Point = { t: string; label: string; long: string; v: number };
export function trend(n: number, seed: number, base: number, shift = 0): Point[] {
  const r = rng(seed);
  const out: Point[] = [];
  for (let i = 0; i < n; i++) {
    const t = END - (n - 1 - i + shift) * 864e5;
    const dow = new Date(t).getUTCDay();
    const v = Math.round(base * (1 + i * 0.0035) * (dow === 0 || dow === 6 ? 0.86 : 1) * (0.94 + r() * 0.12));
    out.push({ t: iso(t), label: shortDate(t), long: fLong.format(t).replace(/\./g, ""), v });
  }
  return out;
}

export type RangeKey = "7" | "30" | "90";
export const RANGES: Record<RangeKey, number> = { "7": 7, "30": 30, "90": 90 };
export function trendSpec(key: RangeKey) {
  const n = RANGES[key];
  const cur = trend(n, 11, 360);
  const prev = trend(n, 29, 335, n).map((p, i) => ({ ...p, label: cur[i].label, long: cur[i].long }));
  return { n, cur, prev };
}

export type TableSpec = { caption: string; head: string[]; rows: string[][] };
export const csvOf = (t: TableSpec) => {
  const q = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  return [t.head, ...t.rows].map((r) => r.map(q).join(",")).join("\n");
};
