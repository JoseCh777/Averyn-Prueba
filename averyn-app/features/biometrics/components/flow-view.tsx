import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { personService } from "@/features/identity/services";

import { toPickerPeople } from "../biometric-rules";
import { BIOMETRICS_PATH } from "../routes";
import { biometricService } from "../services";
import type { CaptureMode } from "../types";
import { CaptureFlow } from "./capture-flow";

const COPY = {
  enrollment: {
    title: "Registrar biometría",
    description: "Asocia un perfil biométrico a una persona ya registrada en la institución.",
  },
  verification: {
    title: "Verificar identidad",
    description: "Identifica a la persona y comprueba que su biometría coincide con el registro.",
  },
} as const;

/**
 * Pantalla de «Registrar biometría» o «Verificar identidad»: la cabecera y el flujo de dos pasos.
 *
 * @param props - El modo y la persona que llega preelegida por la URL (opcional).
 * @returns La pantalla del flujo.
 */
export async function FlowView({ mode, personId }: { mode: CaptureMode; personId?: string }) {
  const [people, profiles, devices] = await Promise.all([personService.list(), biometricService.listProfiles(), biometricService.listDevices()]);
  const copy = COPY[mode];

  return (
    <div className="av-page bio-page bio-page--flow" role="region" aria-label={`Contenido de ${copy.title}`}>
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Biometría", href: BIOMETRICS_PATH }, { label: copy.title }]}
        title={copy.title}
        icon={mode === "enrollment" ? "person-plus" : "shield-check"}
        description={copy.description}
        actions={
          <ButtonLink href={BIOMETRICS_PATH}>
            <Icon name="arrow-left" /> Volver a Biometría
          </ButtonLink>
        }
      />
      <CaptureFlow mode={mode} people={toPickerPeople(people, profiles)} devices={devices} initialPersonId={personId} />
    </div>
  );
}
