import crypto from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';

export interface BroadcastRecord {
  id: string;
  title: string;
  message: string;
  recipientType: 'All' | 'Specific';
  recipientCount: number;
  emailSent: boolean;
  sentBy: string;
  createdAt: string;
}

interface BroadcastRow extends RowDataPacket {
  id: string;
  title: string;
  message: string;
  recipient_type: 'All' | 'Specific';
  recipient_count: number;
  email_sent: number;
  sent_by: string;
  created_at: string;
}

function toBroadcast(row: BroadcastRow): BroadcastRecord {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    recipientType: row.recipient_type,
    recipientCount: row.recipient_count,
    emailSent: !!row.email_sent,
    sentBy: row.sent_by,
    createdAt: row.created_at
  };
}

export async function recordBroadcast(params: {
  title: string;
  message: string;
  recipientType: 'All' | 'Specific';
  recipientCount: number;
  emailSent: boolean;
  sentBy: string;
}): Promise<BroadcastRecord> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await pool.query(
    'INSERT INTO admin_broadcasts (id, title, message, recipient_type, recipient_count, email_sent, sent_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, params.title, params.message, params.recipientType, params.recipientCount, params.emailSent, params.sentBy, createdAt]
  );

  return { id, createdAt, ...params };
}

export async function listBroadcasts(): Promise<BroadcastRecord[]> {
  const [rows] = await pool.query<BroadcastRow[]>('SELECT * FROM admin_broadcasts ORDER BY created_at DESC');
  return rows.map(toBroadcast);
}
