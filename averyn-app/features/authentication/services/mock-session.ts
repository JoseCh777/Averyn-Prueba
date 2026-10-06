import { cookies } from "next/headers";

/** Cookie de la sesión de demostración. No es el `averyn_at` del contrato: esa la fijará el Core. */
const MOCK_SESSION_COOKIE = "averyn_mock_session";

/** Duración de la sesión de demostración: una jornada. */
const MOCK_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

/**
 * [MOCK] Abre la sesión de demostración con una cookie `HttpOnly`.
 *
 * La cookie no guarda ningún dato ni token; solo marca que se inició sesión. Así el
 * guard de las pantallas y el cierre de sesión funcionan igual que lo harán con las
 * cookies reales del Core, y no se usa `localStorage` (auth-contract 1.3).
 * TODO(AVY-005): eliminar; la sesión la fija el Core en `POST /auth/login`.
 *
 * Server-only: usa `next/headers`.
 */
export async function startMockSession(): Promise<void> {
  const store = await cookies();
  store.set(MOCK_SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MOCK_SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * [MOCK] Indica si hay una sesión de demostración abierta.
 * TODO(AVY-005): reemplazar por `GET /auth/me`.
 *
 * @returns `true` si la cookie de demostración está presente.
 */
export async function hasMockSession(): Promise<boolean> {
  const store = await cookies();
  return store.has(MOCK_SESSION_COOKIE);
}

/**
 * [MOCK] Cierra la sesión de demostración.
 * TODO(AVY-005): reemplazar por `POST /auth/logout`.
 */
export async function endMockSession(): Promise<void> {
  const store = await cookies();
  store.delete(MOCK_SESSION_COOKIE);
}
