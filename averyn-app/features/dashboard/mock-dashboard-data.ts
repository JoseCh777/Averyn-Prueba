import type { DashboardSource } from "./types";

/**
 * [MOCK] Datos de demostración del panel, con personas ficticias (los del prototipo).
 * TODO(AVY-006): reemplazar por la respuesta real del Core cuando existan los módulos de
 * Identidad, Biometría y Electoral; ver `services/mock-dashboard-service.ts`.
 */
export const MOCK_DASHBOARD_SOURCE: DashboardSource = {
  people: [
    { id: 1, name: "Ana Torres", status: "verified" },
    { id: 2, name: "Luis Pérez", status: "pending" },
    { id: 3, name: "María Gómez", status: "verified" },
    { id: 4, name: "Carlos Ruiz", status: "pending" },
    { id: 5, name: "Laura Díaz", status: "verified" },
    { id: 6, name: "Jorge Ramírez", status: "verified" },
    { id: 7, name: "Paula Herrera", status: "pending" },
    { id: 8, name: "Andrés Molina", status: "verified" },
  ],
  devices: [
    { id: "CAM-001", status: "connected" },
    { id: "CAM-002", status: "connected" },
    { id: "BIO-001", status: "disconnected" },
  ],
  elections: [],
  events: [
    { id: "ev-1", personId: 1, operation: "verification", method: "face", outcome: "success", deviceId: "CAM-001", occurredAt: "2026-09-14T01:42:00Z" },
    { id: "ev-2", personId: 5, operation: "verification", method: "fingerprint", outcome: "rejected", deviceId: "BIO-003", occurredAt: "2026-09-14T01:31:00Z" },
    { id: "ev-3", personId: 4, operation: "enrollment", method: "face", outcome: "success", deviceId: "CAM-001", occurredAt: "2026-09-13T23:12:00Z" },
    { id: "ev-4", personId: 8, operation: "verification", method: "face", outcome: "retry", deviceId: "CAM-002", occurredAt: "2026-09-13T22:55:00Z" },
    { id: "ev-5", personId: 2, operation: "verification", method: "fingerprint", outcome: "success", deviceId: "BIO-001", occurredAt: "2026-09-13T21:20:00Z" },
    { id: "ev-6", personId: 3, operation: "enrollment", method: "face", outcome: "device-error", deviceId: "CAM-003", occurredAt: "2026-09-13T20:03:00Z" },
  ],
};
