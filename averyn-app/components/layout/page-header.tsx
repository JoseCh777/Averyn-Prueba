import type { ReactNode } from "react";

import { Breadcrumb } from "@/components/ui/navigation";
import { Icon, type IconName } from "@/components/ui/icon";

/** Un tramo de la ruta de navegación; sin `href` es la página actual. */
export type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  /** Ruta de navegación, de la raíz a la página actual (la última no lleva `href`). */
  crumbs: readonly Crumb[];
  /** Título de la página: es el único `h1`. */
  title: string;
  /** Ícono del contenedor junto a la espina (paridad con `av-page-header__icon`). */
  icon: IconName;
  description?: string;
  /** Botones principales de la página, a la derecha del título. */
  actions?: ReactNode;
};

/**
 * Cabecera común de las pantallas de módulo: migas, título, descripción y acciones.
 *
 * Estructura paridad con `averyn-frontend`: `__lead` (espina + ícono contenedor) y
 * `__text` (migas + h1 + descripción). Los estilos son `av-page-head*` (`app/styles/av-page.css`).
 *
 * @param props - Las migas, el título, el ícono, la descripción y las acciones.
 * @returns La cabecera de la página.
 */
export function PageHeader({ crumbs, title, icon, description, actions }: PageHeaderProps) {
  return (
    <header className="av-page-head">
      <div className="av-page-head__lead">
        <span className="av-page-head__spine" aria-hidden="true" />
        <span className="av-page-head__icon" aria-hidden="true"><Icon name={icon} /></span>
        <div className="av-page-head__text">
          <Breadcrumb items={[...crumbs]} />
          <h1 className="av-page-head__title">{title}</h1>
          {description ? <p className="av-page-head__desc">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="av-page-head__actions">{actions}</div> : null}
    </header>
  );
}
