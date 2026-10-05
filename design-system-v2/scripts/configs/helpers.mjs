/* Ayudantes para describir qué elementos del HTML original sustituye un componente React. */
export const attr = (n, k) => n.attrs?.find((a) => a.name === k)?.value;
export const hasClass = (n, c) => (attr(n, "class") ?? "").split(/\s+/).includes(c);
export const child = (n, f) => (n.childNodes ?? []).find((c) => c.tagName && f(c));
export const imp = (names, from = "@/components/patterns") => [`import { ${names.join(", ")} } from "${from}";`];
export const byClass = (cls, jsx, names, from) => (n) => (n.tagName && hasClass(n, cls) ? { jsx, imports: imp(names, from) } : null);
