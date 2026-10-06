import type { LoginCredentials, LoginResult } from "../types";
import type { AuthService } from "./auth-service";

/**
 * [MOCK] Cuenta de demostración del prototipo. No da acceso a nada real.
 * TODO(AVY-005): eliminar junto con `MockAuthService` cuando exista el login contra el Core.
 */
export const MOCK_ACCOUNT = {
  email: "admin@averyn.test",
  password: "Averyn2026",
  role: "Administrador",
} as const;

/** Espera simulada de la red, para que se vea el estado «Verificando…». */
const MOCK_LATENCY_MS = 800;

/**
 * [MOCK] Autenticación simulada con una sola cuenta de demostración.
 * TODO(AVY-005): reemplazar por un cliente HTTP del `POST /auth/login`.
 *
 * Responde como lo haría el Core: un fallo de credenciales es un resultado
 * `AUTH_INVALID_CREDENTIALS`, igual para correo desconocido y contraseña incorrecta.
 */
export class MockAuthService implements AuthService {
  /**
   * @param credentials - Correo y contraseña escritos por la persona.
   * @returns La persona de demostración si coinciden con `MOCK_ACCOUNT`; si no, `AUTH_INVALID_CREDENTIALS`.
   */
  public async login(credentials: LoginCredentials): Promise<LoginResult> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

    const isDemoAccount =
      credentials.email.toLowerCase() === MOCK_ACCOUNT.email && credentials.password === MOCK_ACCOUNT.password;
    if (!isDemoAccount) {
      return { ok: false, code: "AUTH_INVALID_CREDENTIALS" };
    }
    return { ok: true, user: { email: MOCK_ACCOUNT.email, role: MOCK_ACCOUNT.role } };
  }
}
