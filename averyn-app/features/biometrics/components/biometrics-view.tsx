import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Kpi, KpiRow, Tile } from "@/components/ui/display";
import { EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { personService } from "@/features/identity/services";

import { newestFirst, summarizeBiometrics } from "../biometric-rules";
import { ENROLLMENT_PATH, HISTORY_PATH, VERIFICATION_PATH } from "../routes";
import { biometricService } from "../services";
import { DevicesGrid } from "./devices-grid";
import { EventsTable } from "./events-table";

/** Cuántos eventos muestra el resumen del módulo. */
const RECENT_EVENTS = 5;

/**
 * Pantalla del módulo de Biometría: accesos a registrar y verificar, indicadores, actividad reciente
 * y estado de los dispositivos.
 *
 * Es un Server Component asíncrono: pide los datos a los servicios, así que mientras llegan se muestra
 * `loading.tsx` y, si falla, `error.tsx`.
 *
 * @returns La pantalla completa.
 */
export async function BiometricsView() {
  const [people, profiles, events, devices] = await Promise.all([
    personService.list(),
    biometricService.listProfiles(),
    biometricService.listEvents(),
    biometricService.listDevices(),
  ]);
  const summary = summarizeBiometrics({ totalPeople: people.length, profiles, events, devices });
  const peopleById = new Map(people.map((person) => [person.id, person]));
  const recent = newestFirst(events).slice(0, RECENT_EVENTS);

  return (
    <div className="av-page">
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Biometría" }]}
        title="Biometría"
        description="Registro y verificación de información biométrica asociada a las personas de la institución."
        actions={
          <ButtonLink href={HISTORY_PATH}>
            <Icon name="clock-history" /> Historial
          </ButtonLink>
        }
      />

      <section className="bio-actions" aria-label="Acciones principales">
        <Tile tone="signal" icon="person-plus" title="Registrar biometría" description="Asocia un perfil biométrico (rostro o huella) a una persona." href={ENROLLMENT_PATH} />
        <Tile tone="night" icon="shield-check" title="Verificar identidad" description="Comprueba que una persona corresponde con su registro biométrico." href={VERIFICATION_PATH} />
      </section>

      <section aria-label="Indicadores de biometría">
        <KpiRow>
          <Kpi label="Personas con biometría" value={summary.peopleWithBiometrics} note={`de ${summary.totalPeople} personas`} />
          <Kpi label="Verificaciones" value={summary.verifications} note={`${summary.rejected} rechazadas`} />
          <Kpi label="Tasa de éxito" value={summary.successRate === null ? "—" : `${summary.successRate}%`} note={`${summary.successful} exitosas`} />
          <Kpi
            label="Dispositivos conectados"
            value={summary.connectedDevices}
            note={`de ${summary.totalDevices} equipos`}
            tone={summary.connectedDevices < summary.totalDevices ? "warn" : undefined}
          />
        </KpiRow>
      </section>

      <section className="av-surface" aria-labelledby="recent-title">
        <div className="av-toolbar av-toolbar--head">
          <h2 className="av-toolbar__title" id="recent-title">
            Actividad reciente
          </h2>
          <Link className="av-link" href={HISTORY_PATH}>
            Ver historial <Icon name="arrow-right" />
          </Link>
        </div>
        {recent.length > 0 ? (
          <EventsTable events={recent} people={peopleById} variant="compact" label="Actividad biométrica reciente" />
        ) : (
          <EmptyState icon="signal" title="Aún no hay actividad biométrica">
            Registra o verifica una identidad para ver eventos aquí.
          </EmptyState>
        )}
      </section>

      <section aria-labelledby="devices-title">
        <div className="av-surface__head">
          <h2 className="av-section-title" id="devices-title">
            Dispositivos biométricos
          </h2>
          <p>Hardware disponible para captura.</p>
        </div>
        <DevicesGrid devices={devices} />
      </section>
    </div>
  );
}
