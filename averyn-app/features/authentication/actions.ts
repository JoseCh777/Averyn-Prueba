"use server";

import { redirect } from "next/navigation";

import { describeLoginError, LOGIN_SUCCESS_MESSAGE } from "./messages";
import { authService } from "./services";
import { LOGIN_PATH } from "./routes";
import { endMockSession, startMockSession } from "./services/mock-session";
import type { LoginFormState } from "./types";
import { hasFieldErrors, validateLoginFields } from "./validation";

/**
 * Lee un campo de texto del formulario.
 *
 * Los datos de un formulario son externos: no se asume que sean texto (coding-standard 7).
 *
 * @param formData - Datos enviados.
 * @param name - Nombre del campo.
 * @returns El texto, o cadena vacía si no es texto.
 */
function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

/**
 * Acción del formulario de inicio de sesión.
 *
 * Valida los campos, llama al servicio y, si salió bien, abre la sesión y devuelve el
 * mensaje de éxito: el formulario muestra la alerta, mantiene el botón bloqueado un
 * momento (como `login.js` del frontend original) y entonces navega al dashboard.
 * Si algo falla, devuelve el estado con el error para mostrarlo sin vaciar el formulario.
 *
 * @param _previousState - Estado anterior del formulario (lo exige `useActionState`; no se usa).
 * @param formData - Datos enviados por el formulario.
 * @returns El nuevo estado del formulario.
 */
export async function loginAction(_previousState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const credentials = { email: readText(formData, "email").trim(), password: readText(formData, "password") };

  const fieldErrors = validateLoginFields(credentials);
  if (hasFieldErrors(fieldErrors)) {
    return { email: credentials.email, fieldErrors };
  }

  const result = await authService.login(credentials);
  if (!result.ok) {
    return {
      email: credentials.email,
      fieldErrors: {},
      errorMessage: describeLoginError(result.code, result.retryAfterSeconds),
    };
  }

  await startMockSession();
  return { email: credentials.email, fieldErrors: {}, successMessage: LOGIN_SUCCESS_MESSAGE };
}

/**
 * Acción de cierre de sesión: cierra la sesión y lleva al login.
 */
export async function logoutAction(): Promise<void> {
  await endMockSession();
  redirect(LOGIN_PATH);
}
