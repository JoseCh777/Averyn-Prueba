/* Extrae los datos de foundations.js (colores, pares de contraste, espacios, radios, iconos) a lib/foundations-data.ts. Se usó una vez. */
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";
const src = readFileSync("../docs/ds/foundations.js", "utf8");
const grab = (name, end) => {
  const i = src.indexOf(`var ${name} = `);
  const j = src.indexOf(end, i);
  return src.slice(i, j + end.length);
};
const code = [grab("COLORES", "\n  };"), grab("PARES", "\n  ];"), grab("ESP", "];"), grab("RAD", "];"), grab("ICONOS", "];")].join("\n");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code + "\nthis.out = { COLORES, PARES, ESP, RAD, ICONOS };", ctx);
const o = ctx.out;
const ts = `/* Datos de la sección Fundamentos (extraídos de foundations.js de la v1.7). */
export const COLORS: Record<string, [name: string, token: string, hex: string, use: string, ink: string][]> = ${JSON.stringify(o.COLORES, null, 2)};

/** [texto, fondo, descripción, uso] */
export const CONTRAST_PAIRS: [string, string, string, string][] = ${JSON.stringify(o.PARES, null, 2)};

export const SPACES: [string, number][] = ${JSON.stringify(o.ESP)};
export const RADII: [string, string, string, string][] = ${JSON.stringify(o.RAD)};
export const ICON_SAMPLES: [string, string][] = ${JSON.stringify(o.ICONOS)};
`;
writeFileSync("lib/foundations-data.ts", ts);
console.log(Object.keys(o.COLORES), o.PARES.length, o.ESP.length, o.RAD.length, o.ICONOS.length);
