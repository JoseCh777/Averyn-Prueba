import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Alert, Chip } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { formatDocument } from "@/features/identity/person-rules";
import { personService } from "@/features/identity/services";
import { formatDateTime } from "@/lib/date-format";

import { METHOD_ICON, METHOD_LABEL } from "../labels";
import { BIOMETRICS_PATH, ENROLLMENT_PATH, flowPath } from "../routes";
import { biometricService } from "../services";

/**
 * Acta de un registro biométrico terminado: lo que quedó guardado y adónde seguir.
 *
 * Lee el evento por su id (no por parámetros sueltos de la URL), así el acta no se puede inventar.
 * Si el evento no fue de registro, o no salió bien, no hay acta.
 *
 * @param props - El id del evento de registro, tomado de la URL.
 * @returns El acta o la pantalla «no encontrado».
 */
export async function EnrollmentDoneView({ eventId }: { eventId: string }) {
  const event = await biometricService.getEvent(eventId);
  if (event === undefined || event.operation !== "enrollment") notFound();
  const [person, profile] = await Promise.all([personService.getById(event.personId), biometricService.getProfile(event.personId)]);
  const completed = event.result === "success";

  return (
    <div className="av-page bio-page bio-page--flow" role="region" aria-label="Contenido del acta de registro">
      <PageHeader
        icon="person-plus"
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Biometría", href: BIOMETRICS_PATH }, { label: "Registrar biometría", href: ENROLLMENT_PATH }, { label: "Acta" }]}
        title="Registro biométrico"
        description="Resultado del registro de la modalidad biométrica."
      />

      <section className="av-surface av-surface--pad av-surface--narrow" aria-label="Acta del registro">
        {completed ? (
          <Alert tone="success" title="Registro biométrico completado">
            El perfil biométrico se asoció correctamente a la persona.
          </Alert>
        ) : (
          <Alert tone="warning" title="No se pudo completar el registro">
            No había un dispositivo conectado para esta modalidad. Conéctalo e inténtalo de nuevo.
          </Alert>
        )}

        <dl className="av-detail bio-acta">
          <div>
            <dt>Persona</dt>
            <dd>{person?.name ?? "Persona eliminada"}</dd>
          </div>
          {person ? (
            <div>
              <dt>Documento</dt>
              <dd>{formatDocument(person.document)}</dd>
            </div>
          ) : null}
          <div>
            <dt>Biometría registrada</dt>
            <dd>
              <Chip tone="info" icon={METHOD_ICON[event.method]}>
                {METHOD_LABEL[event.method]}
              </Chip>
            </dd>
          </div>
          {completed ? (
            <div>
              <dt>Estado</dt>
              <dd>
                <Chip tone="success" icon="check-circle">
                  Activa
                </Chip>
              </dd>
            </div>
          ) : null}
          <div>
            <dt>{completed ? "Fecha de registro" : "Fecha del intento"}</dt>
            <dd>{formatDateTime(completed ? (profile?.registeredAt ?? event.at) : event.at)}</dd>
          </div>
          <div>
            <dt>Dispositivo</dt>
            <dd className="av-cell-mono">{event.deviceId}</dd>
          </div>
        </dl>

        <div className="bio-acta__actions">
          {person ? (
            <ButtonLink href={`/identity/${person.id}`}>
              <Icon name="person-vcard" /> Ver perfil
            </ButtonLink>
          ) : null}
          <ButtonLink href={flowPath("enrollment")} variant="primary">
            <Icon name="plus-lg" /> Registrar otra persona
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
