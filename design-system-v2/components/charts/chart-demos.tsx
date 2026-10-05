"use client";
/* Montaje de las tarjetas de ejemplo de la página «Gráficos» (antes: charts.js). */
import { useToast } from "@/components/ui/overlay";
import { AreaChart, BarChart, Breakdown, Bullet, Donut, Funnel, HBars, Heatmap, Histogram, StackedBars, type Delta } from "./charts";
import { ChartCard, ChartStateCard, KpiTile, SampleFoot } from "./card";
import * as D from "./data";
import { N, nf1, pct, sgn, sum, trendSpec, type RangeKey } from "./utils";

const days: Record<string, string> = { "7": "7 días", "30": "30 días", "90": "90 días" };

function LinkLike({ children }: { children: string }) {
  const toast = useToast();
  return <button type="button" className="linklike" onClick={() => toast({ title: "Bitácora", text: "Aquí se abriría la bitácora de auditoría.", kind: "ok" })}>{children}</button>;
}

export function AreaCard() {
  return (
    <ChartCard id="verificaciones" label="Verificaciones" wide showValue range={{ def: "30", keys: [{ key: "7", label: "7 d" }, { key: "30", label: "30 d" }, { key: "90", label: "90 d" }] }}
      meta={(k) => { const t = trendSpec(k as RangeKey), d = pct(sum(t.cur.map((p) => p.v)), sum(t.prev.map((p) => p.v))); const delta: Delta = { dir: d >= 0 ? "up" : "down", tone: d >= 0 ? "good" : "bad", text: `${sgn(d)}%` }; return { value: N(sum(t.cur.map((p) => p.v))), period: `en los últimos ${days[k]} · vs periodo anterior`, delta }; }}
      foot={<SampleFoot><LinkLike>Ver detalle en la bitácora →</LinkLike></SampleFoot>}
      render={(w, k) => { const t = trendSpec(k as RangeKey); return <AreaChart label="Verificaciones por día" width={w} height={260} series={[{ name: "Periodo actual", color: "var(--viz-1)", points: t.cur }, { name: "Periodo anterior", color: "var(--viz-other)", dash: true, points: t.prev }]} />; }}
      table={(k) => D.tables.area(k as RangeKey)} />
  );
}

const barsMeta = () => ({ value: "4,691", period: "en las últimas 8 semanas", delta: { dir: "up" as const, tone: "good", text: "+8.4%" } });
export function BarsCard() {
  return <ChartCard id="registros-semana" label="Registros por semana" showValue meta={barsMeta} foot={<SampleFoot />} render={(w) => <BarChart label={D.bars.label} name={D.bars.name} width={w} data={D.bars.data} />} table={D.tables.bars} />;
}
export function BarsFlatCard() {
  return <ChartCard id="registros-semana-recta" label="Registros por semana · recta" showValue meta={barsMeta} foot={<SampleFoot />} render={(w) => <BarChart label={D.bars.label} name={D.bars.name} width={w} data={D.bars.data} pill={false} />} table={D.tables.bars} />;
}
export function OcrCard() {
  return <ChartCard id="confianza-ocr" label="Confianza del OCR por campo" foot={<SampleFoot />} render={() => <HBars rows={D.ocr.rows} max={100} fmt={(v) => `${nf1.format(v)}%`} />} table={D.tables.ocr} />;
}
export function StackCard() {
  return <ChartCard id="verificaciones-dispositivo" label="Verificaciones por dispositivo" foot={<SampleFoot />} render={() => <StackedBars label={D.stack.label} series={D.stack.series} rows={D.stack.rows} />} table={D.tables.stack} />;
}
export function DonutCard() {
  return <ChartCard id="verificaciones-metodo" label="Verificaciones por método" foot={<SampleFoot />} render={() => <Donut {...D.donut} />} table={D.tables.donut} />;
}
export function BulletCard() {
  return <ChartCard id="participacion-mesas" label="Participación por mesa" foot={<SampleFoot />} render={() => <Bullet {...D.bullet} />} table={D.tables.bullet} />;
}
export function HeatCard() {
  return <ChartCard id="accesos-hora" label="Accesos por día y hora" wide foot={<SampleFoot />} render={() => <Heatmap label={D.heat.label} name={D.heat.name} cols={D.heat.cols} rows={D.heat.rows} />} table={D.tables.heat} />;
}
export function FunnelCard() {
  return <ChartCard id="embudo-verificacion" label="Embudo de verificación" foot={<SampleFoot />} render={() => <Funnel rows={D.funnel.rows} />} table={D.tables.funnel} />;
}
export function HistCard() {
  return <ChartCard id="puntajes-similitud" label="Puntajes de similitud" foot={<SampleFoot />} render={(w) => <Histogram label={D.hist.label} width={w} threshold={D.hist.threshold} bins={D.hist.bins} />} table={D.tables.hist} />;
}
export function BreakdownCard() {
  return <ChartCard id="desglose-eventos" label="Desglose de eventos" wide foot={<SampleFoot><LinkLike>Ver toda la bitácora →</LinkLike></SampleFoot>} render={() => <Breakdown label={D.breakdown.label} tabs={D.breakdown.tabs} />} table={D.tables.breakdown} />;
}

export function KpiGrid() {
  return (
    <div className="kpi-grid">
      {D.kpis.map((k) => {
        const [a, b] = k.value.split(" / ");
        return <KpiTile key={k.id} label={k.label} value={b ? <>{a}<small>/ {b}</small></> : k.value} delta={k.delta} color={k.color} vals={k.vals} />;
      })}
    </div>
  );
}

export function StateCard({ kind }: { kind: "loading" | "empty" | "error" }) { return <ChartStateCard kind={kind} />; }
