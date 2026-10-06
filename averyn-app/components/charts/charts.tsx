"use client";
/* Biblioteca de gráficos Horizonte en React: SVG/HTML puro, sin dependencias. Todos comparten tooltip, navegación con flechas,
   vista en tabla (ChartCard) y estados. Datos de ejemplo. Migrado de charts.js (v1.7). */
import { useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { useToast } from "@/components/ui/overlay";
import { cn } from "@/lib/utils";
import { useInspector, type InspectItem } from "./inspector";
import { N, curve, nf1, nf2, niceTicks, pct, sgn, sum, type Point } from "./utils";

const cv = (c: string): CSSProperties => ({ ["--c" as string]: c });

/* ---------- Área / línea suave (tendencia) ---------- */
export type AreaSeries = { name: string; color: string; dash?: boolean; points: Point[] };

export function AreaChart({ label, width, height = 240, series }: { label: string; width: number; height?: number; series: AreaSeries[] }) {
  const gid = useId();
  const W = Math.max(260, width), Ht = height;
  const m = { l: 42, r: 14, t: 10, b: 28 }, pw = W - m.l - m.r, ph = Ht - m.t - m.b;
  const all = series.flatMap((s) => s.points.map((p) => p.v));
  const ticks = niceTicks(Math.max(...all)), top = ticks[ticks.length - 1];
  const n = series[0]!.points.length;
  const X = (i: number) => m.l + (n === 1 ? pw / 2 : (i * pw) / (n - 1));
  const Y = (v: number) => m.t + ph - (v / top!) * ph;
  const svgRef = useRef<SVGSVGElement>(null);
  const step = Math.max(1, Math.ceil(n / Math.floor(pw / 74)));

  const at = (i: number) => { const r = svgRef.current!.getBoundingClientRect(), k = r.width / W; return { x: r.left + X(i) * k, y: r.top + Y(series[0]!.points[i]!.v) * k }; };
  const items: InspectItem[] = series[0]!.points.map((p, i) => ({
    title: p.long || p.label,
    rows: series.map((s) => ({ k: s.name, v: N(s.points[i]!.v), c: s.color })),
    say: `${p.long || p.label}: ${series.map((s) => `${s.name} ${N(s.points[i]!.v)}`).join(", ")}`,
    at: () => at(i),
  }));
  const ins = useInspector(items, label);
  const move = (e: PointerEvent) => { const r = svgRef.current!.getBoundingClientRect(), x = (e.clientX - r.left) * (W / r.width); ins.go(Math.max(0, Math.min(n - 1, Math.round(((x - m.l) / pw) * (n - 1))))); };
  const last = series[0]!.points[n - 1];
  const a = ins.active;

  return (
    <>
      {series.length > 1 && <ul className="vz-legend">{series.map((s) => <li key={s.name}><i className={cn("is-line", s.dash && "is-dash")} style={cv(s.color)} />{s.name}</li>)}</ul>}
      <div className="vz" {...ins.host}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${Ht}`} width={W} height={Ht} aria-hidden="true" onPointerMove={move} onPointerDown={move} onPointerLeave={ins.off}>
          <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={series[0]!.color} stopOpacity={0.22} /><stop offset="100%" stopColor={series[0]!.color} stopOpacity={0} /></linearGradient></defs>
          {ticks.map((v, k) => (
            <g key={v}>
              <g className={k === 0 ? "vz-base" : "vz-grid"}><line x1={m.l} x2={W - m.r} y1={Y(v)} y2={Y(v)} /></g>
              <text x={m.l - 10} y={Y(v) + 4} textAnchor="end" className="vz-tick">{N(v)}</text>
            </g>
          ))}
          {series[0]!.points.map((p, i) => ((n - 1 - i) % step ? null : <text key={p.t} x={X(i)} y={Ht - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="vz-tick">{p.label}</text>))}
          {[...series].reverse().map((s) => {
            const pts = s.points.map((p, i): [number, number] => [X(i), Y(p.v)]);
            const d = curve(pts);
            return (
              <g key={s.name}>
                {s === series[0] && <path d={`${d} L${X(n - 1)} ${Y(0)} L${X(0)} ${Y(0)} Z`} fill={`url(#${gid})`} />}
                <path d={d} className={cn("vz-line", s.dash && "vz-line--ref")} stroke={s.color} />
              </g>
            );
          })}
          <circle cx={X(n - 1)} cy={Y(last!.v)} r={4} fill={series[0]!.color} className="vz-dot" />
          <g visibility={a >= 0 ? "visible" : "hidden"}>
            <line className="vz-cross" y1={m.t} y2={m.t + ph} x1={a >= 0 ? X(a) : 0} x2={a >= 0 ? X(a) : 0} />
            {series.map((s) => <circle key={s.name} r={4.5} fill={s.color} className="vz-dot" cx={a >= 0 ? X(a) : 0} cy={a >= 0 ? Y(s.points[a]!.v) : 0} />)}
          </g>
        </svg>
      </div>
    </>
  );
}

