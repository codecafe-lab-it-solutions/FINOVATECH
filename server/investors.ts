import { creditDirectReferral } from './referrals';
import crypto from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';
import { PlanTerms, platformTimezone, platformDay, utcDay, nextEligibleDay, maturityDay } from './planPolicy';

export interface InvestorProfile {
  usdWalletBalance: number;
  platformTimezone: string;
  investorId: string;
  legacyInvestorId: string;
  kycApprovedAt: string | null;
  joiningDate: string | null;
  registrationDate: string | null;
  planId: string | null;
  planTerms: PlanTerms | null;
  investmentId: string;
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
  referredByCode?: string | null;
  payoutBtcAddress: string;
  payoutNetwork: string;
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
  nextWithdrawalDate: string | null;
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
  network: string;
  createdAt: string;
}

export interface PayoutRecordRow {
  amountUsd: number;
  currency: 'USD' | 'BTC';
  id: string;
  investorUserId: string;
  investorName?: string;
  amountBtc: number;
  destinationWallet: string;
  network: string;
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
  payout_network: string;
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
  next_withdrawal_date: string | null;
  updated_at: string;
}

function toProfile(row: ProfileRow): InvestorProfile {
  const terms: PlanTerms | null = typeof row.plan_terms === 'string' ? JSON.parse(row.plan_terms) : row.plan_terms || null;
  const joining = row.kyc_approved_at ? utcDay(row.kyc_approved_at) : null;
  return {
    usdWalletBalance: Number(row.usd_wallet_balance || 0),
    platformTimezone,
    investorId: row.investor_sequence ? `FINOVA${row.investor_sequence}` : '',
    legacyInvestorId: row.legacy_investor_id || row.user_id,
    kycApprovedAt: row.kyc_approved_at || null,
    joiningDate: joining,
    registrationDate: row.registered_at ? utcDay(row.registered_at) : null,
    planId: row.plan_id || null,
    planTerms: terms,
    investmentId: row.investment_id,
    userId: row.user_id,
    username: row.username,
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    kycStatus: row.kyc_status,
    accountStatus: row.account_status,
    plan: row.plan,
    agreementNumber: row.legacy_investor_id || row.user_id,
    startDate: joining || '',
    maturityDate: joining && terms ? maturityDay(joining, terms.durationMonths) : '',
    referralCode: row.referral_code,
    referrerName: row.sponsor_name || row.referrer_name,
    referredByCode: row.referred_by_code || null,
    payoutBtcAddress: row.payout_btc_address,
    payoutNetwork: row.payout_network,
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
    nextWithdrawalDate: joining && terms ? nextEligibleDay(joining, row.latest_payout ? utcDay(row.latest_payout) : null, terms.payoutRequestDays, row.next_withdrawal_date) : row.next_withdrawal_date,
    updatedAt: row.updated_at
  };
}

const PROFILE_SELECT = `
  SELECT (SELECT sponsor.name FROM investor_profiles sp JOIN users sponsor ON sponsor.id = sp.user_id WHERE sp.referral_code = p.referred_by_code LIMIT 1) AS sponsor_name, u.id AS user_id, u.username, u.name, u.created_at AS registered_at, p.*, ids.sequence AS investor_sequence,
    (SELECT MAX(requested_at) FROM payouts pay WHERE pay.investor_user_id = u.id AND (pay.investment_id = p.investment_id OR pay.investment_id IS NULL)) AS latest_payout
  FROM users u
  JOIN investor_profiles p ON p.user_id = u.id
  LEFT JOIN investor_identifiers ids ON ids.user_id = u.id
`;

export async function ensureProfile(userId: string): Promise<void> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT 1 FROM investor_profiles WHERE user_id = ?', [userId]);
  if (rows.length > 0) return;
  await pool.query('INSERT IGNORE INTO investor_profiles (user_id, updated_at, investment_id, legacy_investor_id, agreement_number) VALUES (?, ?, UUID(), ?, ?)', [
    userId,
    new Date().toISOString().slice(0, 19).replace('T', ' '), userId, userId
  ]);
  await pool.query('INSERT IGNORE INTO investor_identifiers (user_id) VALUES (?)', [userId]);
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

export async function findUserIdByEmail(email: string): Promise<string | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT u.id AS id FROM users u JOIN investor_profiles p ON p.user_id = u.id WHERE p.email = ?',
    [email.trim()]
  );
  return rows[0]?.id as string | undefined;
}

export async function listInvestorProfiles(): Promise<InvestorProfile[]> {
  const [rows] = await pool.query<ProfileRow[]>(`${PROFILE_SELECT} WHERE u.role = 'investor' ORDER BY p.updated_at DESC`);
  return rows.map(toProfile);
}

export interface ProfileUpdate {
  kycApprovedAt?: string | null;
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
  payoutNetwork?: string;
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
  nextWithdrawalDate?: string | null;
}

