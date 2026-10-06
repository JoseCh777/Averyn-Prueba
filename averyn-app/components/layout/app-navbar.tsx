"use client";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandChip, Dock } from "@/components/ui/navigation";
import { IconButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { APP_MODULES, isModuleActive } from "./modules";
import { useDismiss } from "./use-dismiss";

/** Logo de la cabecera: wordmark negro, pensado para la zona clara del Design System. */
const BRAND_LOGO_SRC = "/assets/images/averyn-logo-font-black.avif";

/** Persona con la sesión iniciada, tal como se muestra en la cabecera. */
export type AppUser = { name: string; role: string; initials: string };

export type AppNavbarProps = {
  user: AppUser;
  /** Si se entrega, el menú de usuario muestra «Cerrar sesión» y la llama. */
  onLogout?: () => void | Promise<void>;
  /** Notificaciones sin leer; con 0 no se muestra la insignia. */
  unread?: number;
};

/**
 * Cabecera de la aplicación: marca, dock de módulos, búsqueda, notificaciones y menú de usuario.
 *
 * Es un Client Component porque marca el módulo actual con `usePathname` y porque el
 * buscador y el menú de usuario guardan su estado abierto/cerrado.
 *
 * @param props - Usuario a mostrar, acción de cierre de sesión y notificaciones sin leer.
 * @returns El `<header>` de navegación.
 */
export function AppNavbar({ user, onLogout, unread = 0 }: AppNavbarProps) {
  const pathname = usePathname();
  const items = APP_MODULES.map((module) => ({ ...module, current: isModuleActive(pathname, module.href) }));

  return (
    <header className="av-nav av-shell__nav">
      <BrandChip logoSrc={BRAND_LOGO_SRC} />
      <Dock items={items} label="Navegación principal" />
      <div className="av-shell__actions">
        <ExpandableSearch />
        <IconButton aria-label={unread > 0 ? `Notificaciones, ${unread} sin leer` : "Notificaciones"} badge={unread > 0 ? unread : undefined}>
          <Icon name="bell" />
        </IconButton>
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}

/**
 * Buscador compacto: el botón abre el campo y le da el foco.
 *
 * Escape o un clic fuera lo cierran (`useDismiss`); con Escape el foco vuelve al botón.
 * Todavía no ejecuta ninguna búsqueda: no existe el módulo que la respondería.
 *
 * @returns El botón de búsqueda y su campo.
 */
function ExpandableSearch() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useDismiss(open, root, (reason) => {
    setOpen(false);
    if (reason === "escape") button.current?.focus();
  });

  return (
    <div className={`av-shell__search${open ? " is-open" : ""}`} ref={root}>
      <IconButton ref={button} aria-label="Buscar" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <Icon name="search" />
      </IconButton>
      <input
        ref={input}
        id={id}
        type="search"
        aria-label="Buscar en Averyn"
        placeholder="Buscar…"
        hidden={!open}
      />
    </div>
  );
}

/**
 * Botón de usuario con su menú desplegable.
 *
 * Con `onLogout` el menú ofrece «Cerrar sesión»; sin él, avisa de que no hay acciones.
 *
 * @param props - Usuario a mostrar y acción de cierre de sesión, si existe.
 * @returns El botón de usuario y su menú.
 */
function UserMenu({ user, onLogout }: Pick<AppNavbarProps, "user" | "onLogout">) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useId();

  useDismiss(open, root, (reason) => {
    setOpen(false);
    if (reason === "escape") button.current?.focus();
  });

  return (
    <div className="av-shell__user" ref={root}>
      <button ref={button} className="av-avatar" type="button" aria-label={`Menú de usuario, ${user.name}`} aria-haspopup="menu" aria-expanded={open} aria-controls={menu} onClick={() => setOpen((o) => !o)}>
        <span className="av-avatar__c" aria-hidden="true">{user.initials}</span>
        <span><b>{user.name}</b><small>{user.role}</small></span>
        <Icon name="chevron-down" className="av-shell__chevron" />
      </button>
      <div className="av-menu" id={menu} role="menu" aria-label="Menú de usuario" hidden={!open}>
        {onLogout ? (
          <button type="button" role="menuitem" onClick={() => { setOpen(false); void onLogout(); }}>
            <Icon name="box-arrow-right" />Cerrar sesión
          </button>
        ) : (
          <p className="av-shell__menu-empty">Sin acciones disponibles.</p>
        )}
      </div>
    </div>
  );
}