/* ---------- Barras verticales (píldora suave o recta) ---------- */
export type BarDatum = { label: string; long?: string; v: number };

export function BarChart({ label, name, width, height = 240, data, pill = true, color }: { label: string; name: string; width: number; height?: number; data: BarDatum[]; pill?: boolean; color?: string }) {
  const gid = useId();
  const W = Math.max(260, width), Ht = height;
  const m = { l: 42, r: 10, t: 26, b: 28 }, pw = W - m.l - m.r, ph = Ht - m.t - m.b, n = data.length;
  const ticks = niceTicks(Math.max(...data.map((d) => d.v))), top = ticks[ticks.length - 1];
  const band = pw / n, bw = Math.min(32, band * 0.62);
  const Y = (v: number) => m.t + ph - (v / top!) * ph;
  const svgRef = useRef<SVGSVGElement>(null);
  const maxI = data.reduce((mi, d, i) => (d.v > data[mi]!.v ? i : mi), 0);

  const items: InspectItem[] = data.map((d, i) => {
    const rows: { k: string; v: string; c?: string }[] = [{ k: name, v: N(d.v), c: "var(--viz-1)" }];
    if (i) rows.push({ k: "vs anterior", v: `${sgn(pct(d.v, data[i - 1]!.v))}%` });
    return { title: d.long || d.label, rows, say: `${d.long || d.label}: ${N(d.v)}`, at: () => { const r = svgRef.current!.getBoundingClientRect(), k = r.width / W; return { x: r.left + (m.l + band * i + band / 2) * k, y: r.top + Y(d.v) * k }; } };
  });
  const ins = useInspector(items, label);
  const move = (e: PointerEvent) => { const r = svgRef.current!.getBoundingClientRect(), x = (e.clientX - r.left) * (W / r.width), i = Math.floor((x - m.l) / band); if (i >= 0 && i < n) ins.go(i); else ins.off(); };

  return (
    <div className={cn("vz", ins.active >= 0 && "is-hover")} {...ins.host}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${Ht}`} width={W} height={Ht} aria-hidden="true" onPointerMove={move} onPointerLeave={ins.off}>
        <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color || "var(--viz-1)"} /><stop offset="100%" stopColor="var(--viz-seq-2)" /></linearGradient></defs>
        {ticks.map((v, k) => (
          <g key={v}>
            <g className={k === 0 ? "vz-base" : "vz-grid"}><line x1={m.l} x2={W - m.r} y1={Y(v)} y2={Y(v)} /></g>
            <text x={m.l - 10} y={Y(v) + 4} textAnchor="end" className="vz-tick">{N(v)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = m.l + band * i + band / 2, x = cx - bw / 2, y = Y(d.v), h = Y(0) - y;
          const cls = cn("vz-bar", ins.active === i && "is-on");
          const r = Math.min(4, h);
          return (
            <g key={d.label}>
              {pill
                ? <rect x={x} y={y} width={bw} height={Math.max(h, 2)} rx={Math.min(bw / 2, h / 2)} fill={`url(#${gid})`} className={cls} />
                : <path d={`M${x} ${Y(0)}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + bw - r}Q${x + bw} ${y} ${x + bw} ${y + r}V${Y(0)}Z`} fill={`url(#${gid})`} className={cls} />}
              <text x={cx} y={Ht - 6} textAnchor="middle" className="vz-tick">{d.label}</text>
            </g>
          );
        })}
        <text x={m.l + band * maxI + band / 2} y={Y(data[maxI]!.v) - 8} textAnchor="middle" className="vz-label">{N(data[maxI]!.v)}</text>
      </svg>
    </div>
  );
}

