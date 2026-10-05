import { attr, imp } from "./helpers.mjs";
const C = "@/components/charts/chart-demos";
const S = "@/components/charts/server-bits";
const card = (name) => ({ jsx: `<${name} />`, imports: imp([name], C) });
const model = (id) => ({ jsx: `<ModelPre id="${id}" />`, imports: imp(["ModelPre"], S) });

export default {
  name: "GraficosContent",
  replace: {
    "m-area": card("AreaCard"), "m-bars": card("BarsCard"), "m-bars-flat": card("BarsFlatCard"), "m-ocr": card("OcrCard"), "m-stack": card("StackCard"),
    "m-donut": card("DonutCard"), "m-bullet": card("BulletCard"), "m-funnel": card("FunnelCard"), "m-hist": card("HistCard"), "m-bd": card("BreakdownCard"),
    "m-heat": { jsx: '<div style={{ marginTop: "1.6rem" }}><HeatCard /></div>', imports: imp(["HeatCard"], C) },
    "m-kpis": card("KpiGrid"),
    "m-state-loading": { jsx: '<StateCard kind="loading" />', imports: imp(["StateCard"], C) },
    "m-state-empty": { jsx: '<StateCard kind="empty" />', imports: imp(["StateCard"], C) },
    "m-state-error": { jsx: '<StateCard kind="error" />', imports: imp(["StateCard"], C) },
    ...Object.fromEntries(["area", "bars", "ocr", "stack", "donut", "bullet", "kpi", "heat", "funnel", "hist", "bd"].map((k) => [`mod-${k}`, model(`mod-${k}`)])),
  },
  matchers: [
    (n) => (n.tagName && attr(n, "data-contrast") ? { jsx: `<ContrastOnWhite hex="${attr(n, "data-contrast")}" />`, imports: imp(["ContrastOnWhite"], S) } : null),
  ],
};
