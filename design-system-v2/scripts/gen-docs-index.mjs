#!/usr/bin/env node
/* Regenera lib/docs-sections.ts con el índice (sections.ts) de cada página de app/(ds)/. */
import { readdirSync, existsSync, writeFileSync } from "node:fs";
const dirs = readdirSync("app/(ds)", { withFileTypes: true }).filter((d) => d.isDirectory() && existsSync(`app/(ds)/${d.name}/sections.ts`)).map((d) => d.name).sort();
const out = `/* Generado por scripts/gen-docs-index.mjs */
${dirs.map((d) => `import { sections as ${d} } from "@/app/(ds)/${d}/sections";`).join("\n")}

/** Índice de cada página (subgrupos y secciones). */
export const SECTIONS: Record<string, { id: string; label: string; group: string }[]> = {
  ${dirs.join(",\n  ")},
};
`;
writeFileSync("lib/docs-sections.ts", out);
console.log(dirs.join(", "));
