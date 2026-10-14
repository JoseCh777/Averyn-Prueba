import { AFFILIATIONS } from "./labels";
import { parseAffiliation, validateEmail } from "./person-rules";
import type { Affiliation, NewPersonInput } from "./types";

/**
 * Reglas del formulario «Nueva persona»: lo que se escribe, cómo se valida campo por campo y cómo se
 * convierte en la petición. Es lógica pura (sin red ni React) para poder probarla y reutilizarla.
 *
 * Los nombres siguen `person-contract.md` §2.1: hasta 80 caracteres, sin caracteres de control, con
 * los espacios normalizados. La validación del navegador es una ayuda de uso: el Core vuelve a
 * validar todo y es la autoridad (AGENTS §6).
 */

/** Lo que la persona escribe en el formulario; todo son textos, tal como llegan. */
export interface PersonFormFields {
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  /** Fecha de nacimiento `aaaa-mm-dd` (la entrega el campo de fecha) o vacío. */
  birthDate: string;
  document: string;
  affiliation: string;
  email: string;
}

export type PersonFormField = keyof PersonFormFields;

/** Un mensaje por cada campo inválido; vacío si todo está bien. */
export type PersonFormErrors = Partial<Record<PersonFormField, string>>;

/** Resultado de crear a una persona desde el formulario: la persona creada o los errores por campo. */
export type CreatePersonResult =
  | { ok: true; personId: string; name: string }
  | { ok: false; errors: PersonFormErrors; message?: string };

/** Campos en el orden en que aparecen: sirve para llevar el foco al primero que hay que corregir. */
export const PERSON_FORM_FIELDS: readonly PersonFormField[] = [
  "firstName",
  "middleName",
  "lastName",
  "secondLastName",
  "birthDate",
  "document",
  "affiliation",
  "email",
];

/** Formulario vacío; la afiliación más común ya viene elegida. */
export const EMPTY_PERSON_FORM: PersonFormFields = {
  firstName: "",
  middleName: "",
  lastName: "",
  secondLastName: "",
  birthDate: "",
  document: "",
  affiliation: "student",
  email: "",
};

/** Longitud máxima de cada nombre, en caracteres (person-contract 2.1). */
export const NAME_MAX_LENGTH = 80;
/** Fecha más antigua admitida para el nacimiento. */
export const MIN_BIRTH_DATE = "1900-01-01";
/** Largo del documento admitido, ya sin separadores. */
export const DOCUMENT_MIN_LENGTH = 6;
export const DOCUMENT_MAX_LENGTH = 12;

const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/u;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Normaliza un texto como lo hace el dominio: sin espacios en los extremos y con los espacios
 * internos (tabuladores y saltos de línea incluidos) reducidos a uno.
 *
 * @param value - Texto tal como se escribió.
 * @returns El texto normalizado.
 */
export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/gu, " ");
}

/**
 * Quita los separadores habituales de un número de documento (espacios, puntos y guiones).
 *
 * @param value - Número tal como se escribió, por ejemplo `10.234.567`.
 * @returns El número compacto.
 */
export function normalizeDocument(value: string): string {
  return value.replace(/[\s.-]/gu, "");
}

/**
 * Nombre completo para mostrar: primer nombre, segundo nombre, primer apellido y segundo apellido,
 * sin huecos si falta alguno.
 *
 * @param fields - Lo escrito en el formulario (aunque esté a medias).
 * @returns El nombre completo, o cadena vacía si no se escribió nada.
 */
export function fullNameOf(fields: Pick<PersonFormFields, "firstName" | "middleName" | "lastName" | "secondLastName">): string {
  return [fields.firstName, fields.middleName, fields.lastName, fields.secondLastName]
    .map(normalizeName)
    .filter((part) => part !== "")
    .join(" ");
}

function countCharacters(value: string): number {
  return [...value].length;
}

function isRealDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (match === null) return false;
  const [, year = "", month = "", day = ""] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day);
}

function checkName(raw: string, required: boolean, requiredMessage: string): string | undefined {
  const value = normalizeName(raw);
  if (value === "") return required ? requiredMessage : undefined;
  if (countCharacters(value) > NAME_MAX_LENGTH) return `Admite hasta ${NAME_MAX_LENGTH} caracteres.`;
  if (CONTROL_CHARACTERS.test(value)) return "No admite caracteres de control.";
  return undefined;
}

