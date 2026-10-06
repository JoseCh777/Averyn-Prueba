import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";

/**
 * Se muestra cuando la persona no existe o fue eliminada.
 *
 * @returns El aviso con el camino de vuelta al listado.
 */
export default function PersonNotFound() {
  return (
    <EmptyState
      icon="person-x"
      title="No encontramos a esa persona"
      action={<ButtonLink href="/identity">Volver al listado</ButtonLink>}
    >
      Puede que se haya eliminado o que el enlace no sea correcto.
    </EmptyState>
  );
}
