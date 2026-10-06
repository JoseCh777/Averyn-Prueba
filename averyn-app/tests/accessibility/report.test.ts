import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { collectFindings, formatFinding, formatRouteSummary, resolveExitCode, type Finding, type RouteReport } from './report';

const axeFinding: Finding = { route: 'dashboard', viewportWidth: 375, check: 'axe', message: 'button-name (1 elementos)' };
const keyboardFinding: Finding = { route: 'dashboard', check: 'keyboard', message: 'a.av-link no tiene nombre accesible' };

const cleanReport: RouteReport = { route: 'login', focusableCount: 12, findings: [] };
const failingReport: RouteReport = { route: 'dashboard', focusableCount: 30, findings: [axeFinding, keyboardFinding] };

describe('formatFinding', () => {
  it('includes the viewport width when the check depends on it', () => {
    assert.equal(formatFinding(axeFinding), '  - [axe] dashboard @375px: button-name (1 elementos)');
  });

  it('omits the viewport width when the check does not depend on it', () => {
    assert.equal(formatFinding(keyboardFinding), '  - [keyboard] dashboard: a.av-link no tiene nombre accesible');
  });
});

describe('formatRouteSummary', () => {
  it('marks a route without findings as ok', () => {
    assert.equal(formatRouteSummary(cleanReport), 'ok    login | enfocables: 12 | problemas: 0');
  });

  it('marks a route with findings as failed', () => {
    assert.equal(formatRouteSummary(failingReport), 'FALLA dashboard | enfocables: 30 | problemas: 2');
  });
});

describe('collectFindings and resolveExitCode', () => {
  it('gathers the findings of every route in order', () => {
    assert.deepEqual(collectFindings([cleanReport, failingReport]), [axeFinding, keyboardFinding]);
  });

  it('exits with 0 when no route has findings', () => {
    assert.equal(resolveExitCode([cleanReport]), 0);
  });

  it('exits with 1 when any route has findings', () => {
    assert.equal(resolveExitCode([cleanReport, failingReport]), 1);
  });
});
