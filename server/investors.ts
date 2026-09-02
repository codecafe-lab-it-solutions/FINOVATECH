import crypto from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';

export interface InvestorProfile {
  userId: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  kycStatus: 'Verified' | 'Pending' | 'Action Required';
  accountStatus: 'Active' | 'Under Review';
  plan: string;
  agreementNumber: string;
  startDate: string;
  maturityDate: string;
  referralCode: string;
  referrerName: string;
  payoutBtcAddress: string;
  bankName: string;
  bankAccountHolder: string;
  bankAccountNumber: string;
  bankIban: string;
  bankSwift: string;
  totalInvestmentUsd: number;
  currentPortfolioValueUsd: number;
  totalBtcAllocated: number;
  btcMined: number;
  btcPendingAccrued: number;
  miningSharePercent: number;
  updatedAt: string;
}

export interface WalletTransactionRecord {
  id: string;
  investorUserId: string;
  type: string;
  amountBtc: number;
  amountUsd: number;
  status: string;
  note: string;
  createdAt: string;
}

export interface PayoutRecordRow {
  id: string;
  investorUserId: string;
  investorName?: string;
  amountBtc: number;
  destinationWallet: string;
  status: 'Requested' | 'Processing' | 'Completed' | 'Rejected';
  requestedAt: string;
  processedAt: string | null;
  notes: string;
}

interface ProfileRow extends RowDataPacket {
  user_id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  kyc_status: InvestorProfile['kycStatus'];
  account_status: InvestorProfile['accountStatus'];
  plan: string;
  agreement_number: string;
  start_date: string;
  maturity_date: string;
  referral_code: string;
  referrer_name: string;
  payout_btc_address: string;
  bank_name: string;
  bank_account_holder: string;
  bank_account_number: string;
  bank_iban: string;
  bank_swift: string;
  total_investment_usd: string;
  current_portfolio_value_usd: string;
  total_btc_allocated: string;
  btc_mined: string;
  btc_pending_accrued: string;
  mining_share_percent: string;
  updated_at: string;
}

function toProfile(row: ProfileRow): InvestorProfile {
  return {
    userId: row.user_id,
    username: row.username,
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    kycStatus: row.kyc_status,
    accountStatus: row.account_status,
    plan: row.plan,
    agreementNumber: row.agreement_number,
    startDate: row.start_date,
    maturityDate: row.maturity_date,
    referralCode: row.referral_code,
    referrerName: row.referrer_name,
    payoutBtcAddress: row.payout_btc_address,
    bankName: row.bank_name,
    bankAccountHolder: row.bank_account_holder,
    bankAccountNumber: row.bank_account_number,
    bankIban: row.bank_iban,
    bankSwift: row.bank_swift,
    totalInvestmentUsd: Number(row.total_investment_usd),
    currentPortfolioValueUsd: Number(row.current_portfolio_value_usd),
    totalBtcAllocated: Number(row.total_btc_allocated),
    btcMined: Number(row.btc_mined),
    btcPendingAccrued: Number(row.btc_pending_accrued),
    miningSharePercent: Number(row.mining_share_percent),
    updatedAt: row.updated_at
  };
}

const PROFILE_SELECT = `
  SELECT u.id AS user_id, u.username, u.name, p.*
  FROM users u
  JOIN investor_profiles p ON p.user_id = u.id
`;

export async function ensureProfile(userId: string): Promise<void> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT 1 FROM investor_profiles WHERE user_id = ?', [userId]);
  if (rows.length > 0) return;
  await pool.query('INSERT INTO investor_profiles (user_id, updated_at) VALUES (?, ?)', [
    userId,
    new Date().toISOString().slice(0, 19).replace('T', ' ')
  ]);
}

export async function setReferralCode(userId: string, code: string): Promise<void> {
  await pool.query('UPDATE investor_profiles SET referral_code = ? WHERE user_id = ?', [code, userId]);
}

