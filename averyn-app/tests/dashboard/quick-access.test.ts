import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { APP_MODULES, type AppModule } from '../../components/layout/modules';
import { QUICK_ACCESS, resolveQuickAccessHref } from '../../features/dashboard/quick-access';

describe('resolveQuickAccessHref', () => {
  it('takes the route from the dock module', () => {
    assert.equal(resolveQuickAccessHref('Dashboard', APP_MODULES), '/dashboard');
  });

  it('has no route for a module that does not have a screen yet', () => {
    const pending: readonly AppModule[] = [{ label: 'Biometría', icon: 'fingerprint' }];

    assert.equal(resolveQuickAccessHref('Biometría', pending), undefined);
  });

  it('has no route for an unknown module', () => {
    assert.equal(resolveQuickAccessHref('Inexistente', APP_MODULES), undefined);
  });

  it('becomes a link as soon as the module gets its route', () => {
    const withRoute: readonly AppModule[] = [{ label: 'Identidad', href: '/identity', icon: 'person-vcard' }];

    assert.equal(resolveQuickAccessHref('Identidad', withRoute), '/identity');
  });
});

describe('QUICK_ACCESS', () => {
  it('only points to modules that exist in the dock', () => {
    const labels = new Set(APP_MODULES.map((module) => module.label));

    for (const access of QUICK_ACCESS) {
      assert.ok(labels.has(access.moduleLabel), `${access.title} points to an unknown module`);
    }
  });

  it('has a unique title for every access', () => {
    const titles = QUICK_ACCESS.map((access) => access.title);

    assert.equal(new Set(titles).size, titles.length);
  });
});
