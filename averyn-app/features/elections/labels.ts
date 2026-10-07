import type { ComponentType, SVGProps } from "react";
import { BarChart, CheckCircle, FileEarmarkText, Lock, Sliders, Unlock, XCircle } from "react-bootstrap-icons";

import type { ChipTone } from "@/components/ui/feedback";

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

/* Iconos Bootstrap Icons importados directamente porque `components/ui/icon.tsx` es un archivo compartido:
   «Configurando» (bi-sliders) y «En curso» (bi-unlock) llevan el icono literal del original y no está en el registro. */
export const ELECTION_STATUS_CHIP: Record<ElectionStatus, { tone: ChipTone; icon: ComponentType<SVGProps<SVGSVGElement>>; label: string }> = {
  draft: { tone: "neutral", icon: FileEarmarkText, label: "Borrador" },
  configuration: { tone: "warning", icon: Sliders, label: "Configurando" },
  open: { tone: "success", icon: Unlock, label: "En curso" },
  closed: { tone: "info", icon: Lock, label: "Cerrado" },
  counting: { tone: "warning", icon: BarChart, label: "Conteo" },
  finished: { tone: "success", icon: CheckCircle, label: "Finalizado" },
  cancelled: { tone: "error", icon: XCircle, label: "Cancelado" },
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