export async function setReferredByCode(userId: string, code: string): Promise<void> {
  await pool.query('UPDATE investor_profiles SET referred_by_code = ? WHERE user_id = ?', [code, userId]);
}

export async function getProfile(userId: string): Promise<InvestorProfile | undefined> {
  const [rows] = await pool.query<ProfileRow[]>(`${PROFILE_SELECT} WHERE u.id = ?`, [userId]);
  return rows[0] ? toProfile(rows[0]) : undefined;
}

export async function listInvestorProfiles(): Promise<InvestorProfile[]> {
  const [rows] = await pool.query<ProfileRow[]>(`${PROFILE_SELECT} WHERE u.role = 'investor' ORDER BY p.updated_at DESC`);
  return rows.map(toProfile);
}

export interface ProfileUpdate {
  email?: string;
  phone?: string;
  country?: string;
  kycStatus?: InvestorProfile['kycStatus'];
  accountStatus?: InvestorProfile['accountStatus'];
  plan?: string;
  agreementNumber?: string;
  startDate?: string;
  maturityDate?: string;
  referrerName?: string;
  payoutBtcAddress?: string;
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankIban?: string;
  bankSwift?: string;
  totalInvestmentUsd?: number;
  currentPortfolioValueUsd?: number;
  totalBtcAllocated?: number;
  btcMined?: number;
  btcPendingAccrued?: number;
  miningSharePercent?: number;
}

const UPDATABLE_COLUMNS: Record<keyof ProfileUpdate, string> = {
  email: 'email',
  phone: 'phone',
  country: 'country',
  kycStatus: 'kyc_status',
  accountStatus: 'account_status',
  plan: 'plan',
  agreementNumber: 'agreement_number',
  startDate: 'start_date',
  maturityDate: 'maturity_date',
  referrerName: 'referrer_name',
  payoutBtcAddress: 'payout_btc_address',
  bankName: 'bank_name',
  bankAccountHolder: 'bank_account_holder',
  bankAccountNumber: 'bank_account_number',
  bankIban: 'bank_iban',
  bankSwift: 'bank_swift',
  totalInvestmentUsd: 'total_investment_usd',
  currentPortfolioValueUsd: 'current_portfolio_value_usd',
  totalBtcAllocated: 'total_btc_allocated',
  btcMined: 'btc_mined',
  btcPendingAccrued: 'btc_pending_accrued',
  miningSharePercent: 'mining_share_percent'
};

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<InvestorProfile> {
  await ensureProfile(userId);

  // Only accept keys that are actually updatable columns — the caller may
  // pass a whole fetched profile back (including id/username/etc.), and
  // those must be silently dropped rather than corrupting the SQL.
  const entries = Object.entries(updates).filter(
    ([key, v]) => v !== undefined && key in UPDATABLE_COLUMNS
  ) as [keyof ProfileUpdate, string | number][];
  if (entries.length > 0) {
    const setClause = entries.map(([key]) => `${UPDATABLE_COLUMNS[key]} = ?`).join(', ');
    const values = entries.map(([, value]) => value);
    await pool.query(
      `UPDATE investor_profiles SET ${setClause}, updated_at = ? WHERE user_id = ?`,
      [...values, new Date().toISOString().slice(0, 19).replace('T', ' '), userId]
    );
  }

  const profile = await getProfile(userId);
  if (!profile) throw new Error('PROFILE_NOT_FOUND');
  return profile;
}

interface TxRow extends RowDataPacket {
  id: string;
  investor_user_id: string;
  type: string;
  amount_btc: string;
  amount_usd: string;
  status: string;
  note: string;
  created_at: string;
}

function toTransaction(row: TxRow): WalletTransactionRecord {
  return {
    id: row.id,
    investorUserId: row.investor_user_id,
    type: row.type,
    amountBtc: Number(row.amount_btc),
    amountUsd: Number(row.amount_usd),
    status: row.status,
    note: row.note,
    createdAt: row.created_at
  };
}

