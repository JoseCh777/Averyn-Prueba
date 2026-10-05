import { hasClass, imp } from "./helpers.mjs";
const F = "@/components/docs/foundation-demos";
const T = "@/components/docs/tokens-export";
const swatch = (g) => ({ jsx: `<ColorSwatches group="${g}" />`, imports: imp(["ColorSwatches"], F) });

export default {
  name: "FundamentosContent",
  replace: {
    "sw-brand": swatch("brand"),
    "sw-horizon": swatch("horizon"),
    "sw-neutral": swatch("neutral"),
    "sw-semantic": swatch("semantic"),
    "space-scale": { jsx: "<SpaceScale />", imports: imp(["SpaceScale"], F) },
    radii: { jsx: "<RadiiGrid />", imports: imp(["RadiiGrid"], F) },
    "icon-grid": { jsx: "<IconGrid />", imports: imp(["IconGrid"], F) },
    "tokens-data": { jsx: "{null}" },
    "tk-sw": { jsx: "<TokenSwatches />", imports: imp(["TokenSwatches"], T) },
  },
  matchers: [
    (n) => (n.tagName && hasClass(n, "doc-wrap") && n.childNodes.some((c) => c.attrs?.some((a) => a.name === "id" && a.value === "contrast-table")) ? { jsx: "<ContrastTable />", imports: imp(["ContrastTable"], F) } : null),
    (n) => (n.tagName && hasClass(n, "tk-grid") ? { jsx: "<TokensExport />", imports: imp(["TokensExport"], T) } : null),
  ],
};
