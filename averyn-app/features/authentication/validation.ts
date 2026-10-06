import type { LoginCredentials, LoginFieldErrors } from "./types";

/** Forma mínima de un correo: algo, una arroba, algo, un punto y algo. La validación real es del Core. */
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export const EMAIL_REQUIRED_MESSAGE = "Ingresa tu correo electrónico.";
export const EMAIL_INVALID_MESSAGE = "Ingresa un correo válido, por ejemplo nombre@organizacion.com.";
export const PASSWORD_REQUIRED_MESSAGE = "Ingresa tu contraseña.";

/**
 * Valida los campos del formulario antes de enviarlos.
 *
 * Es una ayuda de usabilidad: el Core vuelve a validar todo (la validación del
 * frontend no reemplaza la del backend, AGENTS §6). Los mensajes dicen qué hacer, no
 * solo qué está mal.
 *
 * @param credentials - Lo que escribió la persona; el correo ya sin espacios en los bordes.
 * @returns Un mensaje por cada campo inválido; vacío si todo está bien.
 */
export function validateLoginFields(credentials: LoginCredentials): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  if (credentials.email === "") {
    errors.email = EMAIL_REQUIRED_MESSAGE;
  } else if (!EMAIL_PATTERN.test(credentials.email)) {
    errors.email = EMAIL_INVALID_MESSAGE;
  }
  if (credentials.password === "") {
    errors.password = PASSWORD_REQUIRED_MESSAGE;
  }
  return errors;
}

/**
 * @param errors - Errores por campo.
 * @returns `true` si algún campo tiene error.
 */
export function hasFieldErrors(errors: LoginFieldErrors): boolean {
  return errors.email !== undefined || errors.password !== undefined;
}
