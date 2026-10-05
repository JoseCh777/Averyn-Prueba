import { attr, hasClass, imp, withClass } from "./helpers.mjs";
const T = "@/components/templates/frames";
const D = "@/components/docs/template-demos";

const STANDARD = [["normal", "Normal"], ["empty", "Vacío"], ["loading", "Cargando"], ["error", "Error"]];
const states = (spec) => (!spec ? [] : spec === "1" ? STANDARD : spec.split(",").map((x) => x.split(":")));

export default {
  name: "PlantillasContent",
  replace: {
    drop: { jsx: "<DropzoneDemo />", imports: imp(["DropzoneDemo"], D) },
  },
  matchers: [
    (n) => {
      if (!n.tagName || !hasClass(n, "tpf")) return null;
      const spec = attr(n, "data-states");
      return { jsx: `<TemplateFrame template="${attr(n, "data-t")}" title=${JSON.stringify(attr(n, "data-title"))} states={${JSON.stringify(states(spec))}} />`, imports: imp(["TemplateFrame"], T) };
    },
    (n) => (n.tagName && hasClass(n, "dsframe") && attr(n, "data-src")
      ? { jsx: `<PageFrame src="${attr(n, "data-src").replace(/^.*\/(403|404|500|offline|mantenimiento)\.html$/, "/errores/$1")}" title=${JSON.stringify(attr(n, "data-title"))} />`, imports: imp(["PageFrame"], T) } : null),
    (n) => (n.tagName && hasClass(n, "hz-banner") ? { tag: "DismissibleBanner", imports: imp(["DismissibleBanner"], D) } : null),
    withClass("stage", "open-session", '<div className="stage"><SessionModalDemo /></div>', ["SessionModalDemo"], D),
    (n) => (n.tagName === "dialog" && attr(n, "id") === "modal-session" ? { jsx: "{null}" } : null),
  ],
};
