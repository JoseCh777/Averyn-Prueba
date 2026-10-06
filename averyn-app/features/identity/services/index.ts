import { MockPersonService } from "./mock-person-service";
import type { PersonService } from "./person-service";

/**
 * Servicio de personas que usa la aplicación: único lugar que elige la implementación.
 * TODO(AVY-007): cambiar `MockPersonService` por el servicio que llama al Core.
 */
export const personService: PersonService = new MockPersonService();

export { DuplicateDocumentError } from "./person-service";
export type { PersonService } from "./person-service";
