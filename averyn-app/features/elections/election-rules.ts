import { normalizeText, parseAffiliation } from "@/features/identity/person-rules";
import type { Affiliation, Person } from "@/features/identity/types";

import { INSTITUTION_KINDS, PROCESS_KINDS, VOTING_MODES, VOTING_TYPES } from "./labels";
import type {
  ElectionParticipants,
  ElectionSettings,
  GeneralInfoField,
  GeneralInfoInput,
  InstitutionKind,
  ProcessKind,
  SettingsField,
  SettingsInput,
  VotingMode,
  VotingType,
} from "./types";

/**
 * Reglas del módulo Electoral: validación de lo que se escribe en el asistente y conteo del padrón.
 * El Core será la autoridad sobre un proceso (AGENTS §6); estas reglas evitan enviarle datos que
 * se sabe que rechazará y dan el mensaje en palabras de la persona.
 */

const NAME_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 500;
const MAX_CHOICES = 5;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Indica si un texto es una fecha `aaaa-mm-dd` que existe (31-02 no existe).
 *
 * @param text - Lo escrito, tal como lo entrega un campo de fecha.
 * @returns `true` si es una fecha válida.
 */
export function isIsoDate(text: string): boolean {
  const match = DATE_PATTERN.exec(text);
  if (match === null) return false;
  const [, year = "", month = "", day = ""] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day);
}

/** Resultado de validar la información general: los datos limpios o un mensaje por campo. */
export type GeneralInfoValidation =
  | { ok: true; value: { name: string; description: string; institution: InstitutionKind; kind: ProcessKind; startDate: string; endDate: string } }
  | { ok: false; errors: Partial<Record<GeneralInfoField, string>> };

/**
 * Valida la información general del proceso.
 *
 * El nombre no puede repetirse (sin distinguir mayúsculas ni tildes); la fecha de inicio no puede
 * ser anterior a hoy; la de fin no puede ser anterior a la de inicio.
 *
 * @param raw - Lo escrito en el formulario.
 * @param context - Nombres de los procesos que ya existen y el día de hoy (`aaaa-mm-dd`, hora de Lima).
 * @returns Los datos limpios o un mensaje por cada campo con problema.
 */
export function validateGeneralInfo(raw: GeneralInfoInput, context: { existingNames: readonly string[]; today: string }): GeneralInfoValidation {
  const errors: Partial<Record<GeneralInfoField, string>> = {};
  const name = raw.name.trim().replace(/\s+/g, " ");
  const description = raw.description.trim();
  const institution = INSTITUTION_KINDS.find((option) => option === raw.institution);
  const kind = PROCESS_KINDS.find((option) => option === raw.kind);

  if (name === "") errors.name = "Completa este campo para continuar.";
  else if (name.length > NAME_MAX_LENGTH) errors.name = `El nombre no puede pasar de ${NAME_MAX_LENGTH} caracteres.`;
  else if (context.existingNames.some((existing) => normalizeText(existing.trim()) === normalizeText(name))) {
    errors.name = "Ya existe un proceso electoral con este nombre.";
  }

  if (description === "") errors.description = "Completa este campo para continuar.";
  else if (description.length > DESCRIPTION_MAX_LENGTH) errors.description = `La descripción no puede pasar de ${DESCRIPTION_MAX_LENGTH} caracteres.`;

  if (institution === undefined) errors.institution = "Completa este campo para continuar.";
  if (kind === undefined) errors.kind = "Completa este campo para continuar.";

  const startOk = isIsoDate(raw.startDate);
  const endOk = isIsoDate(raw.endDate);
  if (raw.startDate === "") errors.startDate = "Completa este campo para continuar.";
  else if (!startOk) errors.startDate = "La fecha de inicio no es válida.";
  else if (raw.startDate < context.today) errors.startDate = "La fecha de inicio no puede ser anterior a hoy.";

  if (raw.endDate === "") errors.endDate = "Completa este campo para continuar.";
  else if (!endOk) errors.endDate = "La fecha de finalización no es válida.";
  else if (startOk && raw.endDate < raw.startDate) errors.endDate = "La fecha de finalización debe ser posterior a la fecha de inicio.";

  if (Object.keys(errors).length > 0 || institution === undefined || kind === undefined) return { ok: false, errors };
  return { ok: true, value: { name, description, institution, kind, startDate: raw.startDate, endDate: raw.endDate } };
}

/** Resultado de validar la configuración: los datos limpios o un mensaje por campo. */
export type SettingsValidation = { ok: true; value: ElectionSettings } | { ok: false; errors: Partial<Record<SettingsField, string>> };

/**
 * Valida las opciones de votación.
 *
 * En voto único cada votante marca una sola opción, así que las opciones por voto son siempre 1.
 *
 * @param raw - Lo escrito en el formulario.
 * @returns La configuración limpia o un mensaje por cada campo con problema.
 */
