import { Chip } from "@/components/ui/feedback";

import { METHOD_ICON, METHOD_LABEL, METHODS } from "../labels";
import type { PickerPerson } from "../types";

/**
 * Chips con las modalidades que tiene registradas una persona, o «Sin registro».
 *
 * @param props - El perfil de la persona.
 * @returns Los chips.
 */
export function ProfileChips({ profile }: { profile: PickerPerson["profile"] }) {
  const registered = METHODS.filter((method) => profile[method]);
  if (registered.length === 0) return <span className="av-cell-sub">Sin registro</span>;
  return (
    <span className="av-chips">
      {registered.map((method) => (
        <Chip key={method} tone="info" icon={METHOD_ICON[method]}>
          {METHOD_LABEL[method]}
        </Chip>
      ))}
    </span>
  );
}
