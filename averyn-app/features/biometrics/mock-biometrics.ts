import type { BiometricDevice, BiometricEvent, BiometricProfile } from "./types";

/**
 * [MOCK] Datos de demostración de Biometría (los del prototipo, con los ids de las personas de Identidad).
 * Las horas del prototipo eran de Lima; aquí van en UTC (Lima = UTC-5).
 * TODO(AVY-009): reemplazar por los datos del Core cuando exista el módulo de biometría.
 */

/** @returns Una copia nueva de los perfiles de demostración. */
export function seedProfiles(): BiometricProfile[] {
  return [
    { personId: "per-0001", face: true, fingerprint: false, registeredAt: "2026-09-08T14:15:00.000Z" },
    { personId: "per-0002", face: false, fingerprint: true, registeredAt: "2026-09-08T15:40:00.000Z" },
    { personId: "per-0003", face: false, fingerprint: false },
    { personId: "per-0004", face: true, fingerprint: true, registeredAt: "2026-09-09T16:05:00.000Z" },
    { personId: "per-0005", face: true, fingerprint: false, registeredAt: "2026-09-10T19:20:00.000Z" },
    { personId: "per-0006", face: false, fingerprint: false },
    { personId: "per-0007", face: false, fingerprint: false },
    { personId: "per-0008", face: true, fingerprint: false, registeredAt: "2026-09-11T21:45:00.000Z" },
  ];
}

/** @returns Una copia nueva de los eventos de demostración (el más reciente es `ev-0001`). */
export function seedEvents(): BiometricEvent[] {
  return [
    { id: "ev-0001", personId: "per-0001", operation: "verification", method: "face", result: "success", deviceId: "CAM-001", operator: "Admin", institution: "Sede Central", at: "2026-09-14T01:42:00.000Z", score: 91 },
    { id: "ev-0002", personId: "per-0005", operation: "verification", method: "fingerprint", result: "rejected", deviceId: "BIO-003", operator: "Operador", institution: "Campus Norte", at: "2026-09-14T01:31:00.000Z", score: 41 },
    { id: "ev-0003", personId: "per-0004", operation: "enrollment", method: "face", result: "success", deviceId: "CAM-001", operator: "Admin", institution: "Sede Central", at: "2026-09-13T23:12:00.000Z" },
    { id: "ev-0004", personId: "per-0008", operation: "verification", method: "face", result: "retry", deviceId: "CAM-002", operator: "Operador", institution: "Sede Central", at: "2026-09-13T22:55:00.000Z" },
    { id: "ev-0005", personId: "per-0002", operation: "verification", method: "fingerprint", result: "success", deviceId: "BIO-001", operator: "Operador", institution: "Campus Norte", at: "2026-09-13T21:20:00.000Z", score: 88 },
    { id: "ev-0006", personId: "per-0003", operation: "enrollment", method: "face", result: "device", deviceId: "CAM-003", operator: "Admin", institution: "Sede Central", at: "2026-09-12T20:03:00.000Z" },
  ];
}

/** @returns Una copia nueva de los dispositivos de demostración. */
export function seedDevices(): BiometricDevice[] {
  return [
    { id: "CAM-001", name: "Cámara principal", kind: "face", status: "connected", model: "Logitech Brio 4K", location: "Sede Central · Recepción", serial: "BR-4419-A" },
    { id: "CAM-002", name: "Cámara secundaria", kind: "face", status: "connected", model: "Logitech C920", location: "Campus Norte · Acceso", serial: "C9-2207-B" },
    { id: "CAM-003", name: "Cámara de archivo", kind: "face", status: "disconnected", model: "Logitech C270", location: "Sede Central · Archivo", serial: "C2-0731-C" },
    { id: "BIO-001", name: "Lector de huella", kind: "fingerprint", status: "disconnected", model: "DigitalPersona 4500", location: "Sede Central · Registro", serial: "DP-4500-01" },
    { id: "BIO-003", name: "Lector de huella (acceso)", kind: "fingerprint", status: "disconnected", model: "DigitalPersona 4500", location: "Campus Norte · Acceso", serial: "DP-4500-03" },
  ];
}