const UPDATABLE_COLUMNS: Record<keyof ProfileUpdate, string> = {
  kycApprovedAt: 'kyc_approved_at',
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
  payoutNetwork: 'payout_network',
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
  miningSharePercent: 'mining_share_percent',
  nextWithdrawalDate: 'next_withdrawal_date'
};

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<InvestorProfile> {
  await ensureProfile(userId);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM investor_profiles WHERE user_id = ? FOR UPDATE', [userId]);
    const before = rows[0];
    updates.agreementNumber = before.legacy_investor_id || userId;
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (updates.nextWithdrawalDate !== undefined && updates.nextWithdrawalDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(updates.nextWithdrawalDate)) throw new Error('Withdrawal lock date must use YYYY-MM-DD.');
    for (const key of ['totalInvestmentUsd', 'currentPortfolioValueUsd', 'totalBtcAllocated', 'btcMined', 'btcPendingAccrued', 'miningSharePercent'] as const) {
      if (updates[key] !== undefined && (typeof updates[key] !== 'number' || !Number.isFinite(updates[key]) || updates[key]! < 0)) throw new Error(`Invalid ${key}: enter a non-negative number.`);
    }
    if (updates.plan !== undefined && (updates.plan !== before.plan || !before.plan_terms)) {
      const [plans] = await conn.query<RowDataPacket[]>('SELECT * FROM investment_plans WHERE name = ? FOR UPDATE', [updates.plan]);
      if (plans.length !== 1 && updates.plan !== before.plan) throw new Error('Select a uniquely named investment plan from the catalog.');
      if (before.plan_terms && Number(before.total_investment_usd) > 0) throw new Error('An existing funded investment cannot be reassigned. Its agreed terms must be preserved.');
      const pl = plans[0];
      if (pl) {
      const terms: PlanTerms = { name: pl.name, dailyReturnPercent: Number(pl.daily_return_percent), payoutRequestDays: Number(pl.payout_request_days), minimumThresholdPercent: Number(pl.minimum_threshold_percent), withdrawalEntryFeePercent: Number(pl.withdrawal_entry_fee_percent), managementFeePercent: Number(pl.management_fee_percent), durationMonths: pl.duration_months };
      await conn.query('UPDATE investor_profiles SET plan_id = ?, plan_terms = ? WHERE user_id = ?', [pl.id, JSON.stringify(terms), userId]);
      }
    }
    // Approval is recorded once; changing KYC status later cannot reset the clock.
    if (before.kyc_approved_at) delete updates.kycApprovedAt;
    else if (updates.kycApprovedAt) {
      const parsed = new Date(updates.kycApprovedAt);
      if (!Number.isFinite(parsed.getTime()) || parsed > new Date() || (updates.kycStatus || before.kyc_status) !== 'Verified') throw new Error('Enter a valid, non-future KYC approval timestamp for a verified investor.');
      updates.kycApprovedAt = parsed.toISOString().slice(0, 19).replace('T', ' ');
    } else if (updates.kycStatus === 'Verified' && before.kyc_status !== 'Verified') updates.kycApprovedAt = ts;
    else delete updates.kycApprovedAt;
    const approval = before.kyc_approved_at || updates.kycApprovedAt;
    if (approval) {
      const [history] = await conn.query<RowDataPacket[]>('SELECT effective_day FROM investment_capital_history WHERE investor_user_id = ? AND investment_id = ? LIMIT 1', [userId, before.investment_id]);
      if (!history.length || (updates.totalInvestmentUsd !== undefined && Number(updates.totalInvestmentUsd) !== Number(before.total_investment_usd))) {
        const effectiveDay = history.length ? platformDay() : utcDay(approval);
        await conn.query(`INSERT INTO investment_capital_history (investor_user_id, investment_id, effective_day, principal_usd, recorded_at) VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE principal_usd = VALUES(principal_usd), recorded_at = VALUES(recorded_at)`, [userId, before.investment_id, effectiveDay, updates.totalInvestmentUsd ?? before.total_investment_usd, ts]);
      }
    }
    // Registration/start_date input is never an eligibility source.
    delete updates.startDate;

  // Only accept keys that are actually updatable columns — the caller may
  // pass a whole fetched profile back (including id/username/etc.), and
  // those must be silently dropped rather than corrupting the SQL.
  const entries = Object.entries(updates).filter(
    ([key, v]) => v !== undefined && key in UPDATABLE_COLUMNS
  ) as [keyof ProfileUpdate, string | number | null][];
  if (entries.length > 0) {
    const setClause = entries.map(([key]) => `${UPDATABLE_COLUMNS[key]} = ?`).join(', ');
    const values = entries.map(([, value]) => value);
    await conn.query(
      `UPDATE investor_profiles SET ${setClause}, updated_at = ? WHERE user_id = ?`,
      [...values, new Date().toISOString().slice(0, 19).replace('T', ' '), userId]
    );
  }
    const confirmationChanged = (updates.totalInvestmentUsd !== undefined && Number(updates.totalInvestmentUsd) !== Number(before.total_investment_usd)) ||
      (updates.kycStatus !== undefined && updates.kycStatus !== before.kyc_status) ||
      (updates.accountStatus !== undefined && updates.accountStatus !== before.account_status) ||
      (updates.plan !== undefined && (updates.plan !== before.plan || !before.plan_id));
    if (confirmationChanged) await creditDirectReferral(conn, userId);
    await conn.commit();
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }

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
  network: string;
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
    network: row.network,
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
  network?: string;
  applyToWallet?: boolean;
  depositRequestId?: string;
  depositAdminNote?: string;
}): Promise<WalletTransactionRecord> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const status = params.status || 'Completed';
  const note = params.note || '';
  const network = params.network || '';

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    if (params.applyToWallet) {
      if (!Number.isFinite(params.amountBtc) || !Number.isFinite(params.amountUsd)) throw new Error('Invalid transaction amounts.');
      const [profiles] = await conn.query<RowDataPacket[]>('SELECT * FROM investor_profiles WHERE user_id = ? FOR UPDATE', [params.investorUserId]);
      const p = profiles[0];
      if (!p) throw new Error('Investor profile not found.');
      if (Number(p.total_btc_allocated) + params.amountBtc < 0) throw new Error('Transaction would make the wallet balance negative.');
      if (params.depositRequestId) {
        const [requests] = await conn.query<RowDataPacket[]>('SELECT * FROM deposit_requests WHERE id = ? FOR UPDATE', [params.depositRequestId]);
        const request = requests[0];
        if (!request || request.status !== 'Pending' || request.investor_user_id !== params.investorUserId || Number(request.amount_usd) !== params.amountUsd) throw new Error('Deposit has already been reviewed or does not match this investment.');
        await conn.query("UPDATE deposit_requests SET status = 'Approved', admin_note = ?, reviewed_at = ? WHERE id = ?", [params.depositAdminNote || '', createdAt, params.depositRequestId]);
      }
      const principal = params.type === 'Deposit' ? Number(p.total_investment_usd) + params.amountUsd : Number(p.total_investment_usd);
      if (principal < 0) throw new Error('Investment principal cannot become negative.');
      await conn.query('UPDATE investor_profiles SET total_btc_allocated = total_btc_allocated + ?, current_portfolio_value_usd = current_portfolio_value_usd + ?, total_investment_usd = ?, btc_mined = btc_mined + ?, updated_at = ? WHERE user_id = ?', [params.amountBtc, params.amountUsd, principal, params.type === 'Mining Credit' ? params.amountBtc : 0, createdAt, params.investorUserId]);
      if (params.type === 'Deposit' && p.kyc_approved_at) await conn.query(`INSERT INTO investment_capital_history (investor_user_id, investment_id, effective_day, principal_usd, recorded_at) VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE principal_usd = VALUES(principal_usd), recorded_at = VALUES(recorded_at)`, [p.user_id, p.investment_id, platformDay(), principal, createdAt]);
    }
  await conn.query(
    'INSERT INTO wallet_transactions (id, investor_user_id, type, amount_btc, amount_usd, status, note, network, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, params.investorUserId, params.type, params.amountBtc, params.amountUsd, status, note, network, createdAt]
  );
    if (params.applyToWallet && params.type === 'Deposit' && status === 'Completed') await creditDirectReferral(conn, params.investorUserId);
    await conn.commit();
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }

  return {
    id,
    investorUserId: params.investorUserId,
    type: params.type,
    amountBtc: params.amountBtc,
    amountUsd: params.amountUsd,
    status,
    note,
    network,
    createdAt
  };
}