/* ---------- Barras horizontales: ranking ---------- */
export function HBars({ rows, max, fmt }: { rows: { label: string; v: number }[]; max?: number; fmt: (v: number) => string }) {
  const mx = max ?? Math.max(...rows.map((r) => r.v));
  return (
    <ul className="hb">
      {rows.map((r, i) => (
        <li key={r.label} className="hb__row">
          <span className="hb__name">{r.label}</span>
          <span className="hb__track" role="img" aria-label={`${r.label}: ${fmt(r.v)}`}><span className="hb__fill" style={{ width: `${(r.v / mx) * 100}%`, animationDelay: `${i * 60}ms` }} /></span>
          <span className="hb__val">{fmt(r.v)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Barras apiladas ---------- */
export type StackSeries = { id: string; name: string; color: string; icon?: IconName };
export type StackRow = { label: string; vals: Record<string, number> };

export function StackedBars({ label, series, rows }: { label: string; series: StackSeries[]; rows: StackRow[] }) {
  const tot = (r: StackRow) => sum(series.map((s) => r.vals[s.id] ?? 0));
  const max = Math.max(...rows.map(tot));
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  const flat: { r: StackRow; s: StackSeries; v: number }[] = [];
  rows.forEach((r) => series.forEach((s) => { if (r.vals[s.id]) flat.push({ r, s, v: r.vals[s.id]! }); }));
  const items: InspectItem[] = flat.map(({ r, s, v }, k) => ({
    title: r.label,
    rows: [{ k: s.name, v: `${N(v)} (${nf1.format((v / tot(r)) * 100)}%)`, c: s.color }, { k: "Total", v: N(tot(r)) }],
    say: `${r.label}, ${s.name}: ${N(v)} de ${N(tot(r))}`,
    at: () => { const b = els.current[k]!.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top }; },
  }));
  const ins = useInspector(items, label);
  let k = -1;
  return (
    <>
      <ul className="vz-legend">{series.map((s) => <li key={s.id}>{s.icon ? <Icon name={s.icon} style={cv(s.color)} /> : <i style={cv(s.color)} />}{s.name}</li>)}</ul>
      <div {...ins.host}>
        <ul className={cn("sb", ins.active >= 0 && "is-hover")}>
          {rows.map((r) => (
            <li key={r.label} className="sb__row">
              <span className="sb__name">{r.label}</span>
              <span className="sb__bar" style={{ width: `${(tot(r) / max) * 100}%` }}>
                {series.map((s) => {
                  const v = r.vals[s.id]; if (!v) return null;
                  const idx = ++k;
                  return <span key={s.id} ref={(el) => { els.current[idx] = el; }} className={cn("sb__seg", ins.active === idx && "is-on")} style={{ ...cv(s.color), flex: `${v} 1 0` }} onPointerEnter={() => ins.go(idx)} onPointerLeave={ins.off} />;
                })}
              </span>
              <span className="sb__total">{N(tot(r))}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ---------- Anillo ---------- */
export function Donut({ label, name, unit, segs }: { label: string; name: string; unit: string; segs: { label: string; v: number; color: string }[] }) {
  const R = 78, T = 22, C = 100, tot = sum(segs.map((s) => s.v)), gap = 2 / R;
  const arcs = useRef<(SVGPathElement | null)[]>([]);
  let a0 = -Math.PI / 2;
  const geo = segs.map((s) => {
    const ang = (s.v / tot) * Math.PI * 2, x0 = a0 + gap / 2, x1 = a0 + ang - gap / 2, large = x1 - x0 > Math.PI ? 1 : 0;
    const p = (a: number) => `${(C + R * Math.cos(a)).toFixed(2)} ${(C + R * Math.sin(a)).toFixed(2)}`;
    const d = `M${p(x0)} A${R} ${R} 0 ${large} 1 ${p(x1)}`;
    a0 += ang;
    return d;
  });
  const items: InspectItem[] = segs.map((s, i) => ({
    title: name, rows: [{ k: s.label, v: `${N(s.v)} (${nf1.format((s.v / tot) * 100)}%)`, c: s.color }],
    say: `${s.label}: ${N(s.v)}, ${nf1.format((s.v / tot) * 100)}%`,
    at: () => { const b = arcs.current[i]!.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height * 0.15 }; },
  }));
  const ins = useInspector(items, label);
  return (
    <div className={cn("dn", ins.active >= 0 && "is-hover")}>
      <div className="dn__svg" {...ins.host}>
        <svg viewBox="0 0 200 200" aria-hidden="true">
          {geo.map((d, i) => <path key={segs[i]!.label} ref={(el) => { arcs.current[i] = el; }} d={d} fill="none" stroke={segs[i]!.color} strokeWidth={T} className={cn("dn__arc", ins.active === i && "is-on")} onPointerEnter={() => ins.go(i)} onPointerLeave={ins.off} />)}
        </svg>
        <div className="dn__center"><b>{N(tot)}</b><span>{unit}</span></div>
      </div>
      <ul className="dn__legend">
        {segs.map((s, i) => (
          <li key={s.label} onPointerEnter={() => ins.go(i)} onPointerLeave={ins.off}>
            <i style={{ background: s.color }} /><span>{s.label}</span><b>{N(s.v)}</b><em>{nf1.format((s.v / tot) * 100)}%</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Bullet: valor vs meta ---------- */
export function Bullet({ name, goal, rows }: { name: string; goal: number; rows: { label: string; v: number }[] }) {
  return (
    <>
      <ul className="vz-legend">
        <li><i style={cv("var(--viz-1)")} />{name}</li>
        <li><i style={{ width: 2, height: 14, borderRadius: 0, background: "var(--viz-ink)" }} />Meta {goal}%</li>
      </ul>
      <ul className="bl">
        {rows.map((r, i) => (
          <li key={r.label} className="bl__row">
            <span className="hb__name">{r.label}</span>
            <span className="bl__track" role="img" aria-label={`${r.label}: ${r.v}% de una meta de ${goal}%, ${r.v >= goal ? "cumplida" : "por debajo"}`}>
              <span className="bl__fill" style={{ width: `${r.v}%`, animationDelay: `${i * 60}ms` }} />
              <span className="bl__goal" style={{ left: `calc(${goal}% - 1px)` }} />
            </span>
            <span className="hb__val">{r.v}%</span>
          </li>
        ))}
      </ul>
      <div className="bl__axis"><span>0%</span><span>50%</span><span>100%</span></div>
    </>
  );
}

/* ---------- Sparkline (sin ejes: el valor está en el texto de la tarjeta) ---------- */
export function Sparkline({ vals, color, width }: { vals: number[]; color: string; width: number }) {
  const gid = useId();
  const W = Math.max(120, width), Ht = 52, pad = 6;
  const mn = Math.min(...vals), mx = Math.max(...vals), rg = mx - mn || 1;
  const X = (i: number) => pad + (i * (W - pad * 2)) / (vals.length - 1), Y = (v: number) => Ht - pad - ((v - mn) / rg) * (Ht - pad * 2);
  const pts = vals.map((v, i): [number, number] => [X(i), Y(v)]), d = curve(pts);
  return (
    <svg viewBox={`0 0 ${W} ${Ht}`} width={W} height={Ht} aria-hidden="true">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.2} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      <path d={`${d} L${X(vals.length - 1)} ${Ht} L${X(0)} ${Ht} Z`} fill={`url(#${gid})`} />
      <path d={d} className="vz-line" stroke={color} />
      <circle cx={pts[pts.length - 1]![0]} cy={pts[pts.length - 1]![1]} r={4} fill={color} className="vz-dot" />
    </svg>
  );
}

/* ---------- Mapa de calor ---------- */
export function Heatmap({ label, name, cols, rows }: { label: string; name: string; cols: { short: string; long: string }[]; rows: { label: string; v: number[] }[] }) {
  const max = Math.max(...rows.flatMap((r) => r.v));
  const cells = useRef<(HTMLSpanElement | null)[]>([]);
  const items: InspectItem[] = rows.flatMap((r, ri) => r.v.map((v, j) => {
    const lab = `${r.label}, ${cols[j]!.long}`;
    const idx = ri * cols.length + j;
    return { title: lab, rows: [{ k: name, v: N(v) }], say: `${lab}: ${N(v)}`, at: () => { const b = cells.current[idx]!.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top }; } };
  }));
  const ins = useInspector(items, label, { cols: cols.length });
  return (
    <>
      <div className={cn("hm", ins.active >= 0 && "is-hover")} {...ins.host}>
        <span className="hm__h" />
        {cols.map((c, i) => <span key={c.long} className="hm__h hm__h--top">{i % 2 === 0 ? c.short : ""}</span>)}
        {rows.map((r, ri) => [
          <span key={`h${r.label}`} className="hm__h">{r.label.slice(0, 3)}</span>,
          ...r.v.map((v, j) => {
            const idx = ri * cols.length + j, k = Math.min(5, Math.floor((v / max) * 6));
            return <span key={`${r.label}${j}`} ref={(el) => { cells.current[idx] = el; }} className={cn("hm__c", ins.active === idx && "is-on")} style={cv(`var(--viz-seq-${k + 1})`)} onPointerEnter={() => ins.go(idx)} onPointerLeave={ins.off} />;
          }),
        ])}
      </div>
      <div className="hm-scale"><span>Menos</span><span className="hm-scale__ramp">{[1, 2, 3, 4, 5, 6].map((k) => <i key={k} style={{ background: `var(--viz-seq-${k})` }} />)}</span><span>Más</span></div>
    </>
  );
}

/* ---------- Embudo ---------- */
export function Funnel({ rows }: { rows: { label: string; v: number }[] }) {
  const first = rows[0]!.v;
  return (
    <ul className="fn">
      {rows.map((r, i) => (
        <li key={r.label} className="fn__row">
          <span className="hb__name">{r.label}</span>
          <span className="fn__bar" role="img" aria-label={`${r.label}: ${N(r.v)}`}><span style={{ width: `${(r.v / first) * 100}%`, animationDelay: `${i * 70}ms` }} /></span>
          <span className="fn__v">{N(r.v)}<small>{i ? `${nf1.format((r.v / rows[i - 1]!.v) * 100)}% del anterior` : "punto de partida"}</small></span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Histograma con umbral ---------- */
export function Histogram({ label, width, height = 260, threshold, bins }: { label: string; width: number; height?: number; threshold: number; bins: { from: number; to: number; n: number }[] }) {
  const W = Math.max(280, width), Ht = height, m = { l: 42, r: 10, t: 26, b: 44 }, pw = W - m.l - m.r, ph = Ht - m.t - m.b, n = bins.length;
  const ticks = niceTicks(Math.max(...bins.map((b) => b.n))), top = ticks[ticks.length - 1];
  const Y = (v: number) => m.t + ph - (v / top!) * ph, XS = (s: number) => m.l + s * pw, bw = pw / n;
  const svgRef = useRef<SVGSVGElement>(null);
  const items: InspectItem[] = bins.map((b, i) => {
    const ok = b.from >= threshold - 1e-9, lab = `${nf2.format(b.from)}–${nf2.format(b.to)}`;
    return { title: `Similitud ${lab}`, rows: [{ k: ok ? "Aceptadas" : "Rechazadas", v: N(b.n), c: ok ? "var(--viz-ok)" : "var(--viz-bad)" }], say: `Similitud ${lab}: ${N(b.n)}${ok ? " aceptadas" : " rechazadas"}`,
      at: () => { const r = svgRef.current!.getBoundingClientRect(), k = r.width / W; return { x: r.left + (m.l + bw * i + bw / 2) * k, y: r.top + Y(b.n) * k }; } };
  });
  const ins = useInspector(items, label);
  const move = (e: PointerEvent) => { const r = svgRef.current!.getBoundingClientRect(), x = (e.clientX - r.left) * (W / r.width), i = Math.floor((x - m.l) / bw); if (i >= 0 && i < n) ins.go(i); else ins.off(); };
  const tx = XS(threshold);
  return (
    <>
      <ul className="vz-legend">
        <li><Icon name="x-circle" style={cv("var(--viz-bad)")} />Rechazadas (&lt; umbral)</li>
        <li><Icon name="check-circle" style={cv("var(--viz-ok)")} />Aceptadas (≥ umbral)</li>
        <li><i className="is-line is-dash" style={cv("var(--viz-ink)")} />Umbral {nf2.format(threshold)}</li>
      </ul>
      <div className={cn("vz", ins.active >= 0 && "is-hover")} {...ins.host}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${Ht}`} width={W} height={Ht} aria-hidden="true" onPointerMove={move} onPointerLeave={ins.off}>
          {ticks.map((v, k) => (
            <g key={v}>
              <g className={k === 0 ? "vz-base" : "vz-grid"}><line x1={m.l} x2={W - m.r} y1={Y(v)} y2={Y(v)} /></g>
              <text x={m.l - 10} y={Y(v) + 4} textAnchor="end" className="vz-tick">{N(v)}</text>
            </g>
          ))}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => <text key={v} x={XS(v)} y={Ht - 24} textAnchor={v === 0 ? "start" : v === 1 ? "end" : "middle"} className="vz-tick">{nf1.format(v)}</text>)}
          {bins.map((b, i) => {
            const ok = b.from >= threshold - 1e-9, x = m.l + bw * i + 1, w = bw - 2, y = Y(b.n), h = Y(0) - y, r = Math.min(3, h);
            return <path key={b.from} d={`M${x} ${Y(0)}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${Y(0)}Z`} fill={ok ? "var(--viz-ok)" : "var(--viz-bad)"} className={cn("vz-bar", ins.active === i && "is-on")} />;
          })}
          <line x1={tx} x2={tx} y1={m.t - 8} y2={m.t + ph} className="vz-thr" />
          <text x={tx - 8} y={14} textAnchor="end" className="vz-label">← Rechazadas</text>
          <text x={tx + 8} y={14} textAnchor="start" className="vz-label">Aceptadas →</text>
          <text x={m.l + pw / 2} y={Ht - 4} textAnchor="middle" className="vz-tick">Puntaje de similitud (0–1)</text>
        </svg>
      </div>
    </>
  );
}

/* ---------- Tabla «breakdown» con pestañas ---------- */
export type BreakdownTab = { name: string; col: string; totalD: number; totalTone?: string; rows: { label: string; n: number; d: number; tone?: string }[] };

export function Breakdown({ label, tabs }: { label: string; tabs: BreakdownTab[] }) {
  const toast = useToast();
  const id = useId();
  const [k, setK] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const t = tabs[k];
  const tot = sum(t!.rows.map((r) => r.n));
  const arrow = (d: number): IconName => (d > 0 ? "arrow-up-short" : d < 0 ? "arrow-down-short" : "dash");
  return (
    <>
      <div className="bd-tabs" role="tablist" aria-label={label}>
        {tabs.map((tb, i) => (
          <button key={tb.name} ref={(el) => { btns.current[i] = el; }} id={`${id}-${i}`} type="button" role="tab" aria-selected={i === k} tabIndex={i === k ? 0 : -1} onClick={() => setK(i)}
            onKeyDown={(e) => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return; e.preventDefault(); const j = (i + d + tabs.length) % tabs.length; setK(j); btns.current[j]?.focus(); }}>
            {tb.name}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-labelledby={`${id}-${k}`}>
        <table className="bd">
          <thead><tr><th scope="col">{t!.col}</th><th scope="col" className="num">Total</th><th scope="col" className="num">Variación</th></tr></thead>
          <tbody>
            {t!.rows.map((r) => {
              const tone = r.tone || (r.d > 0 ? "good" : r.d < 0 ? "bad" : "flat");
              return (
                <tr key={r.label}>
                  <td className="bd__ev">{r.label}</td>
                  <td className="num"><button type="button" className="bd__n" aria-label={`${N(r.n)} ${r.label}, abrir en la bitácora`} onClick={() => toast({ title: "Bitácora", text: `Se abriría la bitácora filtrada por ${r.label}.`, kind: "ok" })}>{N(r.n)}</button></td>
                  <td className="num"><span className={`bd__d bd__d--${tone}`}><Icon name={arrow(r.d)} />{sgn(r.d)}%</span></td>
                </tr>
              );
            })}
          </tbody>
          <tfoot><tr><td>Total</td><td className="num">{N(tot)}</td><td className="num"><span className={`bd__d bd__d--${t!.totalTone || "good"}`}><Icon name="arrow-up-short" />{sgn(t!.totalD)}%</span></td></tr></tfoot>
        </table>
      </div>
    </>
  );
}

/* ---------- Ficha KPI con sparkline ---------- */
export type Delta = { dir: "up" | "down" | "flat"; tone: string; text: string };
export function DeltaBadge({ d }: { d: Delta }) {
  return <span className={`cc__delta cc__delta--${d.tone}`}><Icon name={d.dir === "up" ? "arrow-up-short" : d.dir === "down" ? "arrow-down-short" : "dash"} />{d.text}</span>;
}
