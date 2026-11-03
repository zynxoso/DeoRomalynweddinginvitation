import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRsvp } from '../lib/rsvp-delivery.ts';

test('RSVP API confirms storage, handles failures, and rejects unsafe requests', async () => {
  const old = { ...process.env };
  const payload = { name: 'Test Guest', attendance: 'accept', message: 'Hello', submissionId: 'd9f174f4-b5c1-4a52-90ab-1169c7495812' };
  const request = (body: unknown = payload, origin = 'http://localhost:3000') => new Request('http://localhost:3000/api/rsvp', {
    method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  let calls = 0;
  const send: typeof fetch = async (_url, options) => {
    calls++;
    const body = JSON.parse(String(options?.body));
    assert.equal(body.name, 'Test Guest');
    assert.equal(body.clientKey.length, 64);
    assert.equal(body.secret, 'test-secret-'.repeat(4));
    return Response.json({ ok: true, submissionId: body.submissionId });
  };
  try {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.RSVP_ENABLED = 'false';
    assert.equal((await handleRsvp(request(), send)).status, 503);
    process.env.RSVP_ENABLED = 'true';
    process.env.RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/test/exec';
    process.env.RSVP_SCRIPT_SECRET = 'test-secret-'.repeat(4);
    assert.equal((await handleRsvp(request(payload, 'https://unrelated.example'), send)).status, 403);
    assert.equal((await handleRsvp(request({ ...payload, website: 'spam' }), send)).status, 400);
    assert.equal((await handleRsvp(request({ ...payload, name: ' ' }), send)).status, 400);
    assert.equal((await handleRsvp(request({ ...payload, message: 'x'.repeat(10000) }), send)).status, 413);
    assert.equal(calls, 0);
    const saved = await handleRsvp(request(), send);
    assert.equal(saved.status, 200);
    assert.deepEqual(await saved.json(), { ok: true });
    assert.equal((await handleRsvp(request(), async () => { throw new Error('network down'); })).status, 503);
    assert.equal((await handleRsvp(request(), async () => Response.json({ ok: true, submissionId: 'wrong-id' }))).status, 503);
    assert.equal((await handleRsvp(request(), async () => Response.json({ ok: false, code: 'rate_limit' }))).status, 429);
    assert.equal((await handleRsvp(request(), async () => Response.json({ ok: false, code: 'conflict' }))).status, 409);
  } finally {
    for (const key of ['RSVP_ENABLED', 'RSVP_SCRIPT_URL', 'RSVP_SCRIPT_SECRET', 'NEXT_PUBLIC_SITE_URL']) {
      if (old[key] === undefined) delete process.env[key]; else process.env[key] = old[key];
    }
  }
});
