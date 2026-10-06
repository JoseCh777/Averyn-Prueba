import type { ReactNode } from "react";
import { AppNavbar, type AppNavbarProps } from "./app-navbar";

type AppShellProps = AppNavbarProps & { children: ReactNode };

/**
 * Estructura común de las pantallas autenticadas: skip link, cabecera de navegación y contenido principal.
 *
 * Es un Server Component: solo compone; la interacción vive en `AppNavbar`.
 *
 * @param props - Los datos de la cabecera (`AppNavbarProps`) y la pantalla a mostrar (`children`).
 * @returns El marco de la pantalla.
 */
export function AppShell({ user, onLogout, unread, children }: AppShellProps) {
  return (
    <>
      <a className="av-skip" href="#contenido">Saltar al contenido</a>
      <AppNavbar user={user} onLogout={onLogout} unread={unread} />
      <main className="av-shell__main" id="contenido">{children}</main>
    </>
  );
}
