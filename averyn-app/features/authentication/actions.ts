"use server";

import { redirect } from "next/navigation";

import { describeLoginError } from "./messages";
import { authService } from "./services";
import { AFTER_LOGIN_PATH, LOGIN_PATH } from "./routes";
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
 * Valida los campos, llama al servicio y, si salió bien, abre la sesión y lleva al
 * dashboard. Si no, devuelve el estado con el error para mostrarlo sin vaciar el formulario.
 *
 * @param _previousState - Estado anterior del formulario (lo exige `useActionState`; no se usa).
 * @param formData - Datos enviados por el formulario.
 * @returns El nuevo estado del formulario cuando el inicio de sesión falla.
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
  redirect(AFTER_LOGIN_PATH);
}

/**
 * Acción de cierre de sesión: cierra la sesión y lleva al login.
 */
export async function logoutAction(): Promise<void> {
  await endMockSession();
  redirect(LOGIN_PATH);
}