export function validateSettings(raw: SettingsInput): SettingsValidation {
  const errors: Partial<Record<SettingsField, string>> = {};
  const votingType: VotingType | undefined = VOTING_TYPES.find((option) => option === raw.votingType);
  const mode: VotingMode | undefined = VOTING_MODES.find((option) => option === raw.mode);
  const choices = Number(raw.choicesPerVote);

  if (votingType === undefined) errors.votingType = "Completa este campo para continuar.";
  if (mode === undefined) errors.mode = "Selecciona una modalidad.";
  if (votingType !== "single" && (!Number.isInteger(choices) || choices < 1 || choices > MAX_CHOICES)) {
    errors.choicesPerVote = "Selecciona al menos una opción.";
  }

  if (Object.keys(errors).length > 0 || votingType === undefined || mode === undefined) return { ok: false, errors };
  return {
    ok: true,
    value: {
      votingType,
      choicesPerVote: votingType === "single" ? 1 : choices,
      mode,
      anonymous: raw.anonymous,
      blankVote: raw.blankVote,
      showResults: raw.showResults,
      allowVoteChange: raw.allowVoteChange,
    },
  };
}

/**
 * Personas del padrón que se convocan.
 *
 * @param people - El padrón (el catálogo de Identidad).
 * @param affiliation - Una afiliación o `all`.
 * @returns Las personas que cumplen el criterio, en el mismo orden.
 */
export function eligibleVoters(people: readonly Person[], affiliation: Affiliation | "all"): Person[] {
  return people.filter((person) => affiliation === "all" || person.affiliation === affiliation);
}

/**
 * Cuenta a quién se convoca y cuántos podrán votar (solo las personas verificadas).
 *
 * @param people - El padrón.
 * @param affiliation - Una afiliación o `all`.
 * @returns Convocados y, de ellos, los verificados.
 */
export function countParticipants(people: readonly Person[], affiliation: Affiliation | "all"): ElectionParticipants {
  const eligible = eligibleVoters(people, affiliation);
  return { affiliation, eligible: eligible.length, verified: eligible.filter((person) => person.status === "verified").length };
}

/**
 * Iniciales de un proceso para su avatar («Consejo Estudiantil» → «CE»).
 *
 * @param name - Nombre del proceso.
 * @returns Hasta dos letras en mayúscula.
 */
export function electionInitials(name: string): string {
  const [first = "", second = ""] = name.trim().split(/\s+/);
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
}

/**
 * Fecha en formato de la interfaz de Averyn (`aaaa-mm-dd` → `dd/mm/aaaa`).
 *
 * @param iso - Fecha en formato del campo de fecha; vacía, como lo pinta el original.
 * @returns La fecha legible.
 */
export function formatDate(iso: string): string {
  if (iso === "") return "-";
  return iso.split("-").reverse().join("/");
}

/**
 * Rango de fechas para el listado.
 *
 * @param startDate - `aaaa-mm-dd`.
 * @param endDate - `aaaa-mm-dd`.
 * @returns Por ejemplo `15/10/2026 – 20/10/2026`.
 */
export function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

/** Lo que envía el asistente al crear el proceso, ya con su forma comprobada. */
export interface ElectionPayload {
  general: GeneralInfoInput;
  settings: SettingsInput;
  affiliation: Affiliation | "all";
}

function readText(source: object, key: string): string | undefined {
  const value: unknown = Reflect.get(source, key);
  return typeof value === "string" ? value : undefined;
}

function readFlag(source: object, key: string): boolean | undefined {
  const value: unknown = Reflect.get(source, key);
  return typeof value === "boolean" ? value : undefined;
}

function readObject(source: object, key: string): object | undefined {
  const value: unknown = Reflect.get(source, key);
  return typeof value === "object" && value !== null ? value : undefined;
}

/**
 * Interpreta lo que llega del navegador al crear un proceso.
 *
 * Los argumentos de una acción de servidor no se asumen: deben tener la forma esperada (textos y
 * casillas del tipo correcto). Que los valores sean válidos lo deciden `validateGeneralInfo` y
 * `validateSettings`.
 *
 * @param input - Valor sin validar.
 * @returns La carga con su forma comprobada, o `undefined` si algo no tiene la forma esperada.
 */
export function parseElectionPayload(input: unknown): ElectionPayload | undefined {
  if (typeof input !== "object" || input === null) return undefined;
  const general = readObject(input, "general");
  const settings = readObject(input, "settings");
  const affiliationText = readText(input, "affiliation");
  if (general === undefined || settings === undefined || affiliationText === undefined) return undefined;

  const affiliation = affiliationText === "all" ? "all" : parseAffiliation(affiliationText);
  const name = readText(general, "name");
  const description = readText(general, "description");
  const institution = readText(general, "institution");
  const kind = readText(general, "kind");
  const startDate = readText(general, "startDate");
  const endDate = readText(general, "endDate");
  const votingType = readText(settings, "votingType");
  const choicesPerVote = readText(settings, "choicesPerVote");
  const mode = readText(settings, "mode");
  const anonymous = readFlag(settings, "anonymous");
  const blankVote = readFlag(settings, "blankVote");
  const showResults = readFlag(settings, "showResults");
  const allowVoteChange = readFlag(settings, "allowVoteChange");

  if (affiliation === undefined) return undefined;
  if (name === undefined || description === undefined || institution === undefined || kind === undefined || startDate === undefined || endDate === undefined) return undefined;
  if (votingType === undefined || choicesPerVote === undefined || mode === undefined) return undefined;
  if (anonymous === undefined || blankVote === undefined || showResults === undefined || allowVoteChange === undefined) return undefined;

  return {
    general: { name, description, institution, kind, startDate, endDate },
    settings: { votingType, choicesPerVote, mode, anonymous, blankVote, showResults, allowVoteChange },
    affiliation,
  };
}
