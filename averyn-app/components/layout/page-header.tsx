import type { ReactNode } from "react";

type PageHeaderProps = {
  /** Título de la página: es el único `h1`. */
  title: string;
  description?: string;
  /** Botones principales de la página, a la derecha del título. */
  actions?: ReactNode;
};

/**
 * Cabecera común de las pantallas de módulo: título, descripción y acciones.
 *
 * No lleva migas de navegación ni ícono: el dock ya dice en qué módulo se está, y la cabecera queda
 * limpia y alineada a la izquierda. Los estilos son `av-page-head*` (`app/styles/av-page.css`).
 *
 * @param props - El título, la descripción y las acciones.
 * @returns La cabecera de la página.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="av-page-head">
      <div className="av-page-head__text">
        <h1 className="av-page-head__title">{title}</h1>
        {description ? <p className="av-page-head__desc">{description}</p> : null}
      </div>
      {actions ? <div className="av-page-head__actions">{actions}</div> : null}
    </header>
  );
}
