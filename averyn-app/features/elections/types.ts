import type { Affiliation } from "@/features/identity/types";

/** Estado de un proceso electoral. Un proceso nuevo siempre empieza como borrador. */
export type ElectionStatus = "draft" | "configuration" | "open" | "closed" | "counting" | "finished" | "cancelled";

export type InstitutionKind = "university" | "school" | "foundation" | "company";

export type ProcessKind = "council" | "representatives" | "consultation" | "general";

export type VotingType = "single" | "cumulative" | "weighted";

export type VotingMode = "online" | "in-person";

/** Opciones de votación del proceso. */
export interface ElectionSettings {
  votingType: VotingType;
  /** Cuántas opciones puede marcar cada votante, de 1 a 5 (en voto único siempre es 1). */
  choicesPerVote: number;
  mode: VotingMode;
  anonymous: boolean;
  blankVote: boolean;
  showResults: boolean;
  allowVoteChange: boolean;
}

/** A quién se convoca: una afiliación o todas, y cuántas personas del padrón son. */
export interface ElectionParticipants {
  affiliation: Affiliation | "all";
  /** Personas del padrón que cumplen el criterio al crear el proceso. */
  eligible: number;
  /** De las convocadas, cuántas ya están verificadas (solo ellas podrán votar). */
  verified: number;
}

/** Un proceso electoral. */
export interface Election {
  id: string;
  name: string;
  description: string;
  institution: InstitutionKind;
  kind: ProcessKind;
  /** Fecha de inicio, `aaaa-mm-dd`. */
  startDate: string;
  /** Fecha de fin, `aaaa-mm-dd`. */
  endDate: string;
  status: ElectionStatus;
  settings: ElectionSettings;
  participants: ElectionParticipants;
  /** Instante de creación, ISO 8601. */
  createdAt: string;
}

/** Lo que se necesita para crear un proceso (el servicio agrega el id, el estado y la fecha de creación). */
export type NewElectionInput = Omit<Election, "id" | "status" | "createdAt">;

/** Datos de la información general tal como los escribe la persona (texto sin validar). */
export interface GeneralInfoInput {
  name: string;
  description: string;
  institution: string;
  kind: string;
  startDate: string;
  endDate: string;
}

/** Campos de la información general que pueden traer un error. */
export type GeneralInfoField = keyof GeneralInfoInput;

/** Datos de la configuración tal como los escribe la persona (texto sin validar). */
export interface SettingsInput {
  votingType: string;
  choicesPerVote: string;
  mode: string;
  anonymous: boolean;
  blankVote: boolean;
  showResults: boolean;
  allowVoteChange: boolean;
}

/** Campos de la configuración que pueden traer un error. */
export type SettingsField = "votingType" | "choicesPerVote" | "mode";

/** Resultado de crear el proceso desde el asistente. */
export interface CreateElectionResult {
  ok: boolean;
  message: string;
  /** Errores por campo de la información general (solo cuando falla la validación). */
  generalErrors?: Partial<Record<GeneralInfoField, string>>;
  settingsErrors?: Partial<Record<SettingsField, string>>;
}
