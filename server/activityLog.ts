import crypto from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';

export interface ActivityEntry {
  actorUserId?: string | null;
  actorName?: string;
  actorRole?: string;
  action: string;
  module?: string;
  targetId?: string;
  details?: string;
  status?: 'Success' | 'Failed' | 'Blocked';
  ip?: string;
  userAgent?: string;
}

const cut = (value: string | undefined, max: number) => (value ?? '').slice(0, max);

// Logging must never break the request it describes.
export async function logActivity(entry: ActivityEntry): Promise<void> {
  try {
    await pool.query(
      'INSERT INTO activity_logs (id, created_at, actor_user_id, actor_name, actor_role, action, module, target_id, details, status, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), new Date().toISOString().slice(0, 19).replace('T', ' '), entry.actorUserId ?? null, cut(entry.actorName, 120), cut(entry.actorRole, 20), cut(entry.action, 80), cut(entry.module, 60), cut(entry.targetId, 120), cut(entry.details, 500), entry.status ?? 'Success', cut(entry.ip, 64), cut(entry.userAgent, 255)]
    );
  } catch (err) {
    console.error('Activity log write failed:', err);
  }
}

export async function listActivity(limit = 500) {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM activity_logs ORDER BY created_at DESC, id LIMIT ?', [Math.min(Math.max(limit, 1), 2000)]);
  return rows.map((r) => ({
    id: r.id as string,
    createdAt: r.created_at as string,
    actorName: r.actor_name as string,
    actorRole: r.actor_role as string,
    action: r.action as string,
    module: r.module as string,
    targetId: r.target_id as string,
    details: r.details as string,
    status: r.status as string,
    ipAddress: r.ip_address as string,
    userAgent: r.user_agent as string
  }));
}
