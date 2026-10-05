#!/usr/bin/env node
/**
 * Regenera components/ui/icon.tsx: el registro de Bootstrap Icons que se usan en el código.
 * Recorre los .tsx de app/ y components/ y toma toda cadena que sea el nombre de un icono de react-bootstrap-icons
 * (kebab-case: "check-circle"). Así cada icono se importa por nombre y el bundle solo incluye los usados.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import * as bi from "react-bootstrap-icons";

const pascal = (s) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = [...walk("app"), ...walk("components"), ...walk("lib")].filter((f) => /\.(tsx|ts)$/.test(f) && !f.endsWith("components/ui/icon.tsx") && !f.endsWith("components\\ui\\icon.tsx"));
const names = new Set();
for (const f of files) {
  for (const m of readFileSync(f, "utf8").matchAll(/["'`]([a-z][a-z0-9]*(?:-[a-z0-9]+)*)["'`]/g)) {
    if (bi[pascal(m[1])]) names.add(m[1]);
  }
}
const list = [...names].sort();
const out = `import type { ComponentType, SVGProps } from "react";
import {
${list.map((n) => `  ${pascal(n)},`).join("\n")}
} from "react-bootstrap-icons";
import { cn } from "@/lib/utils";

/* Bootstrap Icons (decisión del equipo, 5-oct-2026). Es el único punto de entrada a los iconos: se importan uno a uno
   (tree-shaking) y se llaman por el mismo nombre que en la documentación (\`bi-check-circle\` → name="check-circle").
   Generado por scripts/gen-icons.mjs (npm run icons). Lineicons queda como opción futura (ver ADR-011). */
const ICONS = {
${list.map((n) => `  "${n}": ${pascal(n)},`).join("\n")}
} satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconName = keyof typeof ICONS;

export type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  /** Nombre accesible. Sin él, el icono es decorativo y se oculta a los lectores de pantalla. */
  label?: string;
  size?: number | string;
};

export function Icon({ name, label, size = "1em", className, ...props }: IconProps) {
  const Svg = ICONS[name];
  return (
    <Svg
      width={size}
      height={size}
      className={cn("bi shrink-0", className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: "false" })}
      {...props}
    />
  );
}
`;
writeFileSync("components/ui/icon.tsx", out);
console.log(`${list.length} iconos`);
