import { parseBirthDate, validateEmail, validateNewPerson } from "@/features/identity/person-rules";
import type { NewPersonInput } from "@/features/identity/types";
import { limaDay } from "@/lib/date-format";

import { DOCUMENT_KINDS, OCR_FIELD_KEYS } from "./labels";
import type { DocumentKind, DocumentRecord, DocumentsSummary, OcrField, OcrValues, PreRegistrationField, UploadMetadata } from "./types";

/** Tamaño máximo de un archivo: 10 MB. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Extensiones y tipos MIME que se aceptan. */
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|pdf)$/i;
const ALLOWED_MIME_TYPES: readonly string[] = ["image/jpeg", "image/png", "application/pdf"];

/**
 * Interpreta el tipo de documento recibido de un formulario.
 *
 * @param value - Valor sin validar.
 * @returns El tipo, o `undefined` si no es uno de los conocidos.
 */
export function parseDocumentKind(value: unknown): DocumentKind | undefined {
  return DOCUMENT_KINDS.find((kind) => kind === value);
}

/** Resultado de validar un archivo antes de procesarlo. */
export type UploadValidation = { ok: true; kind: DocumentKind } | { ok: false; error: string };

/**
 * Interpreta los datos del archivo recibidos por una acción de servidor.
 *
 * Los argumentos de una acción vienen del navegador y no se asumen.
 *
 * @param input - Valor sin validar.
 * @returns Los datos del archivo, o `undefined` si la forma no es la esperada.
 */
export function parseUploadMetadata(input: unknown): UploadMetadata | undefined {
  if (typeof input !== "object" || input === null) return undefined;
  const fileName: unknown = Reflect.get(input, "fileName");
  const sizeBytes: unknown = Reflect.get(input, "sizeBytes");
  const mimeType: unknown = Reflect.get(input, "mimeType");
  const kind: unknown = Reflect.get(input, "kind");
  if (typeof fileName !== "string" || typeof mimeType !== "string" || typeof kind !== "string") return undefined;
  if (typeof sizeBytes !== "number" || !Number.isFinite(sizeBytes) || fileName.length > 255) return undefined;
  return { fileName, sizeBytes, mimeType, kind };
}

/**
 * Valida un archivo antes de subirlo: tipo de documento, formato y tamaño.
 *
 * Se usa en el navegador (para avisar al instante) y en el servidor (que no confía en el navegador).
 *
 * @param meta - Nombre, tamaño, tipo MIME y tipo de documento elegido.
 * @returns El tipo de documento, o el mensaje del primer problema encontrado.
 */
export function validateUpload(meta: UploadMetadata): UploadValidation {
  const kind = parseDocumentKind(meta.kind);
  if (kind === undefined) return { ok: false, error: "Elige el tipo de documento." };
  if (meta.fileName.trim() === "") return { ok: false, error: "Elige un archivo." };
  if (!ALLOWED_EXTENSIONS.test(meta.fileName) || (meta.mimeType !== "" && !ALLOWED_MIME_TYPES.includes(meta.mimeType))) {
    return { ok: false, error: "Formato no permitido: usa JPG, PNG o PDF." };
  }
  if (meta.sizeBytes <= 0) return { ok: false, error: "El archivo está vacío." };
  if (meta.sizeBytes > MAX_UPLOAD_BYTES) return { ok: false, error: `El archivo pesa ${formatFileSize(meta.sizeBytes)}: el máximo es 10 MB.` };
  return { ok: true, kind };
}

/**
 * Tamaño legible de un archivo.
 *
 * @param bytes - Tamaño en bytes.
 * @returns Por ejemplo `340 KB` o `2,5 MB`.
 */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1).replace(".", ",")} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Cuenta documentos por estado para los indicadores.
 *
 * @param documents - Todos los documentos.
 * @returns Total y conteo por estado.
 */
export function summarizeDocuments(documents: readonly DocumentRecord[]): DocumentsSummary {
  const count = (status: DocumentRecord["status"]) => documents.filter((document) => document.status === status).length;
  return { total: documents.length, processed: count("processed"), processing: count("processing"), failed: count("failed") };
}

/**
 * Valores iniciales de un formulario de revisión: lo que leyó el OCR, campo por campo.
 *
 * @param fields - Campos leídos.
 * @returns Un valor por cada clave; los campos que faltan quedan vacíos.
 */
