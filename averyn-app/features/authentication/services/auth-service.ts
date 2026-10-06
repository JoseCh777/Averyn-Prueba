import type { LoginCredentials, LoginResult } from "../types";

/**
 * Frontera entre la interfaz de autenticación y quien la resuelve.
 *
 * Hoy la implementa `MockAuthService`; con AVY-005 la reemplaza un cliente HTTP del
 * `POST /auth/login` del Core. La interfaz no cambia, así que la UI y las acciones no
 * se enteran (coding-standard 81: la frontera del mock es una interfaz, no un `if`
 * disperso por la aplicación).
 */
export interface AuthService {
  /**
   * Intenta iniciar sesión.
   *
   * @param credentials - Correo y contraseña escritos por la persona.
   * @returns `ok: true` con la persona, o `ok: false` con el código del error.
   */
  login(credentials: LoginCredentials): Promise<LoginResult>;
}
