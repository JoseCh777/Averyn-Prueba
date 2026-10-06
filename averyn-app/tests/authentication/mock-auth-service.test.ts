import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MOCK_ACCOUNT, MockAuthService } from '../../features/authentication/services/mock-auth-service';

describe('MockAuthService', () => {
  const service = new MockAuthService();

  it('authenticates the demo account', async () => {
    const result = await service.login({ email: MOCK_ACCOUNT.email, password: MOCK_ACCOUNT.password });

    assert.deepEqual(result, { ok: true, user: { email: MOCK_ACCOUNT.email, role: MOCK_ACCOUNT.role } });
  });

  it('ignores the case of the email', async () => {
    const result = await service.login({ email: 'ADMIN@Averyn.Test', password: MOCK_ACCOUNT.password });

    assert.equal(result.ok, true);
  });

  it('answers the same way for a wrong password and for an unknown email', async () => {
    const wrongPassword = await service.login({ email: MOCK_ACCOUNT.email, password: 'otra' });
    const unknownEmail = await service.login({ email: 'nadie@averyn.test', password: MOCK_ACCOUNT.password });

    assert.deepEqual(wrongPassword, { ok: false, code: 'AUTH_INVALID_CREDENTIALS' });
    assert.deepEqual(unknownEmail, wrongPassword);
  });

  it('is case sensitive with the password', async () => {
    const result = await service.login({ email: MOCK_ACCOUNT.email, password: MOCK_ACCOUNT.password.toLowerCase() });

    assert.equal(result.ok, false);
  });
});
