import type { AuthErrorCode } from "./types";

const SECONDS_PER_MINUTE = 60;

/**
 * Texto que ve la persona para un error de inicio de sesión.
 *
 * `AUTH_INVALID_CREDENTIALS` lleva siempre el mismo mensaje, sin decir si falló el
 * correo o la contraseña: el Core responde igual en todos los casos para no revelar
 * qué cuentas existen (auth-contract 2.1 y 4).
 *
 * @param code - Código de error del Core.
 * @param retryAfterSeconds - Espera indicada por `Retry-After` en un `429`.
 * @returns Mensaje en español, claro y sin culpar a la persona.
 */
export function describeLoginError(code: AuthErrorCode, retryAfterSeconds?: number): string {
  switch (code) {
    case "AUTH_INVALID_CREDENTIALS":
      return "Credenciales inválidas. Verifica tu correo y contraseña e inténtalo nuevamente.";
    case "AUTH_TOO_MANY_ATTEMPTS":
      return `Demasiados intentos. ${describeWait(retryAfterSeconds)}`;
    case "SERVICE_UNAVAILABLE":
      return "No pudimos conectarnos con el servicio. Inténtalo de nuevo en unos minutos.";
    case "INTERNAL_ERROR":
      return "Algo falló de nuestro lado. Inténtalo de nuevo; si sigue pasando, avisa a tu administrador.";
  }
}

/**
 * @param seconds - Espera en segundos, si el Core la indicó.
 * @returns Frase con el tiempo de espera redondeado hacia arriba a minutos.
 */
function describeWait(seconds?: number): string {
  if (seconds === undefined || seconds <= 0) {
    return "Vuelve a intentarlo en unos minutos.";
  }
  const minutes = Math.ceil(seconds / SECONDS_PER_MINUTE);
  return `Vuelve a intentarlo en ${minutes} ${minutes === 1 ? "minuto" : "minutos"}.`;
}
