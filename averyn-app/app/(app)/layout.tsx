import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import type { NotificationItem } from "@/components/layout/notifications-menu";
import { ToastProvider } from "@/components/ui/overlay";
import { logoutAction } from "@/features/authentication/actions";
import { LOGIN_PATH } from "@/features/authentication/routes";
import { hasMockSession } from "@/features/authentication/services/mock-session";
import { newestFirst } from "@/features/biometrics/biometric-rules";
import { METHOD_LABEL, OPERATION_LABEL, resultChip } from "@/features/biometrics/labels";
import { HISTORY_PATH, verificationResultPath } from "@/features/biometrics/routes";
import { biometricService } from "@/features/biometrics/services";
import { personService } from "@/features/identity/services";
import { formatDateTime } from "@/lib/date-format";

/**
 * [MOCK] Usuario de demostración.
 * TODO(AVY-005): reemplazar por la persona de la sesión real (`GET /auth/me`).
 */
const DEMO_USER = { name: "Usuario Demo", role: "Administrador", initials: "UD" };

/** Cuántos avisos muestra la campana. */
const NOTIFICATIONS = 5;

/**
 * [MOCK] Últimos eventos biométricos como avisos de la campana.
 *
 * Los eventos de verificación llevan a su pantalla de resultado; los de registro, al historial
 * filtrado por esa persona. Cuando exista el módulo de notificaciones, este mapa se reemplaza
 * por `GET /notifications`.
 * TODO(AVY-006): reemplazar por los avisos reales cuando exista el módulo de notificaciones.
 *
 * @returns Los avisos, del más reciente al más antiguo.
 */
async function recentNotifications(): Promise<NotificationItem[]> {
  const [events, people] = await Promise.all([biometricService.listEvents(), personService.list()]);
  const nameById = new Map(people.map((person) => [person.id, person.name]));
  return newestFirst(events).slice(0, NOTIFICATIONS).map((event) => {
    const chip = resultChip(event.result, event.operation);
    const name = nameById.get(event.personId) ?? "Persona eliminada";
    return {
      id: event.id,
      title: `${OPERATION_LABEL[event.operation]} · ${name}`,
      meta: `${METHOD_LABEL[event.method]} · ${chip.label} · ${formatDateTime(event.at)}`,
      href: event.operation === "verification" ? verificationResultPath(event.id) : `${HISTORY_PATH}?person=${event.personId}`,
    };
  });
}

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
    <AppShell user={DEMO_USER} notifications={await recentNotifications()} onLogout={logoutAction}>
      <ToastProvider>{children}</ToastProvider>
    </AppShell>
  );
}
