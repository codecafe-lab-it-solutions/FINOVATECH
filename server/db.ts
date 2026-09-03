import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';
import { ensureProfile, updateProfile, setReferralCode, setReferredByCode, addTransaction, createPayoutRequest, updatePayoutStatus } from './investors';

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
  const investorId = crypto.randomUUID();
  await insertUser({
    id: investorId,
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

  // Give the demo investor a populated profile + ledger so the portal has
  // something real to show out of the box; real registrations start at zero.
  await ensureProfile(investorId);
  await updateProfile(investorId, {
    email: 'tariq.albalushi@investor.om',
    phone: '+968 9123 4567',
    country: 'Sultanate of Oman',
    kycStatus: 'Verified',
    accountStatus: 'Active',
    plan: 'Industrial Pod Tier 1 (125 TH/s Dedicated Compute)',
    agreementNumber: 'FNV-MCT-AGR-2025-0842',
    startDate: '15 Jan 2025',
    maturityDate: '15 Jan 2029 (4-Year Defined Term)',
    referrerName: 'Executive Private Wealth Muscat',
    payoutBtcAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    bankName: 'Bank Muscat S.A.O.G',
    bankAccountHolder: 'Dr. Tariq Al-Balushi',
    bankAccountNumber: '0421-9876-5432-10',
    bankIban: 'OM68BMSC04219876543210',
    bankSwift: 'BMSCOM2X',
    totalInvestmentUsd: 50000,
    currentPortfolioValueUsd: 56200,
    totalBtcAllocated: 0.085,
    btcMined: 0.0124,
    btcPendingAccrued: 0.0018,
    miningSharePercent: 0.125
  });
  await setReferralCode(investorId, 'FINO-OM-842');

  await addTransaction({ investorUserId: investorId, type: 'Mining Credit', amountBtc: 0.00042, amountUsd: 26.99 });
  await addTransaction({ investorUserId: investorId, type: 'Referral Commission', amountBtc: 0.00078, amountUsd: 50.14 });
  const payout = await createPayoutRequest({
    investorUserId: investorId,
    amountBtc: 0.0012,
    destinationWallet: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  });
  await updatePayoutStatus(payout.id, 'Completed', 'Auto-settled demo payout.');
  await addTransaction({
    investorUserId: investorId,
    type: 'Payout',
    amountBtc: -0.0012,
    amountUsd: -77.13,
    note: 'Linked to payout ' + payout.id
  });
}

export async function deleteInvestor(userId: string): Promise<void> {
  // Scoped to investor accounts only — cascades to their profile, transactions,
  // payouts, notifications, sessions, and tickets via the FK ON DELETE CASCADE
  // constraints (documents/machines are unassigned via ON DELETE SET NULL).
  await pool.query("DELETE FROM users WHERE id = ? AND role = 'investor'", [userId]);
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

export async function createUser(params: {
  username: string;
  password: string;
  name: string;
  role: UserRole;
  referredByCode?: string;
}): Promise<StoredUser> {
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

  if (params.role === 'investor') {
    await ensureProfile(id);
    const generatedCode = `FINO-${username.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`;
    await setReferralCode(id, generatedCode);
    if (params.referredByCode) {
      await setReferredByCode(id, params.referredByCode.trim());
    }
  }

  return user;
}
