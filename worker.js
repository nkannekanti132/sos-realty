/**
 * Cloudflare Worker for SOS Realty.
 * Serves the site through the ASSETS binding and stores our tables in D1.
 * Listing facts stay in the Trestle feed. This database stores everything we own.
 */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS assumable_data (
    unique_id TEXT PRIMARY KEY, listing_key TEXT UNIQUE NOT NULL, interest_rate REAL,
    remaining_balance REAL, down_payment_required REAL, rental_restrictions TEXT NOT NULL DEFAULT 'Not known',
    balance_loan_term INTEGER)`,
  `CREATE TABLE IF NOT EXISTS custom_categories (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, icon TEXT, badge TEXT, note TEXT)`,
  `CREATE TABLE IF NOT EXISTS custom_fields (
    id TEXT PRIMARY KEY, category_id TEXT, name TEXT NOT NULL, type TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS custom_values (
    listing_key TEXT NOT NULL, field_id TEXT NOT NULL, value TEXT NOT NULL,
    PRIMARY KEY (listing_key, field_id))`,
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT,
    role TEXT NOT NULL, phone TEXT, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, intent TEXT, source TEXT, home TEXT,
    message TEXT, status TEXT NOT NULL DEFAULT 'New', submitted_at TEXT NOT NULL, sample INTEGER NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, client_id TEXT, home_id INTEGER NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS saved_searches (
    id TEXT PRIMARY KEY, user_id INTEGER, client_id TEXT, payload TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY, user_id INTEGER, client_id TEXT, payload TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, payload TEXT, created_at TEXT NOT NULL)`
];

const ASSUMABLE = [
  ['AD-GLVAR24001','GLVAR24001',2.75,598000,177000,'Not known',312],
  ['AD-GLVAR24002','GLVAR24002',2.875,712000,null,'No',300],
  ['AD-GLVAR24004','GLVAR24004',3.125,472000,387000,'Yes',288],
  ['AD-GLVAR24005','GLVAR24005',3.25,905000,null,'Not known',336],
  ['AD-GLVAR24007','GLVAR24007',2.5,402000,97000,'No',324],
  ['AD-GLVAR24008','GLVAR24008',2.99,455000,null,'Not known',312],
  ['AD-GLVAR24010','GLVAR24010',2.625,512000,173000,'Yes',276],
  ['AD-GLVAR24012','GLVAR24012',2.25,468000,null,'No',348]
];
const CATEGORIES = [['cat-verification','Verification','check','Verified','Shows on the public card when any field in this category is set.']];
const FIELDS = [
  ['fld-loan-program',null,'Loan program','text'],
  ['fld-loan-verified','cat-verification','Loan verified','yes_no'],
  ['fld-servicer','cat-verification','Servicer confirmed','yes_no'],
  ['fld-rate','cat-verification','Rate verified','yes_no'],
  ['fld-balance','cat-verification','Balance verified','yes_no'],
  ['fld-photos','cat-verification','Photos verified','yes_no']
];
const VALUES = [
  ['GLVAR24001','fld-loan-program','VA'],['GLVAR24002','fld-loan-program','VA'],
  ['GLVAR24004','fld-loan-program','FHA'],['GLVAR24005','fld-loan-program','VA'],
  ['GLVAR24007','fld-loan-program','FHA'],['GLVAR24008','fld-loan-program','FHA'],
  ['GLVAR24010','fld-loan-program','VA'],['GLVAR24012','fld-loan-program','VA'],
  ['GLVAR24001','fld-loan-verified','Yes'],['GLVAR24001','fld-servicer','Yes'],['GLVAR24001','fld-photos','Yes'],
  ['GLVAR24004','fld-loan-verified','Yes'],['GLVAR24004','fld-rate','Yes'],
  ['GLVAR24007','fld-loan-verified','Yes'],['GLVAR24007','fld-servicer','Yes'],['GLVAR24007','fld-rate','Yes'],['GLVAR24007','fld-balance','Yes'],
  ['GLVAR24012','fld-loan-verified','Yes']
];
const USERS = [
  [1,'Janardhan Vangala','admin@sosrealty.demo','Admin@2026','admin','(702) 215-1838','2026-09-01T16:00:00Z'],
  [2,'Alex Morgan','buyer@sosrealty.demo','Buyer@2026','user','(702) 555-0142','2026-10-04T18:20:00Z'],
  [3,'Priya Natarajan','priya.n@example.com',null,'user','(702) 555-0175','2026-10-12T15:05:00Z'],
  [4,'Marcus Reed','marcus.reed@example.com',null,'user','(725) 555-0110','2026-10-19T21:40:00Z'],
  [5,'Dana Whitfield','dana.w@example.com',null,'user','','2026-10-28T17:12:00Z'],
  [6,'Luis Ortega','l.ortega@example.com',null,'user','(702) 555-0193','2026-11-03T14:30:00Z']
];
const LEADS = [
  ['L-1001','Priya Natarajan','priya.n@example.com','(702) 555-0175','tour','property-detail','The North Star','Can we see it Saturday? We have a VA certificate.','2026-11-08T16:22:00Z'],
  ['L-1002','Marcus Reed','marcus.reed@example.com','(725) 555-0110','buy','assumable','The Heritage House','Interested in assuming the 2.25% VA loan.','2026-11-07T19:03:00Z'],
  ['L-1003','Grace Kim','grace.kim@example.com','','sell','valuation','—','Henderson 4 bed, thinking of listing in spring.','2026-11-06T13:47:00Z'],
  ['L-1004','Dana Whitfield','dana.w@example.com','','info','search','The Desert Horizon','What is the equity gap on this one?','2026-11-04T22:15:00Z'],
  ['L-1005','Tom Becker','tbecker@example.com','(702) 555-0128','buy','community-detail','—','Relocating from Denver, Boulder City only.','2026-11-02T17:30:00Z'],
  ['L-1006','Luis Ortega','l.ortega@example.com','(702) 555-0193','tour','map','The Mesa Collection','FHA assumption — what credit score is needed?','2026-10-30T15:58:00Z']
];

