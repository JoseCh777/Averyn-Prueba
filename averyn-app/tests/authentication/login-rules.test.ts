import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { describeLoginError } from '../../features/authentication/messages';
import {
  EMAIL_INVALID_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
  hasFieldErrors,
  validateLoginFields,
} from '../../features/authentication/validation';

describe('validateLoginFields', () => {
  it('accepts a well formed email and a password', () => {
    assert.deepEqual(validateLoginFields({ email: 'ana@organizacion.com', password: 'secreto' }), {});
  });

  it('asks for the email and the password when both are empty', () => {
    assert.deepEqual(validateLoginFields({ email: '', password: '' }), {
      email: EMAIL_REQUIRED_MESSAGE,
      password: PASSWORD_REQUIRED_MESSAGE,
    });
  });

  it('rejects an email without the expected shape', () => {
    for (const email of ['ana', 'ana@', 'ana@organizacion', '@organizacion.com', 'ana perez@organizacion.com']) {
      assert.equal(validateLoginFields({ email, password: 'secreto' }).email, EMAIL_INVALID_MESSAGE, email);
    }
  });

  it('reports only the field that is wrong', () => {
    assert.deepEqual(validateLoginFields({ email: 'ana@organizacion.com', password: '' }), {
      password: PASSWORD_REQUIRED_MESSAGE,
    });
  });
});

describe('hasFieldErrors', () => {
  it('is false without errors and true with any error', () => {
    assert.equal(hasFieldErrors({}), false);
    assert.equal(hasFieldErrors({ email: EMAIL_REQUIRED_MESSAGE }), true);
    assert.equal(hasFieldErrors({ password: PASSWORD_REQUIRED_MESSAGE }), true);
  });
});

describe('describeLoginError', () => {
  it('uses one message for invalid credentials, without saying which field failed', () => {
    const message = describeLoginError('AUTH_INVALID_CREDENTIALS');

    assert.match(message, /Credenciales inválidas/);
    assert.doesNotMatch(message, /contraseña es incorrecta|correo no existe/i);
  });

  it('rounds the wait of a rate limit up to whole minutes', () => {
    assert.match(describeLoginError('AUTH_TOO_MANY_ATTEMPTS', 61), /2 minutos/);
    assert.match(describeLoginError('AUTH_TOO_MANY_ATTEMPTS', 60), /1 minuto\./);
  });

  it('does not invent a wait time when the Core did not send one', () => {
    assert.match(describeLoginError('AUTH_TOO_MANY_ATTEMPTS'), /unos minutos/);
    assert.match(describeLoginError('AUTH_TOO_MANY_ATTEMPTS', 0), /unos minutos/);
  });

  it('has a message for every other error code', () => {
    assert.match(describeLoginError('SERVICE_UNAVAILABLE'), /servicio/);
    assert.match(describeLoginError('INTERNAL_ERROR'), /nuestro lado/);
  });
});
