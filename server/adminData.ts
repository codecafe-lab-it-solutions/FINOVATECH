import crypto from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';
import { validatePlan } from './planPolicy';

const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

// --- Investment Plans ---

export interface PlanRecord {
  id: string;
  name: string;
  tagline: string;
  minInvestmentUsd: number;
  maxInvestmentUsd: number;
  durationMonths: number;
  managementFeePercent: number;
  directReferralPercent?: number;
  dailyReturnPercent: number;
  payoutRequestDays: number;
  minimumThresholdPercent: number;
  withdrawalEntryFeePercent: number;
  payoutFrequency: 'Daily' | 'Weekly' | 'Monthly';
  status: 'Active' | 'Draft' | 'Deactivated';
  activeInvestorsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PlanRow extends RowDataPacket {
  id: string;
  name: string;
  tagline: string;
  min_investment_usd: string;
  max_investment_usd: string;
  duration_months: number;
  management_fee_percent: string;
  payout_frequency: PlanRecord['payoutFrequency'];
  status: PlanRecord['status'];
  created_at: string;
  updated_at: string;
  active_investors_count?: number;
}

function toPlan(row: PlanRow): PlanRecord {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    minInvestmentUsd: Number(row.min_investment_usd),
    maxInvestmentUsd: Number(row.max_investment_usd),
    durationMonths: row.duration_months,
    managementFeePercent: Number(row.management_fee_percent),
    directReferralPercent: Number(row.direct_referral_percent),
    dailyReturnPercent: Number(row.daily_return_percent),
    payoutRequestDays: Number(row.payout_request_days),
    minimumThresholdPercent: Number(row.minimum_threshold_percent),
    withdrawalEntryFeePercent: Number(row.withdrawal_entry_fee_percent),
    payoutFrequency: row.payout_frequency,
    status: row.status,
    activeInvestorsCount: Number(row.active_investors_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function listPlans(): Promise<PlanRecord[]> {
  const [rows] = await pool.query<PlanRow[]>(`
    SELECT pl.*, (
      SELECT COUNT(*) FROM investor_profiles ip WHERE ip.plan_id = pl.id OR (ip.plan_id IS NULL AND ip.plan = pl.name)
    ) AS active_investors_count
    FROM investment_plans pl
    ORDER BY pl.created_at DESC
  `);
  return rows.map(toPlan);
}

export async function createPlan(params: Omit<PlanRecord, 'id' | 'activeInvestorsCount' | 'createdAt' | 'updatedAt'>): Promise<PlanRecord> {
  validatePlan(params);
  const [duplicates] = await pool.query<RowDataPacket[]>('SELECT id FROM investment_plans WHERE name = ?', [params.name.trim()]);
  if (duplicates.length) throw new Error('A plan with this name already exists. Use a unique name.');
  const id = crypto.randomUUID();
  const ts = now();
  await pool.query(
    `INSERT INTO investment_plans
      (id, name, tagline, min_investment_usd, max_investment_usd, duration_months, management_fee_percent, payout_frequency, status, created_at, updated_at, daily_return_percent, payout_request_days, minimum_threshold_percent, withdrawal_entry_fee_percent, direct_referral_percent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, params.name, params.tagline, params.minInvestmentUsd, params.maxInvestmentUsd, params.durationMonths, params.managementFeePercent, params.payoutFrequency, params.status, ts, ts, params.dailyReturnPercent, params.payoutRequestDays, params.minimumThresholdPercent, params.withdrawalEntryFeePercent, params.directReferralPercent ?? 5]
  );
  return { id, activeInvestorsCount: 0, createdAt: ts, updatedAt: ts, ...params };
}

export async function updatePlan(id: string, params: Partial<Omit<PlanRecord, 'id' | 'activeInvestorsCount' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const current = (await listPlans()).find(p => p.id === id);
  if (!current) throw new Error('Plan not found.');
  validatePlan({ ...current, ...params });
  if (params.name) {
    const [duplicates] = await pool.query<RowDataPacket[]>('SELECT id FROM investment_plans WHERE name = ? AND id <> ?', [params.name.trim(), id]);
    if (duplicates.length) throw new Error('A plan with this name already exists. Use a unique name.');
  }
  const map: Record<string, string> = {
    directReferralPercent: 'direct_referral_percent',
    name: 'name',
    tagline: 'tagline',
    minInvestmentUsd: 'min_investment_usd',
    maxInvestmentUsd: 'max_investment_usd',
    durationMonths: 'duration_months',
    managementFeePercent: 'management_fee_percent',
    dailyReturnPercent: 'daily_return_percent',
    payoutRequestDays: 'payout_request_days',
    minimumThresholdPercent: 'minimum_threshold_percent',
    withdrawalEntryFeePercent: 'withdrawal_entry_fee_percent',
    payoutFrequency: 'payout_frequency',
    status: 'status'
  };
  const entries = Object.entries(params).filter(([k, v]) => v !== undefined && k in map);
  if (entries.length === 0) return;
  const setClause = entries.map(([k]) => `${map[k]} = ?`).join(', ');
  const values = entries.map(([, v]) => v);
  await pool.query(`UPDATE investment_plans SET ${setClause}, updated_at = ? WHERE id = ?`, [...values, now(), id]);
}

export async function deletePlan(id: string): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [plans] = await conn.query<RowDataPacket[]>('SELECT * FROM investment_plans WHERE id = ? FOR UPDATE', [id]);
    if (!plans[0]) throw new Error('Plan not found.');
    const [investors] = await conn.query<RowDataPacket[]>('SELECT user_id FROM investor_profiles WHERE plan_id = ? OR (plan_id IS NULL AND plan = ?) FOR UPDATE', [id, plans[0].name]);
    if (investors.length) throw new Error('Cannot delete a plan with assigned investors. Editing is still available.');
    await conn.query('DELETE FROM investment_plans WHERE id = ?', [id]);
    await conn.commit();
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
}

// --- Company Wallets ---

export interface CompanyWalletRecord {
  id: string;
  walletName: string;
  type: 'Cold Vault' | 'Hot Payout' | 'Treasury' | 'Operational OPEX' | 'USDT Reserve';
  currency: 'BTC' | 'USDT';
  address: string;
  balance: number;
  requiresMultisig: boolean;
  status: 'Secure' | 'Active' | 'Restricted';
  updatedAt: string;
}

interface WalletRow extends RowDataPacket {
  id: string;
  wallet_name: string;
  type: CompanyWalletRecord['type'];
  currency: CompanyWalletRecord['currency'];
  address: string;
  balance: string;
  requires_multisig: number;
  status: CompanyWalletRecord['status'];
  updated_at: string;
}

function toWallet(row: WalletRow): CompanyWalletRecord {
  return {
    id: row.id,
    walletName: row.wallet_name,
    type: row.type,
    currency: row.currency,
    address: row.address,
    balance: Number(row.balance),
    requiresMultisig: Boolean(row.requires_multisig),
    status: row.status,
    updatedAt: row.updated_at
  };
}

export async function listWallets(): Promise<CompanyWalletRecord[]> {
  const [rows] = await pool.query<WalletRow[]>('SELECT * FROM company_wallets ORDER BY updated_at DESC');
  return rows.map(toWallet);
}

export async function createWallet(params: Omit<CompanyWalletRecord, 'id' | 'updatedAt'>): Promise<CompanyWalletRecord> {
  const id = crypto.randomUUID();
  const ts = now();
  await pool.query(
    `INSERT INTO company_wallets (id, wallet_name, type, currency, address, balance, requires_multisig, status, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, params.walletName, params.type, params.currency, params.address, params.balance, params.requiresMultisig, params.status, ts]
  );
  return { id, updatedAt: ts, ...params };
}

export async function updateWallet(id: string, params: Partial<Omit<CompanyWalletRecord, 'id' | 'updatedAt'>>): Promise<void> {
  const map: Record<string, string> = {
    walletName: 'wallet_name',
    type: 'type',
    currency: 'currency',
    address: 'address',
    balance: 'balance',
    requiresMultisig: 'requires_multisig',
    status: 'status'
  };
  const entries = Object.entries(params).filter(([k, v]) => v !== undefined && k in map);
  if (entries.length === 0) return;
  const setClause = entries.map(([k]) => `${map[k]} = ?`).join(', ');
  const values = entries.map(([, v]) => v);
  await pool.query(`UPDATE company_wallets SET ${setClause}, updated_at = ? WHERE id = ?`, [...values, now(), id]);
}

// --- Documents (metadata only — no file storage/upload) ---

export interface DocumentRecord {
  id: string;
  title: string;
  category: 'Investment Agreement' | 'Amendment' | 'Investor Statement' | 'Tax Document' | 'KYC Document' | 'Payment Receipt' | 'Mining Audit';
  investorUserId: string | null;
  investorName?: string;
  uploadedBy: string;
  status: 'Active' | 'Archived';
  createdAt: string;
}

interface DocRow extends RowDataPacket {
  id: string;
  title: string;
  category: DocumentRecord['category'];
  investor_user_id: string | null;
  investor_name?: string;
  uploaded_by: string;
  status: DocumentRecord['status'];
  created_at: string;
}

function toDocument(row: DocRow): DocumentRecord {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    investorUserId: row.investor_user_id,
    investorName: row.investor_name,
    uploadedBy: row.uploaded_by,
    status: row.status,
    createdAt: row.created_at
  };
}

export async function listDocuments(): Promise<DocumentRecord[]> {
  const [rows] = await pool.query<DocRow[]>(`
    SELECT d.*, u.name AS investor_name FROM documents d
    LEFT JOIN users u ON u.id = d.investor_user_id
    ORDER BY d.created_at DESC
  `);
  return rows.map(toDocument);
}

export async function listDocumentsForInvestor(investorUserId: string): Promise<DocumentRecord[]> {
  const [rows] = await pool.query<DocRow[]>(
    `SELECT d.*, u.name AS investor_name FROM documents d
     LEFT JOIN users u ON u.id = d.investor_user_id
     WHERE d.investor_user_id = ? AND d.status = 'Active'
     ORDER BY d.created_at DESC`,
    [investorUserId]
  );
  return rows.map(toDocument);
}

export async function createDocument(params: {
  title: string;
  category: DocumentRecord['category'];
  investorUserId?: string | null;
  uploadedBy: string;
}): Promise<DocumentRecord> {
  const id = crypto.randomUUID();
  const ts = now();
  await pool.query(
    'INSERT INTO documents (id, title, category, investor_user_id, uploaded_by, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, params.title, params.category, params.investorUserId || null, params.uploadedBy, 'Active', ts]
  );
  return {
    id,
    title: params.title,
    category: params.category,
    investorUserId: params.investorUserId || null,
    uploadedBy: params.uploadedBy,
    status: 'Active',
    createdAt: ts
  };
}

export async function setDocumentStatus(id: string, status: DocumentRecord['status']): Promise<void> {
  await pool.query('UPDATE documents SET status = ? WHERE id = ?', [status, id]);
}

// --- All wallet transactions across every investor (for the admin's
// "Investment Txns" view — same underlying ledger as per-investor wallets) ---

export interface TransactionWithInvestor {
  id: string;
  investorUserId: string;
  investorName: string;
  type: string;
  amountBtc: number;
  amountUsd: number;
  status: string;
  note: string;
  network: string;
  createdAt: string;
}

interface TxJoinRow extends RowDataPacket {
  id: string;
  investor_user_id: string;
  investor_name: string;
  type: string;
  amount_btc: string;
  amount_usd: string;
  status: string;
  note: string;
  network: string;
  created_at: string;
}

export async function listAllTransactions(): Promise<TransactionWithInvestor[]> {
  const [rows] = await pool.query<TxJoinRow[]>(`
    SELECT t.*, u.name AS investor_name FROM wallet_transactions t
    JOIN users u ON u.id = t.investor_user_id
    ORDER BY t.created_at DESC
  `);
  return rows.map((r) => ({
    id: r.id,
    investorUserId: r.investor_user_id,
    investorName: r.investor_name,
    type: r.type,
    amountBtc: Number(r.amount_btc),
    amountUsd: Number(r.amount_usd),
    status: r.status,
    note: r.note,
    network: r.network,
    createdAt: r.created_at
  }));
}
