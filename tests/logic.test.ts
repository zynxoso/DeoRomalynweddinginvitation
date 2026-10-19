import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCountdown } from '../lib/countdown.ts';
import { rsvpSchema } from '../lib/rsvp.ts';

test('wedding countdown uses Philippine midnight independent of host timezone', () => {
  const target = '2026-12-23T00:00:00+08:00';
  assert.deepEqual(getCountdown(target, Date.parse('2026-12-21T15:58:59Z')), { days: 1, hours: 0, minutes: 1, seconds: 1, complete: false });
  assert.deepEqual(getCountdown(target, Date.parse('2026-12-22T16:00:00Z')), { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true });
  assert.equal(getCountdown(target, Date.parse('2027-01-01T00:00:00Z')).seconds, 0);
});
test('RSVP rejects blank names, missing attendance and overlong messages', () => {
  assert.equal(rsvpSchema.safeParse({ name: '  ', attendance: 'accept', message: '' }).success, false);
  assert.equal(rsvpSchema.safeParse({ name: 'Guest Name', attendance: null, message: '' }).success, false);
  assert.equal(rsvpSchema.safeParse({ name: 'Guest Name', attendance: 'accept', message: 'a'.repeat(1001) }).success, false);
  assert.deepEqual(rsvpSchema.parse({ name: '  Guest Name  ', attendance: 'decline', message: ' With love. ' }), { name: 'Guest Name', attendance: 'decline', message: 'With love.' });
});
