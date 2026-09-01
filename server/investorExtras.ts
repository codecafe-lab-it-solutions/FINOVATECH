import crypto from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';

const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

// --- Notifications ---

export interface NotificationRecord {
  id: string;
  investorUserId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotifRow extends RowDataPacket {
  id: string;
  investor_user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: number;
  created_at: string;
}

function toNotification(row: NotifRow): NotificationRecord {
  return {
    id: row.id,
    investorUserId: row.investor_user_id,
    title: row.title,
    message: row.message,
    type: row.type,
    isRead: Boolean(row.is_read),
    createdAt: row.created_at
  };
}

export async function listNotifications(investorUserId: string): Promise<NotificationRecord[]> {
  const [rows] = await pool.query<NotifRow[]>(
    'SELECT * FROM notifications WHERE investor_user_id = ? ORDER BY created_at DESC',
    [investorUserId]
  );
  return rows.map(toNotification);
}

export async function createNotification(investorUserId: string, title: string, message: string, type = 'general'): Promise<void> {
  await pool.query(
    'INSERT INTO notifications (id, investor_user_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, ?, FALSE, ?)',
    [crypto.randomUUID(), investorUserId, title, message, type, now()]
  );
}

export async function setNotificationRead(id: string, investorUserId: string, isRead: boolean): Promise<void> {
  await pool.query('UPDATE notifications SET is_read = ? WHERE id = ? AND investor_user_id = ?', [isRead, id, investorUserId]);
}

export async function markAllNotificationsRead(investorUserId: string): Promise<void> {
  await pool.query('UPDATE notifications SET is_read = TRUE WHERE investor_user_id = ?', [investorUserId]);
}

// --- Support Tickets ---

export interface TicketRecord {
  id: string;
  investorUserId: string;
  investorName?: string;
  subject: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessageRecord {
  id: string;
  ticketId: string;
  senderRole: 'investor' | 'admin';
  senderName: string;
  message: string;
  createdAt: string;
}

interface TicketRow extends RowDataPacket {
  id: string;
  investor_user_id: string;
  investor_name?: string;
  subject: string;
  category: string;
  status: TicketRecord['status'];
  created_at: string;
  updated_at: string;
}

function toTicket(row: TicketRow): TicketRecord {
  return {
    id: row.id,
    investorUserId: row.investor_user_id,
    investorName: row.investor_name,
    subject: row.subject,
    category: row.category,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

interface MsgRow extends RowDataPacket {
  id: string;
  ticket_id: string;
  sender_role: TicketMessageRecord['senderRole'];
  sender_name: string;
  message: string;
  created_at: string;
}

function toMessage(row: MsgRow): TicketMessageRecord {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    senderRole: row.sender_role,
    senderName: row.sender_name,
    message: row.message,
    createdAt: row.created_at
  };
}

export async function listTicketsForInvestor(investorUserId: string): Promise<TicketRecord[]> {
  const [rows] = await pool.query<TicketRow[]>(
    'SELECT * FROM support_tickets WHERE investor_user_id = ? ORDER BY updated_at DESC',
    [investorUserId]
  );
  return rows.map(toTicket);
}

export async function listAllTickets(): Promise<TicketRecord[]> {
  const [rows] = await pool.query<TicketRow[]>(`
    SELECT t.*, u.name AS investor_name FROM support_tickets t
    JOIN users u ON u.id = t.investor_user_id
    ORDER BY t.updated_at DESC
  `);
  return rows.map(toTicket);
}

export async function getTicketMessages(ticketId: string): Promise<TicketMessageRecord[]> {
  const [rows] = await pool.query<MsgRow[]>(
    'SELECT * FROM support_messages WHERE ticket_id = ? ORDER BY created_at ASC',
    [ticketId]
  );
  return rows.map(toMessage);
}

export async function createTicket(params: {
  investorUserId: string;
  subject: string;
  category: string;
  firstMessage: string;
  senderName: string;
}): Promise<TicketRecord> {
  const id = crypto.randomUUID();
  const ts = now();
  await pool.query(
    'INSERT INTO support_tickets (id, investor_user_id, subject, category, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, params.investorUserId, params.subject, params.category, 'Open', ts, ts]
  );
  await pool.query(
    'INSERT INTO support_messages (id, ticket_id, sender_role, sender_name, message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [crypto.randomUUID(), id, 'investor', params.senderName, params.firstMessage, ts]
  );
  return {
    id,
    investorUserId: params.investorUserId,
    subject: params.subject,
    category: params.category,
    status: 'Open',
    createdAt: ts,
    updatedAt: ts
  };
}

export async function addTicketMessage(params: {
  ticketId: string;
  senderRole: 'investor' | 'admin';
  senderName: string;
  message: string;
}): Promise<TicketMessageRecord> {
  const id = crypto.randomUUID();
  const ts = now();
  await pool.query(
    'INSERT INTO support_messages (id, ticket_id, sender_role, sender_name, message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, params.ticketId, params.senderRole, params.senderName, params.message, ts]
  );
  const nextStatus = params.senderRole === 'admin' ? 'In Progress' : undefined;
  await pool.query(
    nextStatus ? 'UPDATE support_tickets SET updated_at = ?, status = ? WHERE id = ?' : 'UPDATE support_tickets SET updated_at = ? WHERE id = ?',
    nextStatus ? [ts, nextStatus, params.ticketId] : [ts, params.ticketId]
  );
  return { id, ticketId: params.ticketId, senderRole: params.senderRole, senderName: params.senderName, message: params.message, createdAt: ts };
}

export async function updateTicketStatus(ticketId: string, status: TicketRecord['status']): Promise<void> {
  await pool.query('UPDATE support_tickets SET status = ?, updated_at = ? WHERE id = ?', [status, now(), ticketId]);
}

// --- Referrals (derived from investor_profiles.referral_code / referred_by_code) ---

export interface ReferredInvestor {
  name: string;
  username: string;
  joinedDate: string;
  plan: string;
}

export async function getReferralStats(investorUserId: string): Promise<{ referralCode: string; referredUsers: ReferredInvestor[] }> {
  const [profileRows] = await pool.query<RowDataPacket[]>('SELECT referral_code FROM investor_profiles WHERE user_id = ?', [investorUserId]);
  const referralCode = (profileRows[0] as { referral_code: string } | undefined)?.referral_code || '';

  if (!referralCode) return { referralCode, referredUsers: [] };

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.name, u.username, u.created_at, p.plan
     FROM investor_profiles p JOIN users u ON u.id = p.user_id
     WHERE p.referred_by_code = ?
     ORDER BY u.created_at DESC`,
    [referralCode]
  );
  return {
    referralCode,
    referredUsers: (rows as any[]).map((r) => ({ name: r.name, username: r.username, joinedDate: r.created_at, plan: r.plan }))
  };
}

// --- Mining Machines ---

export interface MachineRecord {
  id: string;
  investorUserId: string | null;
  investorName?: string;
  podId: string;
  model: string;
  hashrateTh: number;
  powerDrawWatts: number;
  tempCelsius: number;
  status: 'Online' | 'Offline' | 'Maintenance';
  pool: string;
  uptimePercent: number;
  updatedAt: string;
}

interface MachineRow extends RowDataPacket {
  id: string;
  investor_user_id: string | null;
  investor_name?: string;
  pod_id: string;
  model: string;
  hashrate_th: string;
  power_draw_watts: number;
  temp_celsius: string;
  status: MachineRecord['status'];
  pool: string;
  uptime_percent: string;
  updated_at: string;
}

function toMachine(row: MachineRow): MachineRecord {
  return {
    id: row.id,
    investorUserId: row.investor_user_id,
    investorName: row.investor_name,
    podId: row.pod_id,
    model: row.model,
    hashrateTh: Number(row.hashrate_th),
    powerDrawWatts: row.power_draw_watts,
    tempCelsius: Number(row.temp_celsius),
    status: row.status,
    pool: row.pool,
    uptimePercent: Number(row.uptime_percent),
    updatedAt: row.updated_at
  };
}

export async function listMachinesForInvestor(investorUserId: string): Promise<MachineRecord[]> {
  const [rows] = await pool.query<MachineRow[]>('SELECT * FROM mining_machines WHERE investor_user_id = ? ORDER BY updated_at DESC', [investorUserId]);
  return rows.map(toMachine);
}

export async function listAllMachines(): Promise<MachineRecord[]> {
  const [rows] = await pool.query<MachineRow[]>(`
    SELECT m.*, u.name AS investor_name FROM mining_machines m
    LEFT JOIN users u ON u.id = m.investor_user_id
    ORDER BY m.updated_at DESC
  `);
  return rows.map(toMachine);
}

export async function createMachine(params: Omit<MachineRecord, 'id' | 'updatedAt' | 'investorName'>): Promise<MachineRecord> {
  const id = crypto.randomUUID();
  const ts = now();
  await pool.query(
    `INSERT INTO mining_machines (id, investor_user_id, pod_id, model, hashrate_th, power_draw_watts, temp_celsius, status, pool, uptime_percent, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, params.investorUserId, params.podId, params.model, params.hashrateTh, params.powerDrawWatts, params.tempCelsius, params.status, params.pool, params.uptimePercent, ts]
  );
  return { id, updatedAt: ts, ...params };
}

export async function updateMachine(id: string, params: Partial<Omit<MachineRecord, 'id' | 'updatedAt' | 'investorName'>>): Promise<void> {
  const map: Record<string, string> = {
    investorUserId: 'investor_user_id',
    podId: 'pod_id',
    model: 'model',
    hashrateTh: 'hashrate_th',
    powerDrawWatts: 'power_draw_watts',
    tempCelsius: 'temp_celsius',
    status: 'status',
    pool: 'pool',
    uptimePercent: 'uptime_percent'
  };
  const entries = Object.entries(params).filter(([k, v]) => v !== undefined && k in map);
  if (entries.length === 0) return;
  const setClause = entries.map(([k]) => `${map[k]} = ?`).join(', ');
  const values = entries.map(([, v]) => v);
  await pool.query(`UPDATE mining_machines SET ${setClause}, updated_at = ? WHERE id = ?`, [...values, now(), id]);
}

// --- Earnings (Mining Credits from the real wallet ledger) & Monthly Statements (computed) ---

export interface EarningRow {
  id: string;
  date: string;
  amountBtc: number;
  amountUsd: number;
  status: string;
}

export async function listEarnings(investorUserId: string): Promise<EarningRow[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, created_at, amount_btc, amount_usd, status FROM wallet_transactions
     WHERE investor_user_id = ? AND type = 'Mining Credit'
     ORDER BY created_at DESC`,
    [investorUserId]
  );
  return (rows as any[]).map((r) => ({
    id: r.id,
    date: r.created_at,
    amountBtc: Number(r.amount_btc),
    amountUsd: Number(r.amount_usd),
    status: r.status
  }));
}

export interface MonthlyStatementRow {
  month: string;
  miningCreditsBtc: number;
  miningCreditsUsd: number;
  payoutsBtc: number;
  payoutsUsd: number;
  netUsd: number;
  transactionCount: number;
}

export async function listMonthlyStatements(investorUserId: string): Promise<MonthlyStatementRow[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
       DATE_FORMAT(created_at, '%Y-%m') AS month,
       SUM(CASE WHEN type = 'Mining Credit' THEN amount_btc ELSE 0 END) AS mining_btc,
       SUM(CASE WHEN type = 'Mining Credit' THEN amount_usd ELSE 0 END) AS mining_usd,
       SUM(CASE WHEN type = 'Payout' THEN -amount_btc ELSE 0 END) AS payout_btc,
       SUM(CASE WHEN type = 'Payout' THEN -amount_usd ELSE 0 END) AS payout_usd,
       SUM(amount_usd) AS net_usd,
       COUNT(*) AS tx_count
     FROM wallet_transactions
     WHERE investor_user_id = ?
     GROUP BY month
     ORDER BY month DESC`,
    [investorUserId]
  );
  return (rows as any[]).map((r) => ({
    month: r.month,
    miningCreditsBtc: Number(r.mining_btc),
    miningCreditsUsd: Number(r.mining_usd),
    payoutsBtc: Number(r.payout_btc),
    payoutsUsd: Number(r.payout_usd),
    netUsd: Number(r.net_usd),
    transactionCount: Number(r.tx_count)
  }));
}
