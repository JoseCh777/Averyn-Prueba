import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { AFFILIATION_LABEL } from "@/features/identity/labels";
import { formatDocument } from "@/features/identity/person-rules";
import { personService } from "@/features/identity/services";

import { connectedDeviceFor, methodAvailability, parseCaptureContext } from "../biometric-rules";
import { captureHeading } from "../capture-state";
import { BIOMETRICS_PATH, flowPath } from "../routes";
import { biometricService } from "../services";
import { CaptureStation } from "./capture-station";

/** Parámetros de la URL de la captura, sin validar. */
export type CaptureSearchParams = Record<string, string | string[] | undefined>;

/** Toma el primer valor de un parámetro de la URL (puede venir repetido). */
function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Pantalla de captura: valida el contexto de la URL y muestra la estación de captura.
 *
 * Sin contexto válido, sin persona o sin una modalidad disponible, no hay captura en curso y se
 * explica por qué (nunca una pantalla rota).
 *
 * @param props - Los parámetros de la URL (`mode`, `person` y `method`).
 * @returns La pantalla de captura o el aviso de que no hay captura en curso.
 */
export async function CaptureView({ params }: { params: CaptureSearchParams }) {
  const context = parseCaptureContext({ mode: firstValue(params.mode), person: firstValue(params.person), method: firstValue(params.method) });
  const [person, profile, devices] = await Promise.all([
    context === undefined ? undefined : personService.getById(context.personId),
    context === undefined ? undefined : biometricService.getProfile(context.personId),
    biometricService.listDevices(),
  ]);

  if (context === undefined || person === undefined) {
    return (
      <EmptyState
        icon="camera-video"
        title="No hay una captura en curso"
        action={<ButtonLink href={BIOMETRICS_PATH}>Ir a Biometría</ButtonLink>}
      >
        Inicia un registro o una verificación desde el módulo de Biometría.
      </EmptyState>
    );
  }

  const heading = captureHeading(context.mode, context.method);
  const availability = methodAvailability({ mode: context.mode, method: context.method, profile, devices });
  const device = connectedDeviceFor(devices, context.method);
  const back = flowPath(context.mode, person.id);

  return (
    <div className="av-page av-page--narrow">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Biometría", href: BIOMETRICS_PATH }, { label: heading.crumb }]}
        title={heading.title}
        description={heading.description}
        actions={
          <ButtonLink href={back}>
            <Icon name="x-lg" /> Cancelar
          </ButtonLink>
        }
      />
      {availability.available && device !== undefined ? (
        <CaptureStation
          key={`${context.mode}-${context.personId}-${context.method}`}
          context={context}
          personLine={`${person.name} · ${formatDocument(person.document)} · ${AFFILIATION_LABEL[person.affiliation]}`}
          deviceLabel={device.id}
        />
      ) : (
        <Alert tone="warning" title="No se puede capturar con este método">
          {availability.available ? "No hay un dispositivo conectado." : availability.reason}.{" "}
          <ButtonLink href={back} variant="ghost">
            Elegir otro método
          </ButtonLink>
        </Alert>
      )}
    </div>
  );
}
