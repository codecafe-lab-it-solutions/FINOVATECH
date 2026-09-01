import crypto from 'node:crypto';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from './database';

export interface SessionRecord {
  id: string;
  userId: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  revoked: boolean;
}

interface SessionRow extends RowDataPacket {
  id: string;
  user_id: string;
  device: string;
  ip_address: string;
  created_at: string;
  revoked: number;
}

function toSession(row: SessionRow): SessionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    device: row.device,
    ipAddress: row.ip_address,
    createdAt: row.created_at,
    revoked: Boolean(row.revoked)
  };
}

export async function createSession(userId: string, device: string, ipAddress: string): Promise<string> {
  const id = crypto.randomUUID();
  await pool.query(
    'INSERT INTO login_sessions (id, user_id, device, ip_address, user_agent, created_at, revoked) VALUES (?, ?, ?, ?, ?, ?, FALSE)',
    [id, userId, device, ipAddress, device, new Date().toISOString().slice(0, 19).replace('T', ' ')]
  );
  return id;
}

// Unknown/missing session id is treated as revoked — fails closed.
export async function isSessionRevoked(sessionId: string | undefined): Promise<boolean> {
  if (!sessionId) return true;
  const [rows] = await pool.query<RowDataPacket[]>('SELECT revoked FROM login_sessions WHERE id = ?', [sessionId]);
  if (rows.length === 0) return true;
  return Boolean((rows[0] as { revoked: number }).revoked);
}

export async function listSessionsForUser(userId: string): Promise<SessionRecord[]> {
  const [rows] = await pool.query<SessionRow[]>(
    'SELECT * FROM login_sessions WHERE user_id = ? AND revoked = FALSE ORDER BY created_at DESC',
    [userId]
  );
  return rows.map(toSession);
}

// Scoped to the owning user so an investor can only revoke their own sessions.
export async function revokeSession(sessionId: string, userId: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>('UPDATE login_sessions SET revoked = TRUE WHERE id = ? AND user_id = ?', [
    sessionId,
    userId
  ]);
  return result.affectedRows > 0;
}
