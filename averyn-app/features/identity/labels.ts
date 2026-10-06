import type { ChipTone } from "@/components/ui/feedback";
import type { IconName } from "@/components/ui/icon";

import type { Affiliation, PersonStatus } from "./types";

/** Todas las afiliaciones, en el orden del formulario. */
export const AFFILIATIONS: readonly Affiliation[] = ["student", "teacher", "staff", "visitor"];

/** Texto de cada afiliación. */
export const AFFILIATION_LABEL: Record<Affiliation, string> = {
  student: "Estudiante",
  teacher: "Docente",
  staff: "Administrativo",
  visitor: "Visitante",
};

/** Icono de cada afiliación. */
export const AFFILIATION_ICON: Record<Affiliation, IconName> = {
  student: "mortarboard",
  teacher: "person-badge",
  staff: "briefcase",
  visitor: "person",
};

/** Texto de cada estado: el estado nunca se comunica solo con color. */
export const STATUS_LABEL: Record<PersonStatus, string> = {
  verified: "Verificado",
  pending: "Pendiente",
};

/** Tono e icono del chip de cada estado. */
export const STATUS_CHIP: Record<PersonStatus, { tone: ChipTone; icon: IconName }> = {
  verified: { tone: "success", icon: "check-circle" },
  pending: { tone: "warning", icon: "clock" },
};
