import type { ElectionStatus } from "@/features/elections/types";

import type {
  BiometricMethod,
  BiometricOperation,
  BiometricOutcome,
  DashboardBiometricEvent,
  DashboardKpi,
  DashboardSource,
  DashboardSummary,
  OutcomeCount,
  RecentEvent,
} from "./types";

/** Cuántos eventos muestra la línea de tiempo. */
const RECENT_EVENTS_LIMIT = 4;

/** Zona y formato de las fechas que ve la persona (coding-standard 62). */
const DISPLAY_LOCALE = "es-PE";
const DISPLAY_TIME_ZONE = "America/Lima";

const OPERATION_LABEL: Record<BiometricOperation, string> = {
  enrollment: "Registro",
  verification: "Verificación",
};

const METHOD_LABEL: Record<BiometricMethod, string> = {
  face: "Rostro",
  fingerprint: "Huella",
};

const OUTCOME_LABEL: Record<BiometricOutcome, string> = {
  success: "correcto",
  rejected: "rechazado",
  retry: "reintento",
  "device-error": "error del dispositivo",
};

/** Estados en los que un proceso electoral cuenta como activo: en preparación o en curso. */
const ACTIVE_ELECTION_STATUSES: readonly ElectionStatus[] = ["draft", "configuration", "open"];

/** Resultados que muestra el gráfico de barras, en este orden. */
const CHART_OUTCOMES: readonly OutcomeCount["outcome"][] = ["success", "rejected", "retry"];

const CHART_OUTCOME_LABEL: Record<OutcomeCount["outcome"], string> = {
  success: "Exitosas",
  rejected: "Rechazadas",
  retry: "Reintentos",
};

/**
 * Cantidad con su unidad en singular o plural.
 *
 * @param count - Cantidad.
 * @param singular - Texto para exactamente 1.
 * @param plural - Texto para cualquier otra cantidad.
 * @returns Por ejemplo `1 verificada` o `3 verificadas`.
 */
export function formatCount(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * Fecha de un evento para la interfaz: `dd/mm/aaaa, hh:mm` en hora de Lima.
 *
 * @param isoInstant - Instante en ISO 8601.
 * @returns Fecha y hora formateadas.
 */
export function formatEventDate(isoInstant: string): string {
  return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    timeZone: DISPLAY_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(isoInstant));
}

/**
 * Arma los cuatro indicadores del panel. Cada cifra es un conteo de los datos de
 * origen: no se inventa ninguna.
 *
 * @param source - Datos de origen.
 * @returns Personas, verificaciones, procesos electorales y dispositivos.
 */
function buildKpis(source: DashboardSource): readonly DashboardKpi[] {
  const verifiedPeople = source.people.filter((person) => person.status === "verified").length;
  const pendingPeople = source.people.length - verifiedPeople;

  const verifications = source.events.filter((event) => event.operation === "verification");
  const successful = verifications.filter((event) => event.outcome === "success").length;
  const rejected = verifications.filter((event) => event.outcome === "rejected").length;

  const activeElections = source.elections.filter((election) => ACTIVE_ELECTION_STATUSES.includes(election.status)).length;

  const connectedDevices = source.devices.filter((device) => device.status === "connected").length;
  const disconnectedDevices = source.devices.length - connectedDevices;

  return [
    {
      id: "people",
      label: "Personas registradas",
      value: source.people.length,
      delta: formatCount(verifiedPeople, "verificada", "verificadas"),
      tone: "ok",
      note: `${formatCount(pendingPeople, "pendiente", "pendientes")} de verificación`,
    },
    {
      id: "verifications",
      label: "Verificaciones",
      value: verifications.length,
      delta: formatCount(successful, "exitosa", "exitosas"),
      tone: "ok",
      note: formatCount(rejected, "rechazada", "rechazadas"),
    },
    {
      id: "elections",
      label: "Procesos electorales",
      value: activeElections,
      delta: `${source.elections.length} en total`,
      tone: "neutral",
      note: "En preparación o en curso",
    },
    {
      id: "devices",
      label: "Dispositivos conectados",
      value: connectedDevices,
      delta: formatCount(disconnectedDevices, "desconectado", "desconectados"),
      tone: disconnectedDevices > 0 ? "warn" : "ok",
      note: `de ${source.devices.length} dispositivos de biometría`,
    },
  ];
}

/**
 * @param events - Todos los eventos del log.
 * @returns Cuántos eventos hay por cada resultado del gráfico.
 */
function countOutcomes(events: readonly DashboardBiometricEvent[]): readonly OutcomeCount[] {
  return CHART_OUTCOMES.map((outcome) => ({
    outcome,
    label: CHART_OUTCOME_LABEL[outcome],
    count: events.filter((event) => event.outcome === outcome).length,
  }));
}

/**
 * @param event - Evento del log.
 * @param source - Datos de origen, para buscar el nombre de la persona.
 * @returns El evento listo para la línea de tiempo.
 */
function toRecentEvent(event: DashboardBiometricEvent, source: DashboardSource): RecentEvent {
  const person = source.people.find((candidate) => candidate.id === event.personId);
  const personName = person?.name ?? "Persona eliminada";
  return {
    id: event.id,
    title: `${OPERATION_LABEL[event.operation]} biométrica`,
    detail: `${personName} · ${METHOD_LABEL[event.method]} ${OUTCOME_LABEL[event.outcome]}`,
    meta: `${formatEventDate(event.occurredAt)} · ${event.deviceId}`,
    outcome: event.outcome,
  };
}

/**
 * Resumen del panel principal a partir de los datos de origen.
 *
 * Es una función pura: la misma entrada da siempre el mismo resumen, así se prueba
 * sin pantalla ni red. Cuando el Core entregue el resumen ya calculado, esta función
 * deja de usarse y `DashboardService` devuelve la respuesta de la API.
 *
 * @param source - Personas, dispositivos, procesos electorales y eventos (más reciente primero).
 * @returns Indicadores, conteo por resultado y actividad reciente.
 */
export function buildDashboardSummary(source: DashboardSource): DashboardSummary {
  return {
    kpis: buildKpis(source),
    outcomes: countOutcomes(source.events),
    totalEvents: source.events.length,
    recentEvents: source.events.slice(0, RECENT_EVENTS_LIMIT).map((event) => toRecentEvent(event, source)),
  };
}
