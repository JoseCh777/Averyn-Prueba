import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { seedDevices, seedEvents } from '../../features/biometrics/mock-biometrics';
import { toDashboardSource } from '../../features/dashboard/source-mapping';
import { buildDashboardSummary } from '../../features/dashboard/summary';
import type { Election } from '../../features/elections/types';
import { seedPeople } from '../../features/identity/mock-people';
import { DEMO_SOURCE } from './fixtures';

const election: Election = {
  id: 'ele-0001',
  name: 'Consejo',
  description: 'Descripción',
  institution: 'university',
  kind: 'council',
  startDate: '2026-10-10',
  endDate: '2026-10-12',
  status: 'draft',
  settings: { votingType: 'single', choicesPerVote: 1, mode: 'online', anonymous: true, blankVote: false, showResults: true, allowVoteChange: false },
  participants: { affiliation: 'all', eligible: 8, verified: 5 },
  createdAt: '2026-10-06T15:00:00.000Z',
};

describe('toDashboardSource', () => {
  const source = toDashboardSource({ people: seedPeople(), events: seedEvents(), devices: seedDevices(), elections: [election] });

  it('translates people, devices and processes keeping only what the panel needs', () => {
    assert.deepEqual(source.people[0], { id: 'per-0001', name: 'Ana Torres', status: 'verified' });
    assert.deepEqual(source.devices[0], { id: 'CAM-001', status: 'connected' });
    assert.deepEqual(source.elections, [{ status: 'draft' }]);
  });

  it('translates events and turns a missing device into a device error', () => {
    assert.equal(source.events.length, 6);
    assert.equal(source.events[0]?.outcome, 'success');
    assert.equal(source.events[1]?.outcome, 'rejected');
    assert.equal(source.events[5]?.outcome, 'device-error');
    assert.equal(source.events[0]?.occurredAt, '2026-09-14T01:42:00.000Z');
  });

  it('gives the same summary as the panel test data for the same people and events', () => {
    const fromModules = buildDashboardSummary({ ...source, elections: [] });
    const fromFixture = buildDashboardSummary(DEMO_SOURCE);

    assert.deepEqual(fromModules.outcomes, fromFixture.outcomes);
    assert.equal(fromModules.totalEvents, fromFixture.totalEvents);
    assert.equal(fromModules.kpis.find((kpi) => kpi.id === 'people')?.value, 8);
    assert.equal(fromModules.kpis.find((kpi) => kpi.id === 'devices')?.value, 2);
  });

  it('counts a process in preparation as active', () => {
    assert.equal(buildDashboardSummary(source).kpis.find((kpi) => kpi.id === 'elections')?.value, 1);
  });
});
