import { redirect } from "next/navigation";

import { LOGIN_PATH } from "./routes";
import { hasMockSession } from "./services/mock-session";

/**
 * Exige una sesión abierta en una acción de servidor: sin ella lleva al login.
 *
 * Las acciones de servidor son endpoints públicos: no basta con que la pantalla esté
 * protegida por el layout, cada acción que cambia datos debe comprobar la sesión (AGENTS §6).
 * TODO(AVY-005): decidirlo con `GET /auth/me` en lugar de la cookie de demostración.
 *
 * @throws Redirige a `LOGIN_PATH` cuando no hay sesión (no vuelve).
 */
export async function requireSession(): Promise<void> {
  if (!(await hasMockSession())) {
    redirect(LOGIN_PATH);
  }
}
