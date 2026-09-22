/** Integration check of the compiled Worker with disposable D1 state. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const wranglerRequire = createRequire(require.resolve('wrangler'));
const { Miniflare } = wranglerRequire('miniflare');
const root = resolve(import.meta.dirname, '..');
const managementKey = 'local-test-only-'.repeat(5);
const serverRoot = resolve(root, 'dist/server');
const serverFiles = (await readdir(serverRoot, { recursive: true })).filter(f => f.endsWith('.js'));
const modules = ['index.js', ...serverFiles.filter(f => f !== 'index.js')].map(f => ({ type: 'ESModule', path: resolve(serverRoot, f) }));
const mf = new Miniflare({ modules, modulesRoot: serverRoot, compatibilityDate: '2026-05-15', compatibilityFlags: ['nodejs_compat'], d1Databases: { DB: 'ephemeral-test' }, bindings: { MANAGEMENT_KEY: managementKey } });
try {
  const db = await mf.getD1Database('DB');
  for (const file of (await readdir(resolve(root, 'drizzle'))).filter(f => f.endsWith('.sql')).sort()) {
    const sql = await readFile(resolve(root, 'drizzle', file), 'utf8');
    for (const statement of sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean)) await db.prepare(statement).run();
  }
  const origin = 'https://redwood.test';
  const request = async (path, data, authenticated = false, customOrigin = origin) => {
    const response = await mf.dispatchFetch(origin + path, { method: data ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', Origin: customOrigin, 'cf-connecting-ip': '127.0.0.1', ...(authenticated ? { Authorization: `Bearer ${managementKey}` } : {}) }, ...(data ? { body: JSON.stringify(data) } : {}) });
    return { status: response.status, data: await response.json() };
  };
  assert.equal((await request('/api/manage')).status, 401);
  assert.equal((await request('/api/manage', { action: 'create_code' }, true, 'https://elsewhere.test')).status, 403);
  const created = await request('/api/manage', { action: 'create_code' }, true);
  assert.equal(created.status, 201); assert.match(created.data.code, /^[A-Z2-9]{8}$/);
  const review = { code: created.data.code, name: 'Local Test', town: 'Felton', message: 'Local integration check, not a real customer testimonial.', consent: true, website: '' };
  assert.equal((await request('/api/testimonials', { ...review, consent: false })).status, 400);
  assert.equal((await request('/api/testimonials', { ...review, code: 'ZZZZZZZZ' })).status, 400);
  const simultaneous = await Promise.all([request('/api/testimonials', review), request('/api/testimonials', review)]);
  assert.deepEqual(simultaneous.map(r => r.status).sort(), [201, 400]);
  const id = simultaneous.find(r => r.status === 201).data.id;
  assert.equal((await request('/api/testimonials')).data.testimonials.length, 0);
  assert.equal((await request('/api/manage', { action: 'moderate', id, status: 'approved' }, true)).status, 200);
  assert.equal((await request('/api/testimonials')).data.testimonials.length, 1);
  assert.equal((await request('/api/manage', { action: 'moderate', id, status: 'hidden' }, true)).status, 200);
  assert.equal((await request('/api/testimonials')).data.testimonials.length, 0);
  const expired = await request('/api/manage', { action: 'create_code' }, true);
  await db.prepare('UPDATE invitations SET expires_at = 0').run();
  assert.equal((await request('/api/testimonials', { ...review, code: expired.data.code })).status, 400);
  for (let attempt = 0; attempt < 31; attempt++) await request('/api/testimonials', { ...review, code: 'ZZZZZZZZ' });
  assert.equal((await request('/api/testimonials', review)).status, 429);
  console.log('PASS: authorization, origin, consent, invalid/expired codes, concurrent single use, approval, hiding, and rate limit.');
} finally { await mf.dispose(); }
