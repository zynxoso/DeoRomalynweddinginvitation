import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('Sheets saves once, escapes formulas and queues email without losing RSVPs', () => {
  const rows: unknown[][] = [['Submission ID']];
  const props: Record<string, string> = { RSVP_SECRET: 'test-only-secret' };
  let quota = 0, messages = 0, locked = false;
  const range = (row: number, col: number, height = 1, width = 1) => ({
    getValue: () => rows[row - 1]?.[col - 1],
    getValues: () => rows.slice(row - 1, row - 1 + height).map(r => r.slice(col - 1, col - 1 + width)),
    setValues: (values: unknown[][]) => values.forEach((r, i) => r.forEach((v, j) => { rows[row - 1 + i][col - 1 + j] = v; })),
    createTextFinder: (id: string) => ({ matchEntireCell: () => ({ findNext: () => {
      const index = rows.findIndex(r => r[0] === id);
      return index < 0 ? null : { getRow: () => index + 1 };
    } }) })
  });
  const sheet = { getLastRow: () => rows.length, getRange: (row: number | string, col = 1, height = 1, width = 1) => typeof row === 'string' ? range(1, 1) : range(row, col, height, width), appendRow: (r: unknown[]) => rows.push(r) };
  const context = vm.createContext({
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush: () => {} },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k: string) => props[k] ?? null, getProperties: () => ({ ...props }), setProperty: (k: string, v: string) => { props[k] = v; }, deleteProperty: (k: string) => { delete props[k]; } }) },
    LockService: { getScriptLock: () => ({ tryLock: () => { assert.equal(locked, false); locked = true; return true; }, releaseLock: () => { locked = false; } }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (text: string) => ({ setMimeType: () => JSON.parse(text) }) },
    MailApp: { getRemainingDailyQuota: () => quota, sendEmail: () => { messages++; quota--; } },
    ScriptApp: { getProjectTriggers: () => [{ getHandlerFunction: () => 'retryNotifications' }] }
  });
  vm.runInContext(fs.readFileSync(new URL('../integrations/google-apps-script/Code.gs', import.meta.url), 'utf8'), context);
  const payload = { secret: props.RSVP_SECRET, name: 'Test Guest', attendance: 'accept', message: '=IMPORTXML("test")', submissionId: 'd9f174f4-b5c1-4a52-90ab-1169c7495812', clientKey: 'a'.repeat(64) };
  const post = (body = payload) => context.doPost({ postData: { contents: JSON.stringify(body) } });
  assert.equal(post({ ...payload, secret: 'wrong' }).ok, false);
  assert.equal(rows.length, 1);
  assert.equal(post().ok, true);
  assert.equal(rows.length, 2);
  assert.equal(rows[1][4], "'" + payload.message);
  assert.equal(rows[1][5], 'Pending');
  assert.equal(messages, 0);
  assert.equal(post().ok, true);
  assert.equal(rows.length, 2);
  assert.equal(post({ ...payload, name: 'Different Guest' }).code, 'conflict');
  quota = 10;
  context.retryNotifications();
  assert.equal(rows[1][5], 'Sent');
  assert.equal(messages, 1);
  context.retryNotifications();
  assert.equal(messages, 1);
  assert.equal(locked, false);
  props['limit:' + payload.clientKey] = JSON.stringify({ count: 15, until: Date.now() + 60000 });
  assert.equal(post({ ...payload, submissionId: 'd9f174f4-b5c1-4a52-90ab-1169c7495813' }).code, 'rate_limit');
  assert.equal(rows.length, 2);
});
