/** Credenciales que escribe la persona en el formulario de inicio de sesión. */
export type LoginCredentials = {
  email: string;
  password: string;
};

/** Persona autenticada, tal como la muestra la interfaz. */
export type AuthenticatedUser = {
  email: string;
  role: string;
};

/**
 * Códigos de error de `POST /auth/login` que el frontend sabe tratar (auth-contract 2.1 y 1.2).
 *
 * El frontend decide el texto según el `code`; los textos del Core son técnicos en inglés.
 */
export type AuthErrorCode =
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_TOO_MANY_ATTEMPTS"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

/** Resultado de un intento de inicio de sesión. Un fallo de credenciales es un resultado válido, no una excepción. */
export type LoginResult =
  | { ok: true; user: AuthenticatedUser }
  | { ok: false; code: AuthErrorCode; retryAfterSeconds?: number };

/** Errores de validación por campo, antes de llamar al servicio. */
export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

/** Estado del formulario entre envíos (`useActionState`). */
export type LoginFormState = {
  /** Correo escrito; se devuelve para que el formulario no se vacíe tras un error. */
  email: string;
  fieldErrors: LoginFieldErrors;
  /** Mensaje general (credenciales inválidas, demasiados intentos, fallo del servicio). */
  errorMessage?: string;
  /** Mensaje de éxito: el formulario espera un momento con el botón bloqueado y luego navega. */
  successMessage?: string;
};

/** Estado inicial del formulario. */
export const INITIAL_LOGIN_FORM_STATE: LoginFormState = { email: "", fieldErrors: {} };
