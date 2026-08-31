import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';

export type UserRole = 'investor' | 'admin';

export interface StoredUser {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

interface UserRow extends RowDataPacket {
  id: string;
  username: string;
  password_hash: string;
  role: UserRole;
  name: string;
  created_at: string;
}

function toStoredUser(row: UserRow): StoredUser {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role,
    name: row.name,
    createdAt: row.created_at
  };
}

async function insertUser(user: StoredUser): Promise<void> {
  await pool.query(
    'INSERT INTO users (id, username, password_hash, role, name, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [user.id, user.username, user.passwordHash, user.role, user.name, user.createdAt]
  );
}

export async function seedIfEmpty(): Promise<void> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM users');
  const count = Number((rows[0] as { count: number }).count);
  if (count > 0) return;

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await insertUser({
    id: crypto.randomUUID(),
    username: 'investor1',
    passwordHash: bcrypt.hashSync('12345', 10),
    role: 'investor',
    name: 'Dr. Tariq Al-Balushi',
    createdAt: now
  });
  await insertUser({
    id: crypto.randomUUID(),
    username: 'Admin',
    passwordHash: bcrypt.hashSync('Admin', 10),
    role: 'admin',
    name: 'Gaurav K. Sharma',
    createdAt: now
  });
}

export async function findUserByUsername(username: string): Promise<StoredUser | undefined> {
  const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE username = ?', [username.trim()]);
  return rows[0] ? toStoredUser(rows[0]) : undefined;
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] ? toStoredUser(rows[0]) : undefined;
}

export async function updateCredentials(
  id: string,
  updates: { username?: string; password?: string }
): Promise<StoredUser> {
  const current = await findUserById(id);
  if (!current) {
    throw new Error('USER_NOT_FOUND');
  }

  const nextUsername = updates.username?.trim() || current.username;
  const nextPasswordHash = updates.password ? bcrypt.hashSync(updates.password, 10) : current.passwordHash;

  try {
    await pool.query('UPDATE users SET username = ?, password_hash = ? WHERE id = ?', [
      nextUsername,
      nextPasswordHash,
      id
    ]);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'ER_DUP_ENTRY') {
      throw new Error('USERNAME_TAKEN');
    }
    throw err;
  }

  return { ...current, username: nextUsername, passwordHash: nextPasswordHash };
}

export async function createUser(params: { username: string; password: string; name: string; role: UserRole }): Promise<StoredUser> {
  const id = crypto.randomUUID();
  const passwordHash = bcrypt.hashSync(params.password, 10);
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const username = params.username.trim();
  const name = params.name.trim();
  const user: StoredUser = { id, username, passwordHash, role: params.role, name, createdAt };

  try {
    await insertUser(user);
  } catch (err) {
    // MySQL error code 1062 / 'ER_DUP_ENTRY' on the UNIQUE `username` constraint.
    if (err && typeof err === 'object' && 'code' in err && err.code === 'ER_DUP_ENTRY') {
      throw new Error('USERNAME_TAKEN');
    }
    throw err;
  }

  return user;
}
