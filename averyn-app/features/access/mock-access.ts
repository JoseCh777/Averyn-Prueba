import type { AccessEvent, AccessMethod, Checkpoint } from "./types";

/**
 * [MOCK] Datos de demostración del control en puerta: un evento, tres puntos de control y un padrón
 * armado sobre las ocho personas del catálogo de identidad.
 * TODO(AVY-048): reemplazar por los datos del Core cuando existan eventos y puntos de control.
 *
 * El aforo es pequeño a propósito (5) para poder mostrar «Aforo completo» con tres ingresos.
 */

export const DEMO_EVENT: AccessEvent = { id: "evt-0001", name: "Asamblea anual 2026", status: "LIVE", capacity: 5 };

/** Políticas del escenario de demo de Acceso: `QR` y (`FACE` o `FINGERPRINT`) en la puerta principal. */
export const DEMO_CHECKPOINTS: readonly Checkpoint[] = [
  { id: "chk-0001", name: "Puerta principal", direction: "BOTH", policy: [["QR"], ["FACE", "FINGERPRINT"]] },
  { id: "chk-0002", name: "Acceso preferente", direction: "ENTRY", policy: [["FACE"]] },
  { id: "chk-0003", name: "Salida lateral", direction: "EXIT", policy: [] },
];

/** Una persona del padrón del evento y los métodos biométricos que tiene registrados. */
export interface MockAttendee {
  personId: string;
  admitted: boolean;
  inside: boolean;
  enrolled: AccessMethod[];
}

/** Padrón inicial: dos personas dentro, una revocada y una sin biometría registrada. */
export function seedAttendees(): MockAttendee[] {
  return [
    { personId: "per-0001", admitted: true, inside: false, enrolled: ["FACE", "FINGERPRINT"] },
    { personId: "per-0002", admitted: true, inside: false, enrolled: ["FACE"] },
    { personId: "per-0003", admitted: true, inside: true, enrolled: ["FACE", "FINGERPRINT"] },
    { personId: "per-0004", admitted: true, inside: false, enrolled: ["FACE"] },
    { personId: "per-0005", admitted: true, inside: false, enrolled: ["FACE"] },
    { personId: "per-0006", admitted: true, inside: true, enrolled: ["FINGERPRINT"] },
    { personId: "per-0007", admitted: true, inside: false, enrolled: [] },
    { personId: "per-0008", admitted: false, inside: false, enrolled: ["FACE"] },
  ];
}

/** Estado de un código QR de un solo uso. */
export type QrStatus = "valid" | "expired" | "used";

export interface MockQrCode {
  personId: string;
  status: QrStatus;
}

/** Códigos QR de demostración (en producción el Core solo guarda su hash). */
export function seedQrCodes(): Record<string, MockQrCode> {
  return {
    "AVY-ANA-7F3K": { personId: "per-0001", status: "valid" },
    "AVY-LUIS-2M9Q": { personId: "per-0002", status: "valid" },
    "AVY-PAULA-5T8R": { personId: "per-0007", status: "valid" },
    "AVY-CARLOS-4H6W": { personId: "per-0004", status: "expired" },
    "AVY-LAURA-9B2X": { personId: "per-0005", status: "used" },
    "AVY-JORGE-1D7N": { personId: "per-0006", status: "used" },
    "AVY-ANDRES-8K4P": { personId: "per-0008", status: "valid" },
  };
}

/** Atajos del campo de QR para mostrar cada resultado sin escribir el código. */
export const DEMO_QR_SHORTCUTS: readonly { label: string; code: string }[] = [
  { label: "Válido", code: "AVY-ANA-7F3K" },
  { label: "Vencido", code: "AVY-CARLOS-4H6W" },
  { label: "Ya usado", code: "AVY-LAURA-9B2X" },
  { label: "Ya dentro", code: "AVY-JORGE-1D7N" },
  { label: "Revocado", code: "AVY-ANDRES-8K4P" },
  { label: "Sin biometría", code: "AVY-PAULA-5T8R" },
  { label: "Inválido", code: "AVY-NO-EXISTE" },
];
