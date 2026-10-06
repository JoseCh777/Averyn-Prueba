import { useEffect, type RefObject } from "react";

/** Por qué se pide cerrar un elemento desplegable. */
export type DismissReason = "outside-click" | "escape";

/**
 * Cierra un elemento desplegable con un clic fuera de él o con Escape.
 *
 * Los oyentes solo existen mientras `open` es verdadero. Quien lo usa decide qué
 * hacer al cerrar: normalmente, con Escape devuelve el foco al botón que abrió el
 * elemento y con un clic fuera no (el clic ya movió el foco).
 *
 * @param open - Si el elemento está abierto.
 * @param container - Contenedor del botón y del elemento; un clic dentro no lo cierra.
 * @param onDismiss - Se llama con el motivo del cierre.
 */
export function useDismiss(
  open: boolean,
  container: RefObject<HTMLElement | null>,
  onDismiss: (reason: DismissReason) => void,
): void {
  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      const insideContainer = event.target instanceof Node && container.current?.contains(event.target);
      if (!insideContainer) onDismiss("outside-click");
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss("escape");
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, container, onDismiss]);
}
