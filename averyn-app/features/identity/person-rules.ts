import { AFFILIATIONS } from "./labels";
import type { Affiliation, NewPersonField, NewPersonInput, PeopleFilter, PeopleSummary, Person, PersonStatus } from "./types";

/** Reglas de presentación y de validación del formulario. El Core será la autoridad (AGENTS §6). */
const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 80;
const DOCUMENT_MIN_LENGTH = 6;
const DOCUMENT_MAX_LENGTH = 12;
const NAME_PATTERN = /^\p{L}[\p{L}\s.'-]*$/u;
const DOCUMENT_PATTERN = /^\d+$/;

/**
 * Quita tildes y mayúsculas para comparar texto («Pérez» y «perez» coinciden).
 *
 * @param text - Texto de entrada.
 * @returns El texto normalizado.
 */
export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/**
 * Filtra personas por texto (nombre o documento, sin tildes) y por estado.
 *
 * @param people - Personas de origen.
 * @param filter - Texto y estado; un texto vacío no filtra y `all` acepta cualquier estado.
 * @returns Las personas que cumplen ambos criterios, en el mismo orden.
 */
export function filterPeople(people: readonly Person[], filter: PeopleFilter): Person[] {
  const query = normalizeText(filter.query.trim());
  return people.filter((person) => {
    const matchesStatus = filter.status === "all" || person.status === filter.status;
    const matchesQuery = query === "" || normalizeText(`${person.name} ${person.document}`).includes(query);
    return matchesStatus && matchesQuery;
  });
}

/**
 * Cuenta personas por estado para los indicadores.
 *
 * @param people - Todas las personas (sin filtrar).
 * @returns Totales y porcentaje de verificadas redondeado al entero más cercano.
 */
export function summarizePeople(people: readonly Person[]): PeopleSummary {
  const total = people.length;
  const verified = people.filter((person) => person.status === "verified").length;
  return {
    total,
    verified,
    pending: total - verified,
    verificationRate: total === 0 ? 0 : Math.round((verified / total) * 100),
  };
}

/**
 * Iniciales de un nombre: la primera letra de las dos primeras palabras.
 *
 * @param name - Nombre completo.
 * @returns Hasta dos letras en mayúscula; cadena vacía si el nombre está vacío.
 */
export function initialsOf(name: string): string {
  const [first = "", second = ""] = name.trim().split(/\s+/);
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
}

/** Tonos de avatar del Design System, en el orden en que se asignan. */
export const AVATAR_TONES = ["blue", "violet", "teal", "amber", "rose", "slate"] as const;
export type AvatarTone = (typeof AVATAR_TONES)[number];

/**
 * Tono de avatar estable para una persona: el mismo id siempre da el mismo color.
 *
 * @param id - Identificador de la persona.
 * @returns Uno de los seis tonos.
 */
export function avatarToneOf(id: string): AvatarTone {
  let hash = 0;
  for (const character of id) {
    hash = (hash * 31 + character.charCodeAt(0)) % AVATAR_TONES.length;
  }
  return AVATAR_TONES[hash] ?? "blue";
}

/**
 * Interpreta una afiliación recibida de un formulario o de la URL.
 *
 * @param value - Valor sin validar.
 * @returns La afiliación, o `undefined` si no es una de las conocidas.
 */
export function parseAffiliation(value: unknown): Affiliation | undefined {
  return AFFILIATIONS.find((affiliation) => affiliation === value);
}

/**
 * Interpreta el estado del filtro recibido de la URL.
 *
 * @param value - Valor sin validar.
 * @returns `verified`, `pending` o `all` (cualquier otro valor equivale a «todos»).
 */
export function parseStatusFilter(value: unknown): PersonStatus | "all" {
  return value === "verified" || value === "pending" ? value : "all";
}

/** Resultado de validar el formulario: los datos limpios o un mensaje por campo. */
export type NewPersonValidation =
  | { ok: true; input: NewPersonInput }
  | { ok: false; errors: Partial<Record<NewPersonField, string>> };

/**
 * Valida y limpia los datos del formulario «Nueva persona».
 *
 * @param raw - Valores tal como llegaron del formulario.
 * @returns Los datos limpios (nombre sin espacios sobrantes) o un mensaje por cada campo inválido.
 */
export function validateNewPerson(raw: { name: string; document: string; affiliation: string }): NewPersonValidation {
  const name = raw.name.trim().replace(/\s+/g, " ");
  const document = raw.document.trim();
  const affiliation = parseAffiliation(raw.affiliation);
  const errors: Partial<Record<NewPersonField, string>> = {};

  if (name === "") {
    errors.name = "Escribe el nombre completo.";
  } else if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    errors.name = `El nombre debe tener entre ${NAME_MIN_LENGTH} y ${NAME_MAX_LENGTH} caracteres.`;
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = "El nombre solo puede llevar letras, espacios, puntos, apóstrofos y guiones.";
  }

  if (document === "") {
    errors.document = "Escribe el número de documento.";
  } else if (!DOCUMENT_PATTERN.test(document)) {
    errors.document = "El documento solo puede llevar números.";
  } else if (document.length < DOCUMENT_MIN_LENGTH || document.length > DOCUMENT_MAX_LENGTH) {
    errors.document = `El documento debe tener entre ${DOCUMENT_MIN_LENGTH} y ${DOCUMENT_MAX_LENGTH} dígitos.`;
  }

  if (affiliation === undefined) {
    errors.affiliation = "Elige una afiliación.";
  }

  if (Object.keys(errors).length > 0 || affiliation === undefined) {
    return { ok: false, errors };
  }
  return { ok: true, input: { name, document, affiliation } };
}