function json(data, status = 200, cookies = []) {
  const headers = new Headers({ 'content-type': 'application/json; charset=utf-8' });
  cookies.forEach(c => headers.append('Set-Cookie', c));
  return new Response(JSON.stringify(data), { status, headers });
}
function cookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  const match = raw.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[1]) : '';
}
function setCookie(name, value, maxAge, httpOnly, request) {
  const https = request && new URL(request.url).protocol === 'https:';
  const flags = (httpOnly ? 'HttpOnly; ' : '') + (https ? 'Secure; ' : '') + 'SameSite=Lax; Path=/; Max-Age=' + maxAge;
  return name + '=' + encodeURIComponent(value) + '; ' + flags;
}
async function hashPassword(password, saltBytes) {
  const salt = saltBytes || crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  const saltB64 = btoa(String.fromCharCode(...salt));
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return 'pbkdf2$' + saltB64 + '$' + hashB64;
}
async function checkPassword(password, stored) {
  if (!stored || !password) return false;
  const [, saltB64, hashB64] = String(stored).split('$');
  if (!saltB64 || !hashB64) return false;
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const next = await hashPassword(password, salt);
  return next === 'pbkdf2$' + saltB64 + '$' + hashB64;
}
function publicUser(row) {
  if (!row) return null;
  return { id: row.id, name: row.name, email: row.email, role: row.role, phone: row.phone || '', createdAt: row.created_at };
}
async function ensure(env) {
  await env.DB.batch(SCHEMA.map(sql => env.DB.prepare(sql)));
  const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first();
  if (count && count.n) return;
  const stmts = [];
  for (const row of ASSUMABLE) stmts.push(env.DB.prepare('INSERT INTO assumable_data (unique_id, listing_key, interest_rate, remaining_balance, down_payment_required, rental_restrictions, balance_loan_term) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(...row));
  for (const row of CATEGORIES) stmts.push(env.DB.prepare('INSERT INTO custom_categories (id, name, icon, badge, note) VALUES (?, ?, ?, ?, ?)').bind(...row));
  for (const row of FIELDS) stmts.push(env.DB.prepare('INSERT INTO custom_fields (id, category_id, name, type) VALUES (?, ?, ?, ?)').bind(...row));
  for (const row of VALUES) stmts.push(env.DB.prepare('INSERT INTO custom_values (listing_key, field_id, value) VALUES (?, ?, ?)').bind(...row));
  for (const row of USERS) {
    const hash = row[3] ? await hashPassword(row[3]) : null;
    stmts.push(env.DB.prepare('INSERT INTO users (id, name, email, password_hash, role, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(row[0], row[1], row[2], hash, row[4], row[5], row[6]));
  }
  for (const row of LEADS) stmts.push(env.DB.prepare("INSERT INTO leads (id, name, email, phone, intent, source, home, message, status, submitted_at, sample) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, 1)").bind(...row));
  if (stmts.length) await env.DB.batch(stmts);
}
async function currentUser(env, request) {
  const sid = cookie(request, 'sos_session');
  if (!sid) return null;
  return env.DB.prepare('SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.id = ?').bind(sid).first();
}
async function readState(env, request) {
  const user = await currentUser(env, request);
  const client = cookie(request, 'sos_client');
  const [assumable, categories, fields, values, users, leads, favorites, searches, alerts, events] = await Promise.all([
    env.DB.prepare('SELECT * FROM assumable_data').all(),
    env.DB.prepare('SELECT * FROM custom_categories').all(),
    env.DB.prepare('SELECT * FROM custom_fields').all(),
    env.DB.prepare('SELECT * FROM custom_values').all(),
    env.DB.prepare('SELECT id, name, email, role, phone, created_at FROM users ORDER BY id').all(),
    env.DB.prepare('SELECT * FROM leads ORDER BY submitted_at DESC').all(),
    user
      ? env.DB.prepare('SELECT home_id FROM favorites WHERE user_id = ?').bind(user.id).all()
      : env.DB.prepare('SELECT home_id FROM favorites WHERE client_id = ? AND user_id IS NULL').bind(client).all(),
    user
      ? env.DB.prepare('SELECT * FROM saved_searches WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all()
      : env.DB.prepare('SELECT * FROM saved_searches WHERE client_id = ? AND user_id IS NULL ORDER BY created_at DESC').bind(client).all(),
    user
      ? env.DB.prepare('SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all()
      : env.DB.prepare('SELECT * FROM alerts WHERE client_id = ? AND user_id IS NULL ORDER BY created_at DESC').bind(client).all(),
    env.DB.prepare('SELECT type, payload, created_at FROM events ORDER BY id DESC LIMIT 3000').all()
  ]);
  const num = v => v == null ? null : Number(v);
  return {
    mode: 'database',
    user: publicUser(user),
    assumable_data: assumable.results.map(r => ({ unique_id: r.unique_id, listing_key: r.listing_key, interest_rate: num(r.interest_rate), remaining_balance: num(r.remaining_balance), down_payment_required: num(r.down_payment_required), rental_restrictions: r.rental_restrictions || 'Not known', balance_loan_term: num(r.balance_loan_term) })),
    custom_categories: categories.results,
    custom_fields: fields.results.map(r => ({ ...r, category_id: r.category_id || null })),
    custom_values: values.results,
    users: users.results.map(r => ({ id: r.id, name: r.name, email: r.email, role: r.role, phone: r.phone || '', createdAt: r.created_at })),
    leads: leads.results.map(r => ({ id: r.id, name: r.name, email: r.email, phone: r.phone, intent: r.intent, source: r.source, home: r.home, message: r.message, status: r.status, submittedAt: r.submitted_at, sample: !!r.sample })),
    favorites: favorites.results.map(r => r.home_id),
    savedSearches: searches.results.map(r => ({ ...JSON.parse(r.payload), id: r.id, createdAt: r.created_at })),
    alerts: alerts.results.map(r => ({ ...JSON.parse(r.payload), id: r.id, active: !!r.active, createdAt: r.created_at })),
    events: events.results.map(r => ({ type: r.type, ...(r.payload ? JSON.parse(r.payload) : {}), at: r.created_at })).reverse()
  };
}
function owner(user, client) {
  return user ? { column: 'user_id', value: user.id } : { column: 'client_id', value: client };
}
async function mutate(env, request, body) {
  const user = await currentUser(env, request);
  const client = cookie(request, 'sos_client');
  const admin = user && user.role === 'admin';
  const { action, payload = {} } = body || {};
  const own = owner(user, client);
  if (action === 'assumable.save') {
    if (!admin) return json({ ok: false, error: 'Admins only.' }, 403);
    const key = payload.listingKey;
    const patch = payload.patch || {};
    const existing = await env.DB.prepare('SELECT * FROM assumable_data WHERE listing_key = ?').bind(key).first();
    const row = existing || { unique_id: 'AD-' + key, listing_key: key, interest_rate: null, remaining_balance: null, down_payment_required: null, rental_restrictions: 'Not known', balance_loan_term: null };
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === '' || v === null) return;
      if (k === 'interest_rate') row.interest_rate = Number(Number(v).toFixed(3));
      else if (k === 'remaining_balance' || k === 'down_payment_required' || k === 'balance_loan_term') row[k] = Number(v);
      else if (k === 'rental_restrictions') row.rental_restrictions = ['Yes', 'No', 'Not known'].includes(v) ? v : 'Not known';
    });
    await env.DB.prepare('INSERT INTO assumable_data (unique_id, listing_key, interest_rate, remaining_balance, down_payment_required, rental_restrictions, balance_loan_term) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(listing_key) DO UPDATE SET interest_rate = excluded.interest_rate, remaining_balance = excluded.remaining_balance, down_payment_required = excluded.down_payment_required, rental_restrictions = excluded.rental_restrictions, balance_loan_term = excluded.balance_loan_term').bind(row.unique_id, key, row.interest_rate, row.remaining_balance, row.down_payment_required, row.rental_restrictions || 'Not known', row.balance_loan_term).run();
    return json({ ok: true });
  }
  if (action === 'assumable.remove') {
    if (!admin) return json({ ok: false, error: 'Admins only.' }, 403);
    await env.DB.prepare('DELETE FROM assumable_data WHERE listing_key = ?').bind(payload.listingKey).run();
    return json({ ok: true });
  }
  if (action === 'assumable.reset') {
    if (!admin) return json({ ok: false, error: 'Admins only.' }, 403);
    const key = payload.listingKey;
    const seed = ASSUMABLE.find(r => r[1] === key);
    await env.DB.prepare('DELETE FROM assumable_data WHERE listing_key = ?').bind(key).run();
    await env.DB.prepare('DELETE FROM custom_values WHERE listing_key = ?').bind(key).run();
    if (seed) await env.DB.prepare('INSERT INTO assumable_data (unique_id, listing_key, interest_rate, remaining_balance, down_payment_required, rental_restrictions, balance_loan_term) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(...seed).run();
    for (const row of VALUES.filter(v => v[0] === key)) await env.DB.prepare('INSERT INTO custom_values (listing_key, field_id, value) VALUES (?, ?, ?)').bind(...row).run();
    return json({ ok: true });
  }
  if (action === 'category.create') {
    if (!admin) return json({ ok: false, error: 'Admins only.' }, 403);
    const name = String(payload.name || '').trim();
    if (!name) return json({ ok: false, error: 'A category needs a name.' }, 400);
    await env.DB.prepare('INSERT INTO custom_categories (id, name, icon, badge, note) VALUES (?, ?, ?, ?, ?)').bind(payload.id, name, payload.icon || '', payload.badge || '', payload.note || '').run();
    return json({ ok: true });
  }
  if (action === 'field.create') {
    if (!admin) return json({ ok: false, error: 'Admins only.' }, 403);
    const name = String(payload.name || '').trim();
    if (!name) return json({ ok: false, error: 'A field needs a name.' }, 400);
    await env.DB.prepare('INSERT INTO custom_fields (id, category_id, name, type) VALUES (?, ?, ?, ?)').bind(payload.id, payload.category_id || null, name, payload.type || 'text').run();
    return json({ ok: true });
  }
  if (action === 'value.set') {
    if (!admin) return json({ ok: false, error: 'Admins only.' }, 403);
    await env.DB.prepare('DELETE FROM custom_values WHERE listing_key = ? AND field_id = ?').bind(payload.listingKey, payload.fieldId).run();
    if (payload.value != null && String(payload.value).trim() !== '') await env.DB.prepare('INSERT INTO custom_values (listing_key, field_id, value) VALUES (?, ?, ?)').bind(payload.listingKey, payload.fieldId, String(payload.value).trim()).run();
    return json({ ok: true });
  }
  if (action === 'lead.add') {
    const id = payload.id || ('L-' + Date.now());
    await env.DB.prepare('INSERT INTO leads (id, name, email, phone, intent, source, home, message, status, submitted_at, sample) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)').bind(id, payload.name || '', payload.email || '', payload.phone || '', payload.intent || 'info', payload.source || '', payload.home || '—', payload.message || '', payload.status || 'New', payload.submittedAt || new Date().toISOString()).run();
    return json({ ok: true, id });
  }
  if (action === 'lead.status') {
    if (!admin) return json({ ok: false, error: 'Admins only.' }, 403);
    await env.DB.prepare('UPDATE leads SET status = ? WHERE id = ?').bind(payload.status, String(payload.id)).run();
    return json({ ok: true });
  }
  if (action === 'favorite.toggle') {
    const homeId = Number(payload.homeId);
    const existing = user
      ? await env.DB.prepare('SELECT id FROM favorites WHERE user_id = ? AND home_id = ?').bind(user.id, homeId).first()
      : await env.DB.prepare('SELECT id FROM favorites WHERE client_id = ? AND user_id IS NULL AND home_id = ?').bind(client, homeId).first();
    if (existing) await env.DB.prepare('DELETE FROM favorites WHERE id = ?').bind(existing.id).run();
    else await env.DB.prepare('INSERT INTO favorites (user_id, client_id, home_id, created_at) VALUES (?, ?, ?, ?)').bind(user ? user.id : null, user ? null : client, homeId, new Date().toISOString()).run();
    return json({ ok: true });
  }
  if (action === 'search.save') {
    await env.DB.prepare('INSERT INTO saved_searches (id, user_id, client_id, payload, created_at) VALUES (?, ?, ?, ?, ?)').bind(payload.id, user ? user.id : null, user ? null : client, JSON.stringify(payload.data || {}), payload.createdAt).run();
    return json({ ok: true });
  }
  if (action === 'search.remove') {
    await env.DB.prepare('DELETE FROM saved_searches WHERE id = ? AND (' + own.column + ' = ?)').bind(String(payload.id), own.value).run();
    return json({ ok: true });
  }
  if (action === 'alert.save') {
    await env.DB.prepare('INSERT INTO alerts (id, user_id, client_id, payload, active, created_at) VALUES (?, ?, ?, ?, 1, ?)').bind(payload.id, user ? user.id : null, user ? null : client, JSON.stringify(payload.data || {}), payload.createdAt).run();
    return json({ ok: true });
  }
  if (action === 'alert.toggle') {
    await env.DB.prepare('UPDATE alerts SET active = CASE active WHEN 1 THEN 0 ELSE 1 END WHERE id = ? AND (' + own.column + ' = ?)').bind(String(payload.id), own.value).run();
    return json({ ok: true });
  }
  if (action === 'user.update') {
    if (!admin) return json({ ok: false, error: 'Admins only.' }, 403);
    if (payload.role) await env.DB.prepare('UPDATE users SET role = ? WHERE id = ?').bind(payload.role, Number(payload.id)).run();
    return json({ ok: true });
  }
  if (action === 'user.delete') {
    if (!admin) return json({ ok: false, error: 'Admins only.' }, 403);
    if (user.id === Number(payload.id)) return json({ ok: false, error: 'You cannot remove your own account.' }, 400);
    await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(Number(payload.id)).run();
    return json({ ok: true });
  }
  if (action === 'event.add') {
    await env.DB.prepare('INSERT INTO events (type, payload, created_at) VALUES (?, ?, ?)').bind(payload.type || 'view', JSON.stringify(payload.data || {}), payload.at || new Date().toISOString()).run();
    return json({ ok: true });
  }
  return json({ ok: false, error: 'Unknown action.' }, 400);
}
async function resetDatabase(env, request) {
  const user = await currentUser(env, request);
  if (!user || user.role !== 'admin') return json({ ok: false, error: 'Admins only.' }, 403);
  await env.DB.batch(['sessions','favorites','saved_searches','alerts','events','leads','custom_values','custom_fields','custom_categories','assumable_data','users'].map(table => env.DB.prepare('DELETE FROM ' + table)));
  await ensure(env);
  return json({ ok: true });
}
async function signIn(env, request, body) {
  const email = String(body.email || '').trim().toLowerCase();
  const user = await env.DB.prepare('SELECT * FROM users WHERE lower(email) = ?').bind(email).first();
  if (!user) return json({ ok: false, error: 'No account uses that email. Create one, or use a demo account below.' });
  if (!(await checkPassword(body.password, user.password_hash))) return json({ ok: false, error: 'That password does not match. Check it and try again.' });
  const sid = crypto.randomUUID();
  await env.DB.prepare('INSERT INTO sessions (id, user_id, created_at) VALUES (?, ?, ?)').bind(sid, user.id, new Date().toISOString()).run();
  return json({ ok: true, user: publicUser(user) }, 200, [setCookie('sos_session', sid, 60 * 60 * 24 * 30, true, request)]);
}
async function signUp(env, request, body) {
  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim();
  if (!name) return json({ ok: false, error: 'Enter your name.' });
  if (String(body.password || '').length < 8) return json({ ok: false, error: 'Use a password with at least 8 characters.' });
  const existing = await env.DB.prepare('SELECT id FROM users WHERE lower(email) = ?').bind(email).first();
  if (existing) return json({ ok: false, error: 'An account with that email already exists. Sign in instead.' });
  const max = await env.DB.prepare('SELECT COALESCE(MAX(id), 0) AS n FROM users').first();
  const id = Number(max.n) + 1;
  const created = new Date().toISOString();
  await env.DB.prepare('INSERT INTO users (id, name, email, password_hash, role, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, name, email, await hashPassword(body.password), 'user', body.phone || '', created).run();
  const sid = crypto.randomUUID();
  await env.DB.prepare('INSERT INTO sessions (id, user_id, created_at) VALUES (?, ?, ?)').bind(sid, id, created).run();
  return json({ ok: true, user: { id, name, email, role: 'user', phone: body.phone || '', createdAt: created } }, 200, [setCookie('sos_session', sid, 60 * 60 * 24 * 30, true, request)]);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      await ensure(env);
      const client = cookie(request, 'sos_client') || crypto.randomUUID();
      const clientCookie = cookie(request, 'sos_client') ? [] : [setCookie('sos_client', client, 60 * 60 * 24 * 365, false, request)];
      if (url.pathname === '/api/state' && request.method === 'GET') {
        const state = await readState(env, request);
        return json(state, 200, clientCookie);
      }
      if (url.pathname === '/api/auth/sign-in' && request.method === 'POST') return signIn(env, request, await request.json());
      if (url.pathname === '/api/auth/sign-up' && request.method === 'POST') return signUp(env, request, await request.json());
      if (url.pathname === '/api/auth/sign-out' && request.method === 'POST') {
        const sid = cookie(request, 'sos_session');
        if (sid) await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sid).run();
        return json({ ok: true }, 200, [setCookie('sos_session', '', 0, true, request)]);
      }
      if (url.pathname === '/api/mutate' && request.method === 'POST') return mutate(env, request, await request.json());
      if (url.pathname === '/api/reset' && request.method === 'POST') return resetDatabase(env, request);
      return json({ ok: false, error: 'Not found.' }, 404);
    } catch (error) {
      return json({ ok: false, error: error.message || 'Database error.' }, 500);
    }
  }
};