interface PayoutRow extends RowDataPacket {
  id: string;
  investor_user_id: string;
  investor_name?: string;
  amount_btc: string;
  destination_wallet: string;
  network: string;
  status: PayoutRecordRow['status'];
  requested_at: string;
  processed_at: string | null;
  notes: string;
}

function toPayout(row: PayoutRow): PayoutRecordRow {
  return {
    amountUsd: Number(row.amount_usd || 0),
    currency: row.currency === 'USD' ? 'USD' : 'BTC',
    id: row.id,
    investorUserId: row.investor_user_id,
    investorName: row.investor_name,
    amountBtc: Number(row.amount_btc),
    destinationWallet: row.destination_wallet,
    network: row.network,
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

export async function getPayoutById(payoutId: string): Promise<PayoutRecordRow | undefined> {
  const [rows] = await pool.query<PayoutRow[]>(
    `SELECT p.*, u.name AS investor_name FROM payouts p JOIN users u ON u.id = p.investor_user_id WHERE p.id = ?`,
    [payoutId]
  );
  return rows[0] ? toPayout(rows[0]) : undefined;
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
  network?: string;
}): Promise<PayoutRecordRow> {
  const id = crypto.randomUUID();
  const requestedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const network = params.network || '';

  await pool.query(
    'INSERT INTO payouts (id, investor_user_id, amount_btc, destination_wallet, network, status, requested_at, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, params.investorUserId, params.amountBtc, params.destinationWallet, network, 'Requested', requestedAt, '']
  );

  return {
    amountUsd: 0,
    currency: 'BTC',
    id,
    investorUserId: params.investorUserId,
    amountBtc: params.amountBtc,
    destinationWallet: params.destinationWallet,
    network,
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
