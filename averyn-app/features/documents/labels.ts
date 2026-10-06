import type { ChipTone } from "@/components/ui/feedback";
import type { IconName } from "@/components/ui/icon";

import type { DocumentKind, DocumentStatus, OcrFieldKey } from "./types";

/** Todos los tipos de documento, en el orden del formulario de carga. */
export const DOCUMENT_KINDS: readonly DocumentKind[] = ["cc", "ce", "ti", "passport", "institutional"];

/** Tipos de documento de identidad que ofrece el pre-registro (sin el carnet institucional). */
export const IDENTITY_DOCUMENT_KINDS: readonly DocumentKind[] = ["cc", "ce", "ti", "passport"];

export const DOCUMENT_KIND_LABEL: Record<DocumentKind, string> = {
  cc: "Cédula de ciudadanía",
  ce: "Cédula de extranjería",
  ti: "Tarjeta de identidad",
  passport: "Pasaporte",
  institutional: "Carnet institucional",
};

/** Abreviatura para los botones del selector segmentado. */
export const DOCUMENT_KIND_SHORT: Record<DocumentKind, string> = {
  cc: "C.C.",
  ce: "C.E.",
  ti: "T.I.",
  passport: "Pasaporte",
  institutional: "Carnet",
};

export const DOCUMENT_KIND_ICON: Record<DocumentKind, IconName> = {
  cc: "card-text",
  ce: "card-text",
  ti: "card-text",
  passport: "book",
  institutional: "person-badge",
};

export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
  processed: "Procesado",
  processing: "En proceso",
  failed: "Error",
};

/** Tono e icono del chip de cada estado: el color nunca va solo. */
export const DOCUMENT_STATUS_CHIP: Record<DocumentStatus, { tone: ChipTone; icon: IconName }> = {
  processed: { tone: "success", icon: "check-circle" },
  processing: { tone: "info", icon: "arrow-repeat" },
  failed: { tone: "error", icon: "x-circle" },
};

/** Orden de los campos en los formularios de revisión. */
export const OCR_FIELD_KEYS: readonly OcrFieldKey[] = ["firstName", "middleName", "firstSurname", "secondSurname", "documentNumber", "birthDate"];

export const OCR_FIELD_LABEL: Record<OcrFieldKey, string> = {
  firstName: "Primer nombre",
  middleName: "Segundo nombre",
  firstSurname: "Primer apellido",
  secondSurname: "Segundo apellido",
  documentNumber: "Número de identificación",
  birthDate: "Fecha de nacimiento",
};

/** Aviso cuando el OCR no logra leer el documento (microcopy aprobado). */
export const UNREADABLE_DOCUMENT_MESSAGE = "No pudimos leer el documento. Verifica que la imagen esté completa y sin reflejos.";
