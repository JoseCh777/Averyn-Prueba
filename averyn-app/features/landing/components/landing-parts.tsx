import type { LandingItem } from "../content";

interface MediaSlotProps {
  className: string;
  /** Texto del espacio vacío, p. ej. «Imagen · 4:5». */
  hint: string;
}

/**
 * Espacio reservado para una imagen o un video futuros. Mantiene su proporción
 * (definida en la hoja de estilos) para que el diseño no cambie al agregar el medio.
 *
 * @returns El marco con la indicación.
 */
export function MediaSlot({ className, hint }: MediaSlotProps) {
  return (
    <div className={`mn-media ${className}`}>
      <span className="mn-media__hint mn-mono">{hint}</span>
    </div>
  );
}

/**
 * Rótulo en mono que precede al título de una sección.
 *
 * @returns El rótulo.
 */
export function SectionLabel({ children }: { children: string }) {
  return <span className="mn-label mn-mono">{children}</span>;
}

interface ItemListProps {
  className: string;
  items: readonly LandingItem[];
}

/**
 * Lista de elementos con título y descripción separados por líneas de 1 px.
 *
 * @returns La lista.
 */
export function ItemList({ className, items }: ItemListProps) {
  return (
    <div className={className}>
      {items.map((item) => (
        <article key={item.title} className="mn-item">
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}
