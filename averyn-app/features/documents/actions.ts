"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSession } from "@/features/authentication/require-session";
import { capturePath } from "@/features/biometrics/routes";
import { DuplicateDocumentError, personService } from "@/features/identity/services";

import { parseOcrValues, parseUploadMetadata, validatePreRegistration, validateUpload } from "./document-rules";
import { UNREADABLE_DOCUMENT_MESSAGE } from "./labels";
import { documentService } from "./services";
import type { ConfirmDocumentResult, PreRegistrationResult, ReadDocumentResult, UploadDocumentResult } from "./types";

/** Pantallas que muestran documentos y deben recalcularse tras un cambio. */
function revalidateDocuments(): void {
  revalidatePath("/documents");
  revalidatePath("/dashboard");
}

/**
 * Sube un documento y lo procesa con OCR.
 *
 * El contenido del archivo no pasa por aquí: las acciones de servidor tienen un límite de 1 MB. El
 * Core recibirá el archivo por su propia API (ver README); aquí solo viajan sus datos.
 *
 * @param input - Nombre, tamaño, tipo MIME y tipo de documento (se validan: vienen del navegador).
 * @returns Si salió bien, cómo quedó el documento y el mensaje para la persona.
 */
export async function uploadDocumentAction(input: unknown): Promise<UploadDocumentResult> {
  await requireSession();
  const meta = parseUploadMetadata(input);
  const validation = meta === undefined ? undefined : validateUpload(meta);
  if (meta === undefined || validation === undefined || !validation.ok) {
    return { ok: false, message: validation !== undefined && !validation.ok ? validation.error : "No pudimos leer los datos del archivo." };
  }

  const document = await documentService.upload({ kind: validation.kind, fileName: meta.fileName });
  revalidateDocuments();
  return document.status === "processed"
    ? { ok: true, status: document.status, message: "Documento procesado. Los datos están listos para confirmar." }
    : { ok: false, status: document.status, message: UNREADABLE_DOCUMENT_MESSAGE };
}

/**
 * Lee un documento con OCR sin guardarlo (lo usa el pre-registro).
 *
 * @param input - Datos del archivo o de la captura (se validan).
 * @returns Los campos leídos, o el motivo por el que no se pudo leer.
 */
export async function readDocumentAction(input: unknown): Promise<ReadDocumentResult> {
  await requireSession();
  const meta = parseUploadMetadata(input);
  const validation = meta === undefined ? undefined : validateUpload(meta);
  if (meta === undefined || validation === undefined || !validation.ok) {
    return { ok: false, fields: [], message: validation !== undefined && !validation.ok ? validation.error : "No pudimos leer los datos del archivo." };
  }

  const result = await documentService.read({ kind: validation.kind, fileName: meta.fileName });
  return result.ok
    ? { ok: true, fields: result.fields, message: "Datos extraídos correctamente." }
    : { ok: false, fields: [], message: UNREADABLE_DOCUMENT_MESSAGE };
}

/**
 * Confirma los datos que la persona revisó de un documento procesado.
 *
 * @param documentId - Id del documento.
 * @param input - Valores de los seis campos (se validan: vienen del navegador).
 * @returns Si se guardó y el mensaje para la persona.
 */
export async function confirmDocumentAction(documentId: string, input: unknown): Promise<ConfirmDocumentResult> {
  await requireSession();
  const values = parseOcrValues(input);
  if (values === undefined) return { ok: false, message: "No pudimos leer los datos del formulario." };

  const document = await documentService.confirm(documentId, values);
  if (document === undefined) return { ok: false, message: "El documento no existe o todavía no está procesado." };
  revalidateDocuments();
  return { ok: true, message: "Datos confirmados." };
}

/**
 * Da de alta a la persona del pre-registro y sigue a la captura de rostro.
 *
 * Si ya hay una persona con ese documento no se duplica: se continúa con la existente.
 * Si todo sale bien redirige y no vuelve; si no, devuelve el error de cada campo.
 *
 * @param input - Valores revisados, correo y consentimiento (se validan: vienen del navegador).
 * @returns Los errores por campo (solo cuando la validación falla).
 */
export async function registerFromDocumentAction(input: unknown): Promise<PreRegistrationResult> {
  await requireSession();
  const values = parseOcrValues(typeof input === "object" && input !== null ? Reflect.get(input, "values") : undefined);
  const email: unknown = typeof input === "object" && input !== null ? Reflect.get(input, "email") : undefined;
  const consent: unknown = typeof input === "object" && input !== null ? Reflect.get(input, "consent") : undefined;
  if (values === undefined || typeof email !== "string") {
    return { ok: false, errors: { documentNumber: "No pudimos leer los datos del formulario." } };
  }

  const validation = validatePreRegistration({ values, email, consent: consent === true });
  if (!validation.ok) return { ok: false, errors: validation.errors };

  let person = await personService.findByDocument(validation.person.document);
  if (person === undefined) {
    try {
      person = await personService.create(validation.person);
    } catch (error) {
      if (!(error instanceof DuplicateDocumentError)) throw error;
      person = await personService.findByDocument(validation.person.document);
    }
  }
  if (person === undefined) return { ok: false, errors: { documentNumber: "No pudimos registrar a la persona. Inténtalo de nuevo." } };

  revalidatePath("/identity");
  revalidatePath("/dashboard");
  redirect(capturePath({ mode: "enrollment", personId: person.id, method: "face" }));
}
