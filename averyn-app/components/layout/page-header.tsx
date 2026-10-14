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
 * No lleva migas ni ícono: el dock ya dice en qué módulo se está. La presencia viene de la
 * tipografía (Space Grotesk 500 a escala de título), de una línea de 1 px que cierra la cabecera
 * con un tramo corto en azul de señal, y de la firma de arcos del sistema (trazo fino, decorativa).
 * Los estilos son `av-page-head*` (`app/styles/av-page.css`).
 *
 * @param props - El título, la descripción y las acciones.
 * @returns La cabecera de la página.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="av-page-head">
      <svg className="av-page-head__arcs" viewBox="0 0 320 120" aria-hidden="true" focusable="false" preserveAspectRatio="xMaxYMax meet">
        <path d="M24 119 C64 6 232 6 272 119" />
        <path d="M70 119 C98 38 198 38 226 119" />
        <path d="M116 119 C130 74 168 74 182 119" />
      </svg>
      <div className="av-page-head__text">
        <h1 className="av-page-head__title">{title}</h1>
        {description ? <p className="av-page-head__desc">{description}</p> : null}
      </div>
      {actions ? <div className="av-page-head__actions">{actions}</div> : null}
    </header>
  );
}
