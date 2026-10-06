import type { AppModule } from "@/components/layout/modules";
import type { IconName } from "@/components/ui/icon";
import type { TileTone } from "@/components/ui/display";

/** Tamaño del acceso en el mosaico: grande (2 por fila), mediano (3 por fila) o pequeño (2 por fila). */
export type QuickAccessSize = "large" | "medium" | "small";

export type QuickAccess = {
  title: string;
  description: string;
  /** Módulo del dock al que pertenece; de él sale la ruta. */
  moduleLabel: AppModule["label"];
  icon: IconName;
  size: QuickAccessSize;
  tone: TileTone;
};

/** Atajos a los módulos, en el orden del mosaico. No tienen lógica: son enlaces. */
export const QUICK_ACCESS: readonly QuickAccess[] = [
  { title: "Gestionar personas", description: "Listado y verificación de identidad", moduleLabel: "Identidad", icon: "person-vcard", size: "large", tone: "signal" },
  { title: "Biometría", description: "Registro y verificación biométrica de rostro y huella", moduleLabel: "Biometría", icon: "fingerprint", size: "large", tone: "night" },
  { title: "Procesar documento", description: "OCR · nuevo registro desde documento", moduleLabel: "OCR", icon: "file-earmark-text", size: "medium", tone: "tint" },
  { title: "Procesos electorales", description: "Convocatorias y mesas de votación", moduleLabel: "Electoral", icon: "card-checklist", size: "medium", tone: "tint" },
  { title: "Consultas con IA", description: "Preguntas sobre identidad y procesos", moduleLabel: "IA", icon: "stars", size: "medium", tone: "tint" },
  { title: "Gestionar usuarios", description: "Cuentas y roles de la organización", moduleLabel: "Administración", icon: "person-gear", size: "small", tone: "soon" },
  { title: "Reportes y auditoría", description: "Trazabilidad y exportación de datos", moduleLabel: "Administración", icon: "clipboard-data", size: "small", tone: "soon" },
];

/**
 * Ruta de un acceso rápido, tomada del registro de módulos del dock.
 *
 * Así hay una sola fuente de verdad: cuando una funcionalidad agrega el `href` de su
 * módulo en `components/layout/modules.ts`, su acceso rápido pasa a ser un enlace sin
 * tocar el dashboard. Mientras no exista, el acceso se muestra como «Próximamente».
 *
 * @param moduleLabel - Etiqueta del módulo en el dock.
 * @param modules - Módulos del dock.
 * @returns La ruta del módulo, o `undefined` si el módulo no existe o aún no tiene pantalla.
 */
export function resolveQuickAccessHref(moduleLabel: string, modules: readonly AppModule[]): string | undefined {
  return modules.find((module) => module.label === moduleLabel)?.href;
}
