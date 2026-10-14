/** Afiliación de una persona con la institución. */
export type Affiliation = "student" | "teacher" | "staff" | "visitor";

/** Estado de verificación de identidad. Una persona nueva empieza `pending` hasta que se verifica. */
export type PersonStatus = "verified" | "pending";

/** Una persona registrada en el catálogo de identidad. */
export interface Person {
  id: string;
  /** Nombre completo para mostrar: nombres y apellidos en ese orden. */
  name: string;
  /** Partes del nombre, si se registraron por separado (person-contract 2.1). */
  firstName?: string;
  middleName?: string;
  lastName?: string;
  secondLastName?: string;
  /** Número de documento: solo dígitos. */
  document: string;
  affiliation: Affiliation;
  status: PersonStatus;
  /** Fecha de nacimiento (`aaaa-mm-dd`), si se registró. */
  birthDate?: string;
  /** Correo de contacto, si se registró. */
  email?: string;
}

/** Datos del formulario «Nueva persona». */
export interface NewPersonInput {
  /** Nombre completo para mostrar; se arma con las partes. */
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  secondLastName?: string;
  document: string;
  affiliation: Affiliation;
  birthDate?: string;
  email?: string;
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

/** Resultado de eliminar a una persona. */
export interface DeletePersonResult {
  ok: boolean;
  message: string;
}
