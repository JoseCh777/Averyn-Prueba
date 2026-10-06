import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseSessionCookie } from './audit-settings';

describe('parseSessionCookie', () => {
  it('returns nothing when no cookie is given', () => {
    assert.equal(parseSessionCookie(undefined), undefined);
    assert.equal(parseSessionCookie('   '), undefined);
  });

  it('splits the name from the value', () => {
    assert.deepEqual(parseSessionCookie('averyn_mock_session=1'), { name: 'averyn_mock_session', value: '1' });
  });

  it('keeps an equals sign that belongs to the value', () => {
    assert.deepEqual(parseSessionCookie('token=abc=='), { name: 'token', value: 'abc==' });
  });

  it('rejects a text that is not name=value', () => {
    assert.throws(() => parseSessionCookie('sin-igual'), /name=value/);
    assert.throws(() => parseSessionCookie('=valor'), /name=value/);
  });
});
