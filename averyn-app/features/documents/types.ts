/** Tipos de documento que acepta la plataforma. */
export type DocumentKind = "cc" | "ce" | "ti" | "passport" | "institutional";

/** Estado del procesamiento OCR de un documento. */
export type DocumentStatus = "processed" | "processing" | "failed";

/** Campos que el OCR extrae de un documento de identidad. */
export type OcrFieldKey = "firstName" | "middleName" | "firstSurname" | "secondSurname" | "documentNumber" | "birthDate";

/** Un campo leído por el OCR. */
export interface OcrField {
  key: OcrFieldKey;
  /** Lo que leyó el OCR (vacío si el documento no trae ese dato, p. ej. segundo nombre). */
  value: string;
  /** Confianza de la lectura, de 0 a 100; `null` si el campo salió vacío (no hay nada que revisar). */
  confidence: number | null;
}

/** Un documento subido a la plataforma. */
export interface DocumentRecord {
  id: string;
  kind: DocumentKind;
  fileName: string;
  /** Instante de la carga, en ISO 8601. */
  uploadedAt: string;
  status: DocumentStatus;
  /** Campos leídos; vacío salvo que el estado sea `processed`. */
  fields: OcrField[];
  /** La persona ya revisó y confirmó los datos. */
  confirmed: boolean;
}

/** Datos del archivo que viajan al servidor (el contenido lo recibirá el Core; ver README). */
export interface UploadMetadata {
  fileName: string;
  sizeBytes: number;
  mimeType: string;
  kind: string;
}

/** Resultado de leer un documento con OCR. */
export type OcrReadResult = { ok: true; fields: OcrField[] } | { ok: false; reason: "unreadable" };

/** Conteos de los indicadores. */
export interface DocumentsSummary {
  total: number;
  processed: number;
  processing: number;
  failed: number;
}

/** Valores de los campos tal como los edita la persona, por clave. */
export type OcrValues = Record<OcrFieldKey, string>;

/** Resultado de subir un documento. */
export interface UploadDocumentResult {
  ok: boolean;
  message: string;
  status?: DocumentStatus;
}

/** Resultado de confirmar los datos de un documento. */
export interface ConfirmDocumentResult {
  ok: boolean;
  message: string;
}

/** Campos de la acción que registra a una persona desde el pre-registro. */
export type PreRegistrationField = OcrFieldKey | "email" | "consent";

/** Resultado de leer un documento desde el pre-registro. */
export interface ReadDocumentResult {
  ok: boolean;
  message: string;
  fields: OcrField[];
}

/** Resultado de registrar a la persona desde el pre-registro (si sale bien, la acción redirige y no devuelve). */
export interface PreRegistrationResult {
  ok: false;
  errors: Partial<Record<PreRegistrationField, string>>;
}
