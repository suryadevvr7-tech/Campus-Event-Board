import test, { after } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/campus_event_board_test';
process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.FRONTEND_URL = 'http://localhost:5173';

const path = await import('node:path');
const fs = await import('node:fs/promises');
const { MongoMemoryServer } = await import('mongodb-memory-server');
const dbPath = path.join(process.cwd(), '.test-mongodb-' + process.pid);
await fs.mkdir(dbPath, { recursive: true });
const memory = await MongoMemoryServer.create({ instance: { dbPath } });
process.env.MONGODB_URI = memory.getUri();
const mongoose = (await import('mongoose')).default;
const { connectDatabase } = await import('../src/config/database.js');
const { default: app } = await import('../src/app.js');

await connectDatabase();
const server = app.listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

async function call(path, { method = 'GET', body, cookie, origin } = {}) {
  return fetch(`${base}${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(cookie ? { cookie } : {}),
      ...(origin ? { origin } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
}
async function register(role, email) {
  const response = await call('/api/auth/register', { method: 'POST', body: { name: role === 'organizer' ? 'Campus Organizer' : 'Curious Student', email, password: 'Campus1234', role } });
  const data = await response.json();
  return { response, data, cookie: response.headers.get('set-cookie')?.split(';')[0] };
}

test('complete account, authorization, event, and save flows', async () => {
  const health = await call('/api/health');
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok' });

  const invalid = await call('/api/auth/register', { method: 'POST', body: { name: 'A', email: 'bad', password: '123', role: 'attendee' } });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).error.code, 'VALIDATION_ERROR');

  const attendee = await register('attendee', 'student@example.test');
  assert.equal(attendee.response.status, 201);
  assert.equal(attendee.data.user.role, 'attendee');
  assert.equal('passwordHash' in attendee.data.user, false);
  assert.match(attendee.response.headers.get('set-cookie'), /HttpOnly/);
  assert.match(attendee.response.headers.get('set-cookie'), /SameSite=Strict/);

  const duplicate = await call('/api/auth/register', { method: 'POST', body: { name: 'Other Student', email: 'STUDENT@example.test', password: 'Campus1234', role: 'attendee' } });
  assert.equal(duplicate.status, 409);

  const badLogin = await call('/api/auth/login', { method: 'POST', body: { email: 'student@example.test', password: 'wrongpass1' } });
  assert.equal(badLogin.status, 401);
  assert.equal((await badLogin.json()).error.message, 'Email or password is incorrect.');

  const organizer = await register('organizer', 'organizer@example.test');
  assert.equal(organizer.response.status, 201);
  const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const endsAt = new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString();
  const eventPayload = { title: 'Student Design Meetup', description: 'Meet other students to share design work and exchange practical feedback.', category: 'Workshop', venue: 'Innovation Hall, Room 204', startsAt, endsAt };

  const anonymousCreate = await call('/api/events', { method: 'POST', body: eventPayload });
  assert.equal(anonymousCreate.status, 401);
  const attendeeCreate = await call('/api/events', { method: 'POST', body: eventPayload, cookie: attendee.cookie });
  assert.equal(attendeeCreate.status, 403);

  const created = await call('/api/events', { method: 'POST', body: eventPayload, cookie: organizer.cookie });
  assert.equal(created.status, 201);
  const { item } = await created.json();
  assert.equal(item.title, eventPayload.title);
  assert.equal(item.organizer.name, 'Campus Organizer');
  assert.equal('email' in item.organizer, false);

  const publicDetail = await call(`/api/events/${item.id}`, { cookie: attendee.cookie });
  assert.equal((await publicDetail.json()).item.saved, false);
  const saved = await call(`/api/events/${item.id}/save`, { method: 'POST', cookie: attendee.cookie });
  assert.equal(saved.status, 201);
  const savedList = await call('/api/events/saved', { cookie: attendee.cookie });
  assert.equal((await savedList.json()).items[0].id, item.id);

  const wrongOwner = await call(`/api/events/${item.id}`, { method: 'PATCH', cookie: attendee.cookie, body: { title: 'Changed Event Name' } });
  assert.equal(wrongOwner.status, 403);

  const secondOrganizer = await register('organizer', 'second@example.test');
  const otherOwner = await call(`/api/events/${item.id}`, { method: 'PATCH', cookie: secondOrganizer.cookie, body: { title: 'Changed Event Name' } });
  assert.equal(otherOwner.status, 403);

  const invalidRange = await call(`/api/events/${item.id}`, { method: 'PATCH', cookie: organizer.cookie, body: { startsAt: endsAt } });
  assert.equal(invalidRange.status, 400);

  const canceled = await call(`/api/events/${item.id}`, { method: 'PATCH', cookie: organizer.cookie, body: { status: 'cancelled' } });
  assert.equal(canceled.status, 200);
  assert.equal((await canceled.json()).item.status, 'cancelled');
  const hiddenFromBrowse = await call('/api/events');
  assert.equal((await hiddenFromBrowse.json()).items.length, 0);

  const badOrigin = await call('/api/auth/logout', { method: 'POST', origin: 'https://attacker.example' });
  assert.equal(badOrigin.status, 403);
  const tooMany = await call('/api/events?limit=21');
  assert.equal(tooMany.status, 400);

  const deleted = await call(`/api/events/${item.id}`, { method: 'DELETE', cookie: organizer.cookie });
  assert.equal(deleted.status, 204);
  const missing = await call(`/api/events/${item.id}`);
  assert.equal(missing.status, 404);
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  await memory.stop();
});




