import type { NewPersonInput, Person } from "../types";

/** Se intentó registrar un documento que ya pertenece a otra persona. */
export class DuplicateDocumentError extends Error {
  constructor(public readonly document: string) {
    super(`Ya existe una persona con el documento ${document}`);
    this.name = "DuplicateDocumentError";
  }
}

/**
 * Frontera entre las pantallas y los datos de personas.
 *
 * Hoy la implementa `MockPersonService`; cuando el Core exponga el módulo de identidad se
 * cambia solo la implementación elegida en `services/index.ts` (coding-standard §79–81).
 */
export interface PersonService {
  /** Todas las personas, en el orden en que se registraron. */
  list(): Promise<Person[]>;
  /** La persona con ese id, o `undefined` si no existe. */
  getById(id: string): Promise<Person | undefined>;
  /** La persona con ese número de documento, o `undefined` si no hay ninguna. */
  findByDocument(document: string): Promise<Person | undefined>;
  /**
   * Registra una persona con estado `pending`.
   *
   * @throws DuplicateDocumentError cuando el documento ya está registrado.
   */
  create(input: NewPersonInput): Promise<Person>;
  /** Elimina a la persona; si no existe no hace nada. */
  remove(id: string): Promise<void>;
}
