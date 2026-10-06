/* Datos de origen: lo que el Core entregará. Hoy se arman con los servicios de Identidad, Biometría y Electoral (`source-mapping.ts`). */

import type { ElectionStatus } from "@/features/elections/types";

export type PersonStatus = "verified" | "pending";
export type DeviceStatus = "connected" | "disconnected";
export type BiometricOperation = "enrollment" | "verification";
export type BiometricMethod = "face" | "fingerprint";

/**
 * Resultado de una operación biométrica. `rejected` (NO_MATCH) es un resultado válido
 * de negocio, no un error técnico; `device-error` sí lo es (AGENTS §17 del Core).
 */
export type BiometricOutcome = "success" | "rejected" | "retry" | "device-error";

export type DashboardPerson = { id: string; name: string; status: PersonStatus };
export type DashboardDevice = { id: string; status: DeviceStatus };
export type DashboardElection = { status: ElectionStatus };

export type DashboardBiometricEvent = {
  id: string;
  personId: string;
  operation: BiometricOperation;
  method: BiometricMethod;
  outcome: BiometricOutcome;
  deviceId: string;
  /** Instante en ISO 8601 UTC (coding-standard 62). */
  occurredAt: string;
};

/** Todo lo que hace falta para armar el resumen. Los eventos van del más reciente al más antiguo. */
export type DashboardSource = {
  people: readonly DashboardPerson[];
  devices: readonly DashboardDevice[];
  elections: readonly DashboardElection[];
  events: readonly DashboardBiometricEvent[];
};

/* Resumen: lo que muestra la pantalla. */

/** Color del punto del detalle: `ok` (positivo), `warn` (atención) o `neutral`. */
export type KpiTone = "ok" | "warn" | "neutral";

export type DashboardKpi = {
  id: "people" | "verifications" | "elections" | "devices";
  label: string;
  value: number;
  delta: string;
  tone: KpiTone;
  note: string;
};

export type OutcomeCount = {
  outcome: Exclude<BiometricOutcome, "device-error">;
  label: string;
  count: number;
};

export type RecentEvent = {
  id: string;
  title: string;
  detail: string;
  /** Fecha y dispositivo, ya formateados. */
  meta: string;
  outcome: BiometricOutcome;
};

export type DashboardSummary = {
  kpis: readonly DashboardKpi[];
  /** Conteo por resultado sobre **todos** los eventos, no solo los recientes. */
  outcomes: readonly OutcomeCount[];
  totalEvents: number;
  recentEvents: readonly RecentEvent[];
};
