import type { AuthService } from "./auth-service";
import { MockAuthService } from "./mock-auth-service";

/**
 * Implementación de `AuthService` que usa la aplicación.
 *
 * Es el único sitio que elige cuál. TODO(AVY-005): cambiar por el cliente HTTP del Core.
 */
export const authService: AuthService = new MockAuthService();
