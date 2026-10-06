import type { Election, NewElectionInput } from "../types";

/** Se intentó crear un proceso con un nombre que ya está en uso. */
export class DuplicateElectionNameError extends Error {
  constructor(public readonly electionName: string) {
    super(`Ya existe un proceso electoral llamado "${electionName}"`);
    this.name = "DuplicateElectionNameError";
  }
}

/**
 * Frontera entre las pantallas y los procesos electorales.
 *
 * Hoy la implementa `MockElectionService`; cuando el Core exponga el módulo electoral se cambia
 * solo la implementación elegida en `services/index.ts` (coding-standard §79–81).
 */
export interface ElectionService {
  /** Todos los procesos, en el orden en que se crearon. */
  list(): Promise<Election[]>;
  /**
   * Crea un proceso. Siempre empieza como borrador.
   *
   * @throws DuplicateElectionNameError cuando el nombre ya está en uso (sin distinguir mayúsculas ni tildes).
   */
  create(input: NewElectionInput): Promise<Election>;
}
