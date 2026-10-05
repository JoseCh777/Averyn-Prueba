import { contrast } from "@/components/docs/foundation-demos";
import { modelJson } from "./data";
import { nf1 } from "./utils";

/** Modelo de datos en JSON (resumido) dentro del bloque de código de cada gráfico. */
export function ModelPre({ id }: { id: string }) {
  return <pre id={id}>{modelJson(id)}</pre>;
}

/** Contraste en vivo de un color de la paleta sobre blanco. */
export function ContrastOnWhite({ hex }: { hex: string }) {
  return <span>{nf1.format(contrast(hex, "#FFFFFF"))}:1 sobre blanco</span>;
}
