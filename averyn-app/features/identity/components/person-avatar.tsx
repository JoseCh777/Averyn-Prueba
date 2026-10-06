import { avatarToneOf, initialsOf } from "../person-rules";
import type { Person } from "../types";

/**
 * Círculo con las iniciales de la persona. El tono sale de su id, así que no cambia entre pantallas.
 * Es decorativo (`aria-hidden`): el nombre siempre está escrito al lado.
 *
 * @param props - La persona y, opcionalmente, el tamaño grande para fichas de detalle.
 * @returns El avatar.
 */
export function PersonAvatar({ person, large = false }: { person: Pick<Person, "id" | "name">; large?: boolean }) {
  return (
    <span className={large ? "av-initials av-initials--lg" : "av-initials"} data-tone={avatarToneOf(person.id)} aria-hidden="true">
      {initialsOf(person.name)}
    </span>
  );
}
