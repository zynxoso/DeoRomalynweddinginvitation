// Private Google Sheet; no billing or paid APIs. Deploy as the owner.
const SHEET_ID = '1kbFyKYzgK0dgWFBRKrT57GR6sXCPeWM0LayxDs4-EUg';
const NOTIFY_EMAIL = 'janharrytech@gmail.com';

function setup() {
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('RSVP_SECRET')) properties.setProperty('RSVP_SECRET', Utilities.getUuid() + Utilities.getUuid());
  const book = SpreadsheetApp.openById(SHEET_ID);
  book.setSpreadsheetTimeZone('Asia/Manila');
  if (!book.getSheetByName('RSVP')) throw new Error('RSVP sheet missing');
  // Authorize mail before enabling the website. No message is sent by setup.
  MailApp.getRemainingDailyQuota();
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'retryNotifications')) {
    ScriptApp.newTrigger('retryNotifications').timeBased().everyHours(1).create();
  }
}

function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function textCell_(value) { return /^[=+\-@\t\r]/.test(value) ? "'" + value : value; }
function sameText_(stored, input) { return String(stored).replace(/^'(?=[=+\-@\t\r])/, '') === input; }
function sheet_() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('RSVP');
  if (!sheet || sheet.getRange('A1').getValue() !== 'Submission ID') throw new Error('Unexpected sheet layout');
  return sheet;
}

// Called only after authentication, validation and acquiring the script lock.
// Script properties survive cold starts; keep buckets bounded and expire them.
function limited_(clientKey) {
  const props = PropertiesService.getScriptProperties();
  const now = Date.now();
  const all = props.getProperties();
  let active = 0;
  Object.keys(all).filter(k => k.indexOf('limit:') === 0).forEach(k => {
    const value = JSON.parse(all[k]);
    if (value.until <= now) props.deleteProperty(k); else active++;
  });
  const key = 'limit:' + clientKey;
  let bucket = props.getProperty(key);
  bucket = bucket ? JSON.parse(bucket) : { count: 0, until: now + 600000 };
  if (bucket.count >= 15 || (bucket.count === 0 && active >= 1000)) return true;
  bucket.count++;
  props.setProperty(key, JSON.stringify(bucket));
  return false;
}

function doPost(event) {
  let input;
  try {
    const raw = event && event.postData && event.postData.contents;
    if (!raw || raw.length > 10000) return json_({ ok: false, code: 'invalid' });
    input = JSON.parse(raw);
  } catch (_) { return json_({ ok: false, code: 'invalid' }); }
  const secret = PropertiesService.getScriptProperties().getProperty('RSVP_SECRET');
  if (!secret || input.secret !== secret) return json_({ ok: false, code: 'unauthorized' });
  if (input.action === 'health') {
    try { sheet_(); return json_({ ok: true, ready: ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'retryNotifications') }); }
    catch (_) { return json_({ ok: false, code: 'unavailable' }); }
  }
  if (typeof input.name !== 'string' || input.name.trim().length < 2 || input.name.length > 100 ||
      !['accept', 'decline'].includes(input.attendance) || typeof input.message !== 'string' || input.message.length > 1000 ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.submissionId || '') ||
      !/^[0-9a-f]{64}$/.test(input.clientKey || '') || input.website) return json_({ ok: false, code: 'invalid' });
  input.name = input.name.trim(); input.message = input.message.trim();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ ok: false, code: 'busy' });
  try {
    const sheet = sheet_();
    const count = sheet.getLastRow();
    const existing = count > 1 ? sheet.getRange(2, 1, count - 1, 1).createTextFinder(input.submissionId).matchEntireCell(true).findNext() : null;
    if (existing) {
      const values = sheet.getRange(existing.getRow(), 3, 1, 3).getValues()[0];
      if (!sameText_(values[0], input.name) || values[1] !== input.attendance || !sameText_(values[2], input.message)) return json_({ ok: false, code: 'conflict' });
      return json_({ ok: true, submissionId: input.submissionId });
    }
    if (limited_(input.clientKey)) return json_({ ok: false, code: 'rate_limit' });
    sheet.appendRow([input.submissionId, new Date(), textCell_(input.name), input.attendance, textCell_(input.message), 'Pending', '']);
    SpreadsheetApp.flush();
    const row = sheet.getLastRow();
    // Once persisted, email failure must never turn a saved RSVP into a failure.
    try { notify_(sheet, row); } catch (_) { /* Hourly trigger retries Pending rows. */ }
    return json_({ ok: true, submissionId: input.submissionId });
  } catch (_) { return json_({ ok: false, code: 'unavailable' }); }
  finally { lock.releaseLock(); }
}

function notify_(sheet, row) {
  const values = sheet.getRange(row, 1, 1, 7).getValues()[0];
  if (values[5] !== 'Pending' || MailApp.getRemainingDailyQuota() < 1) return false;
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'Wedding RSVP — ' + String(values[2]).replace(/[\r\n]/g, ' '),
    body: 'Deo & Romalyn received an RSVP.\n\nName: ' + values[2] + '\nAttendance: ' +
      (values[3] === 'accept' ? 'Attending' : 'Not attending') + '\nMessage: ' + (values[4] || '(No message)') +
      '\n\nReference: ' + values[0] + '\nView responses: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit',
    name: 'Deo & Romalyn RSVP'
  });
  sheet.getRange(row, 6, 1, 2).setValues([['Sent', new Date()]]);
  SpreadsheetApp.flush();
  return true;
}

function retryNotifications() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const sheet = sheet_();
    const count = sheet.getLastRow();
    if (count < 2) return;
    const statuses = sheet.getRange(2, 6, count - 1, 1).getValues();
    let sent = 0;
    for (let index = 0; index < statuses.length && sent < 25; index++) {
      if (statuses[index][0] !== 'Pending') continue;
      if (!notify_(sheet, index + 2)) break;
      sent++;
    }
  } finally { lock.releaseLock(); }
}
