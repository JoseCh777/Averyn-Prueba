import type { ChipTone } from "@/components/ui/feedback";
import type { IconName } from "@/components/ui/icon";

import type { ElectionStatus, InstitutionKind, ProcessKind, VotingMode, VotingType } from "./types";

export const INSTITUTION_KINDS: readonly InstitutionKind[] = ["university", "school", "foundation", "company"];
export const INSTITUTION_LABEL: Record<InstitutionKind, string> = {
  university: "Universidad",
  school: "Colegio",
  foundation: "Fundación",
  company: "Empresa",
};

export const PROCESS_KINDS: readonly ProcessKind[] = ["council", "representatives", "consultation", "general"];
export const PROCESS_KIND_LABEL: Record<ProcessKind, string> = {
  council: "Elección de consejo",
  representatives: "Elección de representantes",
  consultation: "Consulta institucional",
  general: "Votación general",
};

export const VOTING_TYPES: readonly VotingType[] = ["single", "cumulative", "weighted"];
export const VOTING_TYPE_LABEL: Record<VotingType, string> = {
  single: "Voto único",
  cumulative: "Voto acumulativo",
  weighted: "Voto ponderado",
};

export const VOTING_MODES: readonly VotingMode[] = ["online", "in-person"];
export const VOTING_MODE_LABEL: Record<VotingMode, string> = { online: "En línea", "in-person": "Presencial" };

/** Chip de cada estado del proceso: el color siempre va con icono y palabra. */
export const ELECTION_STATUS_CHIP: Record<ElectionStatus, { tone: ChipTone; icon: IconName; label: string }> = {
  draft: { tone: "neutral", icon: "file-earmark-text", label: "Borrador" },
  configuration: { tone: "warning", icon: "gear", label: "Configurando" },
  open: { tone: "success", icon: "signal", label: "En curso" },
  closed: { tone: "info", icon: "lock", label: "Cerrado" },
  counting: { tone: "warning", icon: "bar-chart", label: "Conteo" },
  finished: { tone: "success", icon: "check-circle", label: "Finalizado" },
  cancelled: { tone: "error", icon: "x-circle", label: "Cancelado" },
};

/** Las cuatro opciones de votación que se activan o apagan, con su texto. */
export const SETTING_SWITCHES = [
  { key: "anonymous", label: "Votación anónima" },
  { key: "blankVote", label: "Permitir voto en blanco" },
  { key: "showResults", label: "Mostrar resultados" },
  { key: "allowVoteChange", label: "Permitir modificación del voto" },
] as const;

/** Opciones por voto que se pueden elegir. */
export const CHOICES_PER_VOTE_OPTIONS: readonly number[] = [1, 2, 3, 4, 5];
