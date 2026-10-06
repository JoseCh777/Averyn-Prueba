import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { logoutAction } from "@/features/authentication/actions";
import { LOGIN_PATH } from "@/features/authentication/routes";
import { hasMockSession } from "@/features/authentication/services/mock-session";

/**
 * [MOCK] Usuario de demostración.
 * TODO(AVY-005): reemplazar por la persona de la sesión real (`GET /auth/me`).
 */
const DEMO_USER = { name: "Usuario Demo", role: "Administrador", initials: "UD" };

/**
 * [MOCK] Notificaciones sin leer de demostración.
 * TODO(AVY-006): reemplazar por el conteo real cuando exista el módulo de notificaciones.
 */
const DEMO_UNREAD = 3;

/**
 * Layout de las pantallas con sesión iniciada: sin sesión lleva al login; con ella,
 * les pone el App Shell alrededor.
 *
 * El guard solo mejora la experiencia: la autoridad sobre la sesión es el Core (AGENTS §6).
 * TODO(AVY-005): decidirlo con `GET /auth/me` en lugar de la cookie de demostración.
 *
 * @param props - La pantalla a mostrar.
 * @returns El shell con la pantalla dentro.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasMockSession())) {
    redirect(LOGIN_PATH);
  }
  return (
    <AppShell user={DEMO_USER} unread={DEMO_UNREAD} onLogout={logoutAction}>
      {children}
    </AppShell>
  );
}
