import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findUserById, findUserByUsername, seedIfEmpty, updateCredentials } from './db';
import { initSchema } from './database';
import { signToken, verifyToken, TokenPayload } from './auth';

const app = express();
app.use(express.json());

// In production this same process serves the built frontend (vite build's
// dist/) alongside the API, so there's just one server to run and one port
// to point a reverse proxy at.
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const isProduction = process.env.NODE_ENV === 'production';

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8787;

function publicUser(u: { id: string; username: string; role: string; name: string }) {
  return { id: u.id, username: u.username, role: u.role, name: u.name };
}

function requireAuth(req: express.Request): TokenPayload {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }
  return verifyToken(token);
}

app.post('/api/auth/register', async (req, res) => {
  const { username, password, name } = req.body ?? {};

  if (typeof username !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
    return res.status(400).json({ error: 'Username, password, and full name are required.' });
  }
  if (username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }
  if (password.length < 5) {
    return res.status(400).json({ error: 'Password must be at least 5 characters.' });
  }
  if (name.trim().length < 2) {
    return res.status(400).json({ error: 'Full name is required.' });
  }

  try {
    // Self-service registration always creates an investor account.
    // Admin accounts are provisioned separately and are not publicly self-serve.
    const user = await createUser({ username, password, name, role: 'investor' });
    const token = signToken({ sub: user.id, username: user.username, role: user.role, name: user.name });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    if (err instanceof Error && err.message === 'USERNAME_TAKEN') {
      return res.status(409).json({ error: 'That username is already taken.' });
    }
    console.error('Registration failed:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body ?? {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = signToken({ sub: user.id, username: user.username, role: user.role, name: user.name });
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.put('/api/auth/credentials', async (req, res) => {
  let payload: TokenPayload;
  try {
    payload = requireAuth(req);
  } catch {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }

  const { currentPassword, newUsername, newPassword } = req.body ?? {};

  if (typeof currentPassword !== 'string') {
    return res.status(400).json({ error: 'Current password is required.' });
  }
  if (newUsername !== undefined && (typeof newUsername !== 'string' || newUsername.trim().length < 3)) {
    return res.status(400).json({ error: 'New username must be at least 3 characters.' });
  }
  if (newPassword !== undefined && (typeof newPassword !== 'string' || newPassword.length < 5)) {
    return res.status(400).json({ error: 'New password must be at least 5 characters.' });
  }
  if (newUsername === undefined && newPassword === undefined) {
    return res.status(400).json({ error: 'Nothing to update.' });
  }

  try {
    const user = await findUserById(payload.sub);
    if (!user || !bcrypt.compareSync(currentPassword, user.passwordHash)) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const updated = await updateCredentials(user.id, {
      username: newUsername,
      password: newPassword
    });

    // Reissue the session token — the old one still carries the previous
    // username/name claims, which are now stale.
    const token = signToken({ sub: updated.id, username: updated.username, role: updated.role, name: updated.name });
    res.json({ token, user: publicUser(updated) });
  } catch (err) {
    if (err instanceof Error && err.message === 'USERNAME_TAKEN') {
      return res.status(409).json({ error: 'That username is already taken.' });
    }
    console.error('Credentials update failed:', err);
    res.status(500).json({ error: 'Could not update credentials. Please try again.' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const payload = verifyToken(token);
    res.json({ user: { id: payload.sub, username: payload.username, role: payload.role, name: payload.name } });
  } catch {
    res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
});

// Serve the built frontend (only present after `npm run build`). The app
// uses hash-based routing (#login, #portal, ...), so a single index.html
// fallback for any non-API GET request is all client-side routing needs.
if (isProduction && fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

async function start() {
  try {
    await initSchema();
    await seedIfEmpty();
  } catch (err) {
    console.error('[finovatech-api] Could not connect to MySQL. Is the MySQL server running, and did you run server/scripts/setup-mysql.sql against it?');
    console.error(err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[finovatech-api] listening on http://localhost:${PORT}${isProduction ? ' (serving built frontend + API)' : ''}`);
  });
}

start();
