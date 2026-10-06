/** Afiliación de una persona con la institución. */
export type Affiliation = "student" | "teacher" | "staff" | "visitor";

/** Estado de verificación de identidad. Una persona nueva empieza `pending` hasta que se verifica. */
export type PersonStatus = "verified" | "pending";

/** Una persona registrada en el catálogo de identidad. */
export interface Person {
  id: string;
  name: string;
  /** Número de documento: solo dígitos. */
  document: string;
  affiliation: Affiliation;
  status: PersonStatus;
}

/** Datos del formulario «Nueva persona». */
export interface NewPersonInput {
  name: string;
  document: string;
  affiliation: Affiliation;
}

/** Filtros del listado: texto libre (nombre o documento) y estado. */
export interface PeopleFilter {
  query: string;
  status: PersonStatus | "all";
}

/** Conteos que muestran los indicadores del listado. */
export interface PeopleSummary {
  total: number;
  verified: number;
  pending: number;
  /** Porcentaje de personas verificadas, entero de 0 a 100 (0 si no hay personas). */
  verificationRate: number;
}

/** Campos del formulario que pueden traer un error. */
export type NewPersonField = "name" | "document" | "affiliation";

/** Estado del formulario «Nueva persona» entre envíos (`useActionState`). */
export interface NewPersonFormState {
  status: "idle" | "error" | "created";
  /** Mensaje por campo; vacío si no hay errores. */
  errors: Partial<Record<NewPersonField, string>>;
  /** Lo último que escribió la persona, para no borrarlo si hay un error. */
  values: { name: string; document: string; affiliation: string };
  /** Nombre de la persona creada, para el aviso de éxito. */
  createdName?: string;
}

/** Resultado de eliminar a una persona. */
export interface DeletePersonResult {
  ok: boolean;
  message: string;
}
