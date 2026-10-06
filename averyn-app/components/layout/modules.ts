import type { IconName } from "@/components/ui/icon";

/** Un módulo de la plataforma tal como aparece en el dock. */
export type AppModule = {
  label: string;
  /** Ruta interna. Sin `href` el módulo aún no existe y se muestra como «Próximamente» (nunca un enlace roto). */
  href?: string;
  icon: IconName;
};

/**
 * Módulos del dock, en el orden en que se muestran.
 *
 * Cada funcionalidad añade su `href` cuando su ruta existe: Identidad (Person),
 * Biometría, OCR y Electoral llegan con sus actividades.
 */
export const APP_MODULES: readonly AppModule[] = [
  { label: "Dashboard", href: "/dashboard", icon: "grid-1x2" },
  { label: "Identidad", href: "/identity", icon: "person-vcard" },
  { label: "Biometría", href: "/biometrics", icon: "fingerprint" },
  { label: "OCR", href: "/documents", icon: "camera" },
  { label: "IA", icon: "cpu" },
  { label: "Electoral", icon: "check2-square" },
  { label: "Accesos", icon: "door-open" },
  { label: "Administración", icon: "gear" },
];

/**
 * Indica si la ruta actual pertenece a un módulo.
 *
 * Un módulo está activo en su ruta y en las de debajo (`/dashboard/detalle`), pero
 * no en rutas que solo comparten el comienzo del texto (`/dashboard-antiguo`).
 *
 * @param pathname - Ruta actual, sin dominio ni query string.
 * @param href - Ruta del módulo, o `undefined` si el módulo aún no tiene pantalla.
 * @returns `true` si el módulo debe mostrarse como actual.
 */
export function isModuleActive(pathname: string, href: string | undefined): boolean {
  if (href === undefined) {
    return false;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
