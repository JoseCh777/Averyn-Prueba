import { sections as calidad } from "@/app/(ds)/calidad/sections";
import { sections as patrones } from "@/app/(ds)/patrones/sections";

/** Índice de cada página (subgrupos y secciones), generado junto con el contenido. */
export const SECTIONS: Record<string, { id: string; label: string; group: string }[]> = {
  calidad,
  patrones,
};
