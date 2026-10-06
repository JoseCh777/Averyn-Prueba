import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { DEFAULT_BASE_URL, DEFAULT_ROUTES } from './audit-settings';
import { InvalidBaseUrlError, buildRouteUrl, parseCliArguments } from './cli-arguments';

describe('parseCliArguments', () => {
  it('uses the default server and routes when no arguments are given', () => {
    assert.deepEqual(parseCliArguments([]), { baseUrl: DEFAULT_BASE_URL, routes: DEFAULT_ROUTES });
  });

  it('uses the default routes when only the base URL is given', () => {
    const target = parseCliArguments(['http://localhost:3200']);

    assert.equal(target.baseUrl, 'http://localhost:3200');
    assert.deepEqual(target.routes, DEFAULT_ROUTES);
  });

  it('keeps the routes in the order they were written', () => {
    const target = parseCliArguments(['https://web.example.org', 'dashboard', 'login']);

    assert.deepEqual(target.routes, ['dashboard', 'login']);
  });

  it('rejects a base URL that is not absolute', () => {
    assert.throws(() => parseCliArguments(['localhost:3000']), InvalidBaseUrlError);
    assert.throws(() => parseCliArguments(['dashboard']), InvalidBaseUrlError);
  });

  it('rejects a base URL with a protocol other than http or https', () => {
    assert.throws(() => parseCliArguments(['ftp://localhost']), InvalidBaseUrlError);
  });
});

describe('buildRouteUrl', () => {
  it('joins the route with or without a leading slash', () => {
    assert.equal(buildRouteUrl('http://localhost:3000', 'dashboard'), 'http://localhost:3000/dashboard');
    assert.equal(buildRouteUrl('http://localhost:3000', '/dashboard'), 'http://localhost:3000/dashboard');
  });

  it('keeps nested routes', () => {
    assert.equal(
      buildRouteUrl('http://localhost:3000', 'design-system/errores/404'),
      'http://localhost:3000/design-system/errores/404',
    );
  });
});
