import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MOCK_DASHBOARD_SOURCE } from '../../features/dashboard/mock-dashboard-data';
import { buildDashboardSummary, formatCount, formatEventDate } from '../../features/dashboard/summary';
import type { DashboardSource } from '../../features/dashboard/types';

const EMPTY_SOURCE: DashboardSource = { people: [], devices: [], elections: [], events: [] };

describe('formatCount', () => {
  it('uses the singular only for exactly one', () => {
    assert.equal(formatCount(1, 'verificada', 'verificadas'), '1 verificada');
    assert.equal(formatCount(0, 'verificada', 'verificadas'), '0 verificadas');
    assert.equal(formatCount(3, 'verificada', 'verificadas'), '3 verificadas');
  });
});

describe('formatEventDate', () => {
  it('shows day/month/year and 24-hour time in Lima time', () => {
    assert.equal(formatEventDate('2026-09-14T01:42:00Z'), '13/09/2026, 20:42');
  });
});

describe('buildDashboardSummary with the demo data', () => {
  const summary = buildDashboardSummary(MOCK_DASHBOARD_SOURCE);
  const kpi = (id: string) => summary.kpis.find((candidate) => candidate.id === id);

  it('counts people and how many are verified', () => {
    assert.equal(kpi('people')?.value, 8);
    assert.equal(kpi('people')?.delta, '5 verificadas');
    assert.equal(kpi('people')?.note, '3 pendientes de verificación');
  });

  it('counts only verifications, not enrollments', () => {
    assert.equal(kpi('verifications')?.value, 4);
    assert.equal(kpi('verifications')?.delta, '2 exitosas');
    assert.equal(kpi('verifications')?.note, '1 rechazada');
  });

  it('flags disconnected devices as a warning', () => {
    assert.equal(kpi('devices')?.value, 2);
    assert.equal(kpi('devices')?.delta, '1 desconectado');
    assert.equal(kpi('devices')?.tone, 'warn');
  });

  it('counts the outcomes over every event, not only the recent ones', () => {
    assert.equal(summary.totalEvents, 6);
    assert.deepEqual(
      summary.outcomes.map((outcome) => [outcome.outcome, outcome.count]),
      [['success', 3], ['rejected', 1], ['retry', 1]],
    );
  });

  it('shows the four most recent events, newest first, with the person name', () => {
    assert.equal(summary.recentEvents.length, 4);
    assert.equal(summary.recentEvents[0]?.title, 'Verificación biométrica');
    assert.equal(summary.recentEvents[0]?.detail, 'Ana Torres · Rostro correcto');
    assert.equal(summary.recentEvents[0]?.meta, '13/09/2026, 20:42 · CAM-001');
  });
});

describe('buildDashboardSummary edge cases', () => {
  it('works with no data at all', () => {
    const summary = buildDashboardSummary(EMPTY_SOURCE);

    assert.deepEqual(summary.kpis.map((kpi) => kpi.value), [0, 0, 0, 0]);
    assert.equal(summary.totalEvents, 0);
    assert.deepEqual(summary.recentEvents, []);
  });

  it('counts draft and open elections as active but not closed ones', () => {
    const summary = buildDashboardSummary({
      ...EMPTY_SOURCE,
      elections: [{ status: 'DRAFT' }, { status: 'OPEN' }, { status: 'CLOSED' }],
    });
    const elections = summary.kpis.find((kpi) => kpi.id === 'elections');

    assert.equal(elections?.value, 2);
    assert.equal(elections?.delta, '3 en total');
  });

  it('does not warn when every device is connected', () => {
    const summary = buildDashboardSummary({ ...EMPTY_SOURCE, devices: [{ id: 'CAM-001', status: 'connected' }] });

    assert.equal(summary.kpis.find((kpi) => kpi.id === 'devices')?.tone, 'ok');
  });

  it('names a person that is not in the catalog by id', () => {
    const summary = buildDashboardSummary({
      ...EMPTY_SOURCE,
      events: [
        { id: 'ev-x', personId: 99, operation: 'verification', method: 'face', outcome: 'rejected', deviceId: 'CAM-001', occurredAt: '2026-09-14T01:42:00Z' },
      ],
    });

    assert.match(summary.recentEvents[0]?.detail ?? '', /Persona #99/);
  });
});
