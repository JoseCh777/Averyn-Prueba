import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { APP_MODULES, isModuleActive } from '../../components/layout/modules';

describe('isModuleActive', () => {
  it('is active on the module route', () => {
    assert.equal(isModuleActive('/dashboard', '/dashboard'), true);
  });

  it('is active on a route below the module route', () => {
    assert.equal(isModuleActive('/dashboard/detalle', '/dashboard'), true);
  });

  it('is not active on a route that only shares the start of the text', () => {
    assert.equal(isModuleActive('/dashboard-antiguo', '/dashboard'), false);
  });

  it('is not active on another module route', () => {
    assert.equal(isModuleActive('/identidad', '/dashboard'), false);
  });

  it('is never active for a module without a route yet', () => {
    assert.equal(isModuleActive('/dashboard', undefined), false);
  });
});

describe('APP_MODULES', () => {
  it('has a unique label for every module', () => {
    const labels = APP_MODULES.map((module) => module.label);

    assert.equal(new Set(labels).size, labels.length);
  });

  it('only links to internal routes', () => {
    for (const module of APP_MODULES) {
      assert.ok(module.href === undefined || module.href.startsWith('/'), `${module.label} has an invalid href`);
    }
  });
});
