import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

import { PreRegistrationWizard } from "./pre-registration-wizard";

/**
 * Pantalla del pre-registro: captura del documento y verificación de los datos extraídos por OCR.
 *
 * @returns La cabecera de la página y el asistente.
 */
export function PreRegistrationView() {
  return (
    <div className="av-page av-page--docs">
      <PageHeader
        icon="person-plus"
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Documentos", href: "/documents" }, { label: "Nuevo registro" }]}
        title="Nuevo registro"
        description="Captura del documento y verificación de los datos extraídos por OCR."
        actions={
          <ButtonLink href="/documents">
            <Icon name="arrow-left" /> Volver a Documentos
          </ButtonLink>
        }
      />
      <PreRegistrationWizard />
    </div>
  );
}
