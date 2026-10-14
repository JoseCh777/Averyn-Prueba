"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";

import { IconButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useDismiss } from "./use-dismiss";

/** Un aviso del menú de notificaciones: título, meta y a dónde lleva. */
export type NotificationItem = { id: string; title: string; meta: string; href: string };

/**
 * Campana de notificaciones: abre un menú con los avisos más recientes.
 *
 * Hoy son los últimos eventos biométricos que arma el layout de servidor (mock); cuando exista
 * el módulo de notificaciones este componente solo cambiará la fuente de `items`.
 * Con la X de cerrar o Escape se cierra (`useDismiss`), igual que el menú de usuario.
 *
 * @param props - Los avisos a mostrar; sin ninguno el menú lo dice.
 * @returns El botón de la campana y su menú.
 */
export function NotificationsMenu({ items }: { items: readonly NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useId();

  useDismiss(open, root, (reason) => {
    setOpen(false);
    if (reason === "escape") button.current?.focus();
  });

  const count = items.length;
  return (
    <div className="av-shell__user" ref={root}>
      <IconButton
        ref={button}
        aria-label={count > 0 ? `Notificaciones, ${count} avisos recientes` : "Notificaciones"}
        badge={count > 0 ? count : undefined}
        aria-expanded={open}
        aria-controls={menu}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="bell" />
      </IconButton>
      <div className="av-menu" id={menu} role="menu" aria-label="Notificaciones" hidden={!open}>
        {count === 0 ? (
          <p className="av-shell__menu-empty">Sin notificaciones.</p>
        ) : (
          items.map((item) => (
            <Link key={item.id} role="menuitem" href={item.href} onClick={() => setOpen(false)}>
              <b>{item.title}</b>
              <small>{item.meta}</small>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
