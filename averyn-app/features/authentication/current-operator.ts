/**
 * [MOCK] Nombre de quien opera, para dejarlo en el historial de auditoría.
 * TODO(AVY-005): reemplazar por la persona de la sesión real (`GET /auth/me`).
 *
 * @returns El nombre de la persona con la sesión iniciada.
 */
export async function currentOperatorName(): Promise<string> {
  return "Usuario Demo";
}