/**
 * Valida un solo campo (al salir de él o mientras se corrige).
 *
 * @param field - Campo a validar.
 * @param fields - Todos los valores actuales.
 * @param today - Día de hoy `aaaa-mm-dd`, para rechazar fechas futuras.
 * @returns El mensaje del problema, o `undefined` si el campo es aceptable.
 */
export function validatePersonField(field: PersonFormField, fields: PersonFormFields, today: string): string | undefined {
  switch (field) {
    case "firstName":
      return checkName(fields.firstName, true, "Escriba el primer nombre.");
    case "middleName":
      return checkName(fields.middleName, false, "");
    case "lastName":
      return checkName(fields.lastName, true, "Escriba el primer apellido.");
    case "secondLastName":
      return checkName(fields.secondLastName, false, "");
    case "birthDate": {
      const value = fields.birthDate.trim();
      if (value === "") return undefined;
      if (!isRealDate(value)) return "Escriba una fecha válida.";
      if (value < MIN_BIRTH_DATE) return "La fecha no puede ser anterior a 1900.";
      if (value > today) return "La fecha de nacimiento no puede ser futura.";
      return undefined;
    }
    case "document": {
      const value = normalizeDocument(fields.document);
      if (value === "") return "Escriba el número de documento.";
      if (!/^\d+$/u.test(value)) return "El documento solo puede llevar números.";
      if (value.length < DOCUMENT_MIN_LENGTH || value.length > DOCUMENT_MAX_LENGTH) {
        return `El documento debe tener entre ${DOCUMENT_MIN_LENGTH} y ${DOCUMENT_MAX_LENGTH} dígitos.`;
      }
      return undefined;
    }
    case "affiliation":
      return parseAffiliation(fields.affiliation) === undefined ? "Elija una afiliación." : undefined;
    case "email":
      return validateEmail(fields.email);
  }
}

/**
 * Valida todo el formulario.
 *
 * @param fields - Lo escrito.
 * @param today - Día de hoy `aaaa-mm-dd`.
 * @returns Un mensaje por cada campo inválido.
 */
export function validatePersonForm(fields: PersonFormFields, today: string): PersonFormErrors {
  const errors: PersonFormErrors = {};
  for (const field of PERSON_FORM_FIELDS) {
    const message = validatePersonField(field, fields, today);
    if (message !== undefined) errors[field] = message;
  }
  return errors;
}

/**
 * @param errors - Errores por campo.
 * @returns El primer campo con error según el orden del formulario, o `undefined` si no hay.
 */
export function firstInvalidField(errors: PersonFormErrors): PersonFormField | undefined {
  return PERSON_FORM_FIELDS.find((field) => errors[field] !== undefined);
}

/**
 * Convierte lo escrito en la petición de alta: textos normalizados y **sin los opcionales vacíos**.
 *
 * Debe llamarse solo con campos ya validados.
 *
 * @param fields - Lo escrito.
 * @returns La persona a crear.
 */
export function toNewPersonInput(fields: PersonFormFields): NewPersonInput {
  const affiliation: Affiliation = parseAffiliation(fields.affiliation) ?? AFFILIATIONS[0] ?? "student";
  const input: NewPersonInput = {
    name: fullNameOf(fields),
    firstName: normalizeName(fields.firstName),
    lastName: normalizeName(fields.lastName),
    document: normalizeDocument(fields.document),
    affiliation,
  };
  const middleName = normalizeName(fields.middleName);
  if (middleName !== "") input.middleName = middleName;
  const secondLastName = normalizeName(fields.secondLastName);
  if (secondLastName !== "") input.secondLastName = secondLastName;
  if (fields.birthDate.trim() !== "") input.birthDate = fields.birthDate.trim();
  if (fields.email.trim() !== "") input.email = fields.email.trim();
  return input;
}

/**
 * Lee los campos de un valor que llegó del navegador (una acción de servidor es un endpoint público:
 * no se asume nada del cuerpo).
 *
 * @param value - Dato sin tipar.
 * @returns Los campos; los que falten o no sean texto quedan vacíos.
 */
export function parsePersonFormFields(value: unknown): PersonFormFields {
  const source = typeof value === "object" && value !== null ? value : {};
  const read = (field: PersonFormField): string => {
    const raw: unknown = Reflect.get(source, field);
    return typeof raw === "string" ? raw.slice(0, 200) : "";
  };
  return {
    firstName: read("firstName"),
    middleName: read("middleName"),
    lastName: read("lastName"),
    secondLastName: read("secondLastName"),
    birthDate: read("birthDate"),
    document: read("document"),
    affiliation: read("affiliation"),
    email: read("email"),
  };
}