export async function listTransactions(investorUserId: string): Promise<WalletTransactionRecord[]> {
  const [rows] = await pool.query<TxRow[]>(
    'SELECT * FROM wallet_transactions WHERE investor_user_id = ? ORDER BY created_at DESC',
    [investorUserId]
  );
  return rows.map(toTransaction);
}

export async function addTransaction(params: {
  investorUserId: string;
  type: string;
  amountBtc: number;
  amountUsd: number;
  status?: string;
  note?: string;
}): Promise<WalletTransactionRecord> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const status = params.status || 'Completed';
  const note = params.note || '';

  await pool.query(
    'INSERT INTO wallet_transactions (id, investor_user_id, type, amount_btc, amount_usd, status, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, params.investorUserId, params.type, params.amountBtc, params.amountUsd, status, note, createdAt]
  );

  return {
    id,
    investorUserId: params.investorUserId,
    type: params.type,
    amountBtc: params.amountBtc,
    amountUsd: params.amountUsd,
    status,
    note,
    createdAt
  };
}

interface PayoutRow extends RowDataPacket {
  id: string;
  investor_user_id: string;
  investor_name?: string;
  amount_btc: string;
  destination_wallet: string;
  status: PayoutRecordRow['status'];
  requested_at: string;
  processed_at: string | null;
  notes: string;
}

function toPayout(row: PayoutRow): PayoutRecordRow {
  return {
    id: row.id,
    investorUserId: row.investor_user_id,
    investorName: row.investor_name,
    amountBtc: Number(row.amount_btc),
    destinationWallet: row.destination_wallet,
    status: row.status,
    requestedAt: row.requested_at,
    processedAt: row.processed_at,
    notes: row.notes
  };
}

export async function listPayoutsForInvestor(investorUserId: string): Promise<PayoutRecordRow[]> {
  const [rows] = await pool.query<PayoutRow[]>(
    'SELECT * FROM payouts WHERE investor_user_id = ? ORDER BY requested_at DESC',
    [investorUserId]
  );
  return rows.map(toPayout);
}

export async function listAllPayouts(): Promise<PayoutRecordRow[]> {
  const [rows] = await pool.query<PayoutRow[]>(
    `SELECT p.*, u.name AS investor_name FROM payouts p
     JOIN users u ON u.id = p.investor_user_id
     ORDER BY p.requested_at DESC`
  );
  return rows.map(toPayout);
}

export async function createPayoutRequest(params: {
  investorUserId: string;
  amountBtc: number;
  destinationWallet: string;
}): Promise<PayoutRecordRow> {
  const id = crypto.randomUUID();
  const requestedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await pool.query(
    'INSERT INTO payouts (id, investor_user_id, amount_btc, destination_wallet, status, requested_at, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, params.investorUserId, params.amountBtc, params.destinationWallet, 'Requested', requestedAt, '']
  );

  return {
    id,
    investorUserId: params.investorUserId,
    amountBtc: params.amountBtc,
    destinationWallet: params.destinationWallet,
    status: 'Requested',
    requestedAt,
    processedAt: null,
    notes: ''
  };
}

export async function updatePayoutStatus(
  payoutId: string,
  status: PayoutRecordRow['status'],
  notes?: string
): Promise<PayoutRecordRow> {
  const processedAt =
    status === 'Completed' || status === 'Rejected' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;

  await pool.query('UPDATE payouts SET status = ?, processed_at = ?, notes = ? WHERE id = ?', [
    status,
    processedAt,
    notes ?? '',
    payoutId
  ]);

  const [rows] = await pool.query<PayoutRow[]>(
    `SELECT p.*, u.name AS investor_name FROM payouts p JOIN users u ON u.id = p.investor_user_id WHERE p.id = ?`,
    [payoutId]
  );
  if (!rows[0]) throw new Error('PAYOUT_NOT_FOUND');
  return toPayout(rows[0]);
}
