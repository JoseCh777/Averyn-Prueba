import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { IDENTITY_PATH } from "../routes";
import { NewPersonWorkspace } from "./new-person-workspace";

/**
 * Pantalla «Nueva persona» (`/identity/new`): cabecera y el formulario con su vista previa.
 *
 * Es un Server Component: el formulario es el único Client Component porque maneja el envío y el
 * foco. El Core será la autoridad sobre lo que se guarda (AGENTS §6).
 *
 * @returns La pantalla de alta.
 */
export function NewPersonView() {
  return (
    <div className="av-page idn-new" role="region" aria-label="Alta de persona">
      <PageHeader
        title="Nueva persona"
        description="Registre a una persona en el catálogo. Podrá verificar su identidad después."
        actions={
          <ButtonLink href={IDENTITY_PATH}>
            <Icon name="arrow-left" /> Volver a personas
          </ButtonLink>
        }
      />
      <NewPersonWorkspace />
    </div>
  );
}
