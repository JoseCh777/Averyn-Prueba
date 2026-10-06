import type { ReactNode } from "react";

import { Breadcrumb } from "@/components/ui/navigation";

/** Un tramo de la ruta de navegación; sin `href` es la página actual. */
export type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  /** Ruta de navegación, de la raíz a la página actual (la última no lleva `href`). */
  crumbs: readonly Crumb[];
  /** Título de la página: es el único `h1`. */
  title: string;
  description?: string;
  /** Botones principales de la página, a la derecha del título. */
  actions?: ReactNode;
};

/**
 * Cabecera común de las pantallas de módulo: migas, título, descripción y acciones.
 *
 * Es un Server Component. Los estilos son `av-page-head*` (`app/styles/av-page.css`).
 *
 * @param props - Las migas, el título, la descripción y las acciones.
 * @returns La cabecera de la página.
 */
export function PageHeader({ crumbs, title, description, actions }: PageHeaderProps) {
  return (
    <header className="av-page-head">
      <div className="av-page-head__text">
        <Breadcrumb items={[...crumbs]} />
        <h1 className="av-page-head__title">{title}</h1>
        {description ? <p className="av-page-head__desc">{description}</p> : null}
      </div>
      {actions ? <div className="av-page-head__actions">{actions}</div> : null}
    </header>
  );
}
