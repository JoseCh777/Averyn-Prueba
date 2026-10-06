import { Chip, Tag } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";

import { AFFILIATION_ICON, AFFILIATION_LABEL, STATUS_CHIP, STATUS_LABEL } from "../labels";
import type { Affiliation, PersonStatus } from "../types";

/**
 * Etiqueta de afiliación: icono y texto.
 *
 * @param props - La afiliación.
 * @returns La etiqueta.
 */
export function AffiliationTag({ affiliation }: { affiliation: Affiliation }) {
  return (
    <Tag>
      <Icon name={AFFILIATION_ICON[affiliation]} /> {AFFILIATION_LABEL[affiliation]}
    </Tag>
  );
}

/**
 * Chip del estado de verificación: el color siempre va con icono y palabra.
 *
 * @param props - El estado.
 * @returns El chip.
 */
export function StatusChip({ status }: { status: PersonStatus }) {
  const { tone, icon } = STATUS_CHIP[status];
  return (
    <Chip tone={tone} icon={icon}>
      {STATUS_LABEL[status]}
    </Chip>
  );
}
