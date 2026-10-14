import type { AccessService } from "./access-service";
import { MockAccessService } from "./mock-access-service";

/**
 * Servicio de control en puerta que usa la aplicación: único lugar que elige la implementación.
 * TODO(AVY-048): cambiar `MockAccessService` por el servicio que llama al Core.
 */
export const accessService: AccessService = new MockAccessService();

export { InvalidAccessRequestError } from "./access-service";
export type { AccessService } from "./access-service";