export function valuesOf(fields: readonly OcrField[]): OcrValues {
  const values: OcrValues = { firstName: "", middleName: "", firstSurname: "", secondSurname: "", documentNumber: "", birthDate: "" };
  for (const field of fields) values[field.key] = field.value;
  return values;
}

/**
 * Nombre completo a partir de los campos del documento.
 *
 * @param values - Valores de los campos.
 * @returns Nombres y apellidos separados por un espacio, sin huecos.
 */
export function fullNameOf(values: OcrValues): string {
  return [values.firstName, values.middleName, values.firstSurname, values.secondSurname]
    .map((part) => part.trim())
    .filter((part) => part !== "")
    .join(" ");
}

/**
 * Campos con su orden de pantalla, rellenando con vacíos los que el OCR no devolvió.
 *
 * @param fields - Campos leídos.
 * @returns Siempre los seis campos, en el orden de `OCR_FIELD_KEYS`.
 */
export function orderedFields(fields: readonly OcrField[]): OcrField[] {
  return OCR_FIELD_KEYS.map((key) => fields.find((field) => field.key === key) ?? { key, value: "", confidence: null });
}

/** Largo máximo de un valor recibido de un formulario de revisión. */
const OCR_VALUE_MAX_LENGTH = 120;

/**
 * Interpreta los valores de un formulario de revisión recibidos por una acción de servidor.
 *
 * Los argumentos de una acción vienen del navegador y no se asumen: debe ser un objeto con los
 * seis campos como texto de largo razonable.
 *
 * @param input - Valor sin validar.
 * @returns Los valores, o `undefined` si la forma no es la esperada.
 */
export function parseOcrValues(input: unknown): OcrValues | undefined {
  if (typeof input !== "object" || input === null) return undefined;
  const values: OcrValues = { firstName: "", middleName: "", firstSurname: "", secondSurname: "", documentNumber: "", birthDate: "" };
  for (const key of OCR_FIELD_KEYS) {
    const value: unknown = Reflect.get(input, key);
    if (typeof value !== "string" || value.length > OCR_VALUE_MAX_LENGTH) return undefined;
    values[key] = value;
  }
  return values;
}

/** Lo que el pre-registro necesita para dar de alta a la persona. */
export interface PreRegistrationInput {
  values: OcrValues;
  email: string;
  consent: boolean;
}

/** Resultado de validar el pre-registro. */
export type PreRegistrationValidation =
  | { ok: true; person: NewPersonInput }
  | { ok: false; errors: Partial<Record<PreRegistrationField, string>> };

/**
 * Valida el pre-registro y arma a la persona que se dará de alta (siempre como visitante pendiente).
 *
 * @param input - Valores revisados, correo y consentimiento.
 * @param today - Instante de referencia (se inyecta en las pruebas).
 * @returns La persona lista para registrar o un mensaje por cada campo con problema.
 */
export function validatePreRegistration(input: PreRegistrationInput, today: Date = new Date()): PreRegistrationValidation {
  const { values } = input;
  const errors: Partial<Record<PreRegistrationField, string>> = {};

  if (!input.consent) errors.consent = "Confirma el consentimiento para continuar.";
  if (values.firstName.trim() === "") errors.firstName = "Escribe el primer nombre.";
  if (values.firstSurname.trim() === "") errors.firstSurname = "Escribe el primer apellido.";

  const person = validateNewPerson({ name: fullNameOf(values), document: values.documentNumber, affiliation: "visitor" });
  if (!person.ok) {
    if (person.errors.name !== undefined && errors.firstName === undefined && errors.firstSurname === undefined) errors.firstName = person.errors.name;
    if (person.errors.document !== undefined) errors.documentNumber = person.errors.document;
  }

  const birthDate = parseBirthDate(values.birthDate, limaDay(today));
  if (birthDate === undefined) errors.birthDate = "Escribe una fecha de nacimiento válida con el formato dd/mm/aaaa.";

  const emailError = validateEmail(input.email);
  if (emailError !== undefined) errors.email = emailError;

  if (Object.keys(errors).length > 0 || !person.ok || birthDate === undefined) return { ok: false, errors };
  const email = input.email.trim();
  return { ok: true, person: { ...person.input, birthDate, ...(email === "" ? {} : { email }) } };
}
