#!/usr/bin/env node
/**
 * Convierte un cuerpo de documentación de Horizonte v1.7 (docs/ds/src/*-body.html) a un componente React (TSX).
 * Se usó una sola vez para migrar la documentación; a partir de ahí los TSX generados se editan a mano.
 *
 * Uso: node scripts/html-to-tsx.mjs <entrada.html> <salida.tsx> <config.mjs>
 *   config.mjs exporta { replace: { [id]: { jsx, imports: [] } }, name }
 * - Un elemento cuyo id está en `replace` se sustituye por el JSX indicado (demos interactivas que antes manejaba JavaScript).
 * - <i class="bi bi-x"></i> pasa a <Icon name="x" />.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { parseFragment } from "parse5";

const [, , input, output, configPath] = process.argv;
const config = configPath ? (await import(pathToFileURL(resolve(configPath)).href)).default : { replace: {} };
const replace = config.replace ?? {};

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const INLINE = new Set(["a", "b", "i", "span", "code", "strong", "em", "kbd", "small", "abbr", "mark", "button", "label", "u", "sup", "sub", "samp", "cite", "q", "time", "img", "svg"]);
const ATTR = {
  class: "className", for: "htmlFor", tabindex: "tabIndex", colspan: "colSpan", rowspan: "rowSpan", maxlength: "maxLength", minlength: "minLength",
  inputmode: "inputMode", autocomplete: "autoComplete", readonly: "readOnly", contenteditable: "contentEditable", crossorigin: "crossOrigin",
  srcset: "srcSet", datetime: "dateTime", novalidate: "noValidate", autofocus: "autoFocus", spellcheck: "spellCheck", enctype: "encType",
  "accept-charset": "acceptCharset", "xlink:href": "xlinkHref", "xmlns:xlink": "xmlnsXlink", allowfullscreen: "allowFullScreen", frameborder: "frameBorder",
  srcdoc: "srcDoc", fetchpriority: "fetchPriority",
};
const BOOLEAN = new Set(["hidden", "disabled", "readonly", "required", "multiple", "novalidate", "autofocus", "inert", "open", "controls", "loop", "muted", "allowfullscreen"]);
const imports = new Set(['import Link from "next/link";']);
const icons = new Set();
let usedIcon = false;
let usedLink = false;

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const text = (s) => s.replace(/&/g, "&amp;").replace(/\{/g, "{'{'}").replace(/\}/g, "{'}'}").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function href(v) {
  let out = v.replace("{{VERSION}}", "2.0").replace(/\{\{FE\}\}\/assets\//g, "/assets/");
  out = out.replace(/\{\{FE\}\}\/(403|404|500|offline|mantenimiento)\.html/g, "/errores/$1");
  out = out.replace(/\{\{DS\}\}\/inicio\.html/g, "/").replace(/\{\{DS\}\}\/(\w+)\.html/g, "/$1").replace(/\{\{DS\}\}/g, "").replace(/\{\{DOCS\}\}/g, "");
  return out;
}

function style(v) {
  const parts = v.split(";").map((x) => x.trim()).filter(Boolean).map((decl) => {
    const i = decl.indexOf(":");
    const k = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    const key = k.startsWith("--") ? `["${k}" as string]` : camel(k.replace(/^-ms-/, "ms-"));
    return `${key}: ${JSON.stringify(val)}`;
  });
  return `{{ ${parts.join(", ")} }}`;
}

function attrs(el, tag) {
  const out = [];
  let defaultValueFromSelected = null;
  for (const { name, value } of el.attrs) {
    if (name === "id" && replace[value]) continue;
    let n = ATTR[name] ?? name;
    if (tag === "input" && name === "value") n = "defaultValue";
    if (tag === "input" && name === "checked") { out.push("defaultChecked"); continue; }
    if (name === "onsubmit") { out.push('data-nosubmit="true"'); continue; }
    if (/^on[a-z]+$/.test(name)) continue;
    if (name === "style") { out.push(`style=${style(value)}`); continue; }
    if (name === "selected") continue;
    if (n === name && name.includes("-") && !name.startsWith("data-") && !name.startsWith("aria-")) n = camel(name);
    if (n === "xmlns:xlink" || name === "xmlns") continue;
    let v = value;
    if (n === "href" || n === "src") v = href(v);
    if (BOOLEAN.has(name) && value === "") { out.push(ATTR[name] ?? name); continue; }
    if (name === "aria-hidden" || name === "aria-pressed" || name === "aria-expanded" || name === "aria-selected" || name === "aria-checked") {
      // se mantienen como cadenas ("true"/"false"), igual que en HTML
    }
    if (n === "href" && v.startsWith("/") && tag === "a") { usedLink = true; }
    if (["colSpan", "rowSpan", "maxLength", "minLength", "tabIndex", "rows", "cols", "size", "span", "start"].includes(n) && /^-?\d+$/.test(v)) { out.push(`${n}={${v}}`); continue; }
    out.push(`${n}=${JSON.stringify(v)}`);
  }
  return out.join(" ");
}

function indent(depth) { return "  ".repeat(depth); }

function nodeToJsx(node, depth, opts) {
  if (node.nodeName === "#comment") return "";
  if (node.nodeName === "#text") return textNode(node, opts);
  const tag = node.tagName;
  for (const m of config.matchers ?? []) {
    const r = m(node);
    if (r) { for (const i of r.imports ?? []) imports.add(i); return indent(depth) + r.jsx; }
  }
  const idAttr = node.attrs?.find((a) => a.name === "id")?.value;
  if (idAttr && replace[idAttr]) {
    for (const i of replace[idAttr].imports ?? []) imports.add(i);
    return indent(depth) + replace[idAttr].jsx;
  }
  if (tag === "script") throw new Error(`<script> sin sustituir (id=${idAttr ?? "?"})`);
  if (tag === "i" && node.childNodes.length === 0) {
    const cls = (node.attrs.find((a) => a.name === "class")?.value ?? "").split(/\s+/);
    const bi = cls.find((c) => c.startsWith("bi-"));
    if (bi) {
      usedIcon = true;
      icons.add(bi.slice(3));
      const extra = cls.filter((c) => c !== "bi" && c !== bi).join(" ");
      const rest = node.attrs.filter((a) => !["class", "aria-hidden"].includes(a.name));
      const other = rest.length ? " " + attrs({ attrs: rest }, "i") : "";
      return `${indent(depth)}<Icon name="${bi.slice(3)}"${extra ? ` className="${extra}"` : ""}${other} />`;
    }
  }
  const children = node.childNodes ?? [];
  let a = attrs(node, tag);
  const pre = opts.pre || tag === "pre";
  if (tag === "textarea") {
    const t = children.map((c) => c.value ?? "").join("");
    return `${indent(depth)}<textarea ${a}${t ? ` defaultValue=${JSON.stringify(t)}` : ""} />`;
  }
  if (tag === "select") {
    const sel = children.find((c) => c.tagName === "option" && c.attrs?.some((x) => x.name === "selected"));
    if (sel) {
      const v = sel.attrs.find((x) => x.name === "value")?.value ?? sel.childNodes.map((c) => c.value).join("");
      a = `${a} defaultValue=${JSON.stringify(v)}`.trim();
    }
  }
  const open = `<${tag}${a ? " " + a : ""}`;
  if (VOID.has(tag)) return `${indent(depth)}${open} />`;
  const inner = [];
  children.forEach((c, i) => {
    const prev = children[i - 1], next = children[i + 1];
    const s = nodeToJsx(c, depth + 1, { ...opts, pre, prev, next, parentTag: tag });
    if (s) inner.push(/^\s/.test(s) ? s : indent(depth + 1) + s);
  });
  if (!inner.length) return `${indent(depth)}${open} />`;
  // Si todo cabe en una línea (texto y elementos pequeños), se compacta.
  if (inner.every((x) => !x.includes("\n"))) {
    const one = `${indent(depth)}${open}>${inner.map((x) => x.trim()).join("")}</${tag}>`;
    if (one.length <= 150) return one;
  }
  return `${indent(depth)}${open}>\n${inner.join("\n")}\n${indent(depth)}</${tag}>`;
}

function textNode(node, opts) {
  const v = node.value;
  if (opts.pre) return v ? `${indent(0)}{${JSON.stringify(v)}}` : "";
  if (!v.trim()) {
    if (v.includes("\n")) return "";
    const p = opts.prev, n = opts.next;
    return p && n ? '{" "}' : "";
  }
  let t = v.replace(/\s+/g, " ");
  const lead = t.startsWith(" "), trail = t.endsWith(" ");
  t = t.trim();
  const inl = (n) => n && n.tagName && INLINE.has(n.tagName);
  const keepLead = lead && (inl(opts.prev) || (opts.prev && opts.prev.nodeName === "#text"));
  const keepTrail = trail && inl(opts.next);
  // Frases con llaves o signos conflictivos: se emiten como expresión de cadena.
  const tricky = /[{}<>]/.test(t);
  let s = tricky ? `{${JSON.stringify(t)}}` : text(t);
  if (keepLead) s = `{" "}${s}`;
  if (keepTrail) s = `${s}{" "}`;
  return s;
}

function mergeImports(list) {
  const byModule = new Map();
  const rest = [];
  for (const line of list) {
    const m = line.match(/^import \{ (.+) \} from "(.+)";$/);
    if (!m) { rest.push(line); continue; }
    const set = byModule.get(m[2]) ?? new Set();
    m[1].split(",").map((s) => s.trim()).forEach((s) => set.add(s));
    byModule.set(m[2], set);
  }
  return [...rest, ...[...byModule].map(([mod, names]) => `import { ${[...names].sort().join(", ")} } from "${mod}";`)];
}

const html = readFileSync(input, "utf8").replace(/\r\n/g, "\n");
const frag = parseFragment(html);

// Fondo alterno de las secciones de primer nivel (como build.py): tinte en las impares, salvo las nocturnas.
let idx = 0;
for (const n of frag.childNodes) {
  if (n.tagName === "section") {
    const c = n.attrs.find((a) => a.name === "class");
    const cls = (c?.value ?? "").split(/\s+/).filter((x) => x && x !== "ds-sec--tint");
    if (!cls.includes("ds-sec--night") && idx % 2 === 1) cls.push("ds-sec--tint");
    if (c) c.value = cls.join(" "); else n.attrs.push({ name: "class", value: cls.join(" ") });
    idx++;
  }
}

const sections = frag.childNodes.filter((n) => n.tagName === "section").map((n) => {
  const g = (k) => n.attrs.find((a) => a.name === k)?.value;
  return { id: g("id"), label: (g("data-nav") ?? "").replace(/^\d+ · /, ""), group: g("data-grp") ?? "" };
}).filter((s) => s.id && s.label);

const body = frag.childNodes.map((n) => nodeToJsx(n, 3, {})).filter(Boolean).join("\n");
const header = [
  "/* Generado desde docs/ds/src por scripts/html-to-tsx.mjs (migración a React, v2.0).",
  "   A partir de aquí este archivo es la fuente: se edita a mano. */",
  "/* eslint-disable react/no-unescaped-entities */",
  ...mergeImports([...imports].filter((i) => (usedLink || !i.includes("next/link")))),
  ...(usedIcon ? ['import { Icon } from "@/components/ui/icon";'] : []),
].join("\n");

const out = `${header}

export default function ${config.name ?? "Content"}() {
  return (
    <>
${body.split("\n").map((l) => l).join("\n")}
    </>
  );
}
`;
writeFileSync(output, out);
writeFileSync(output.replace(/[^/\\]+$/, "sections.ts"), `/* Índice de la página (generado). */
export const sections: { id: string; label: string; group: string }[] = ${JSON.stringify(sections, null, 2)};
`);
console.log(`${output}: ${sections.length} secciones, ${icons.size} iconos`);
