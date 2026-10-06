import type { DashboardSource } from '../../features/dashboard/types';

/** Datos de demostración para probar el resumen del panel (los del prototipo, con los ids de Identidad). */
export const DEMO_SOURCE: DashboardSource = {
  people: [
    { id: 'per-0001', name: 'Ana Torres', status: 'verified' },
    { id: 'per-0002', name: 'Luis Pérez', status: 'pending' },
    { id: 'per-0003', name: 'María Gómez', status: 'verified' },
    { id: 'per-0004', name: 'Carlos Ruiz', status: 'pending' },
    { id: 'per-0005', name: 'Laura Díaz', status: 'verified' },
    { id: 'per-0006', name: 'Jorge Ramírez', status: 'verified' },
    { id: 'per-0007', name: 'Paula Herrera', status: 'pending' },
    { id: 'per-0008', name: 'Andrés Molina', status: 'verified' },
  ],
  devices: [
    { id: 'CAM-001', status: 'connected' },
    { id: 'CAM-002', status: 'connected' },
    { id: 'BIO-001', status: 'disconnected' },
  ],
  elections: [],
  events: [
    { id: 'ev-1', personId: 'per-0001', operation: 'verification', method: 'face', outcome: 'success', deviceId: 'CAM-001', occurredAt: '2026-09-14T01:42:00Z' },
    { id: 'ev-2', personId: 'per-0005', operation: 'verification', method: 'fingerprint', outcome: 'rejected', deviceId: 'BIO-003', occurredAt: '2026-09-14T01:31:00Z' },
    { id: 'ev-3', personId: 'per-0004', operation: 'enrollment', method: 'face', outcome: 'success', deviceId: 'CAM-001', occurredAt: '2026-09-13T23:12:00Z' },
    { id: 'ev-4', personId: 'per-0008', operation: 'verification', method: 'face', outcome: 'retry', deviceId: 'CAM-002', occurredAt: '2026-09-13T22:55:00Z' },
    { id: 'ev-5', personId: 'per-0002', operation: 'verification', method: 'fingerprint', outcome: 'success', deviceId: 'BIO-001', occurredAt: '2026-09-13T21:20:00Z' },
    { id: 'ev-6', personId: 'per-0003', operation: 'enrollment', method: 'face', outcome: 'device-error', deviceId: 'CAM-003', occurredAt: '2026-09-13T20:03:00Z' },
  ],
};
