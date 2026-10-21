import crypto from 'node:crypto';
import type { PoolConnection } from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';

// Runs atomically with investment confirmation, with the investor profile locked.
export async function creditDirectReferral(conn: PoolConnection, userId: string): Promise<void> {
  const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM investor_profiles WHERE user_id = ?', [userId]);
  const p = rows[0];
  if (!p?.referred_by_code || !p.plan_id || !p.investment_id || Number(p.total_investment_usd) <= 0 || p.kyc_status !== 'Verified' || p.account_status !== 'Active') return;
  const [existing] = await conn.query<RowDataPacket[]>('SELECT id FROM referral_commissions WHERE referred_user_id = ? AND investment_id = ?', [userId, p.investment_id]);
  if (existing.length) return;
  const [parents] = await conn.query<RowDataPacket[]>('SELECT user_id FROM investor_profiles WHERE referral_code = ? AND user_id <> ? FOR UPDATE', [p.referred_by_code, userId]);
  if (parents.length !== 1) return;
  const [plans] = await conn.query<RowDataPacket[]>('SELECT name, direct_referral_percent FROM investment_plans WHERE id = ? LOCK IN SHARE MODE', [p.plan_id]);
  if (!plans[0]) return;
  const rate = Number(plans[0].direct_referral_percent);
  const amount = Math.round(Number(p.total_investment_usd) * rate) / 100;
  const id = crypto.randomUUID(), ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await conn.query('INSERT INTO referral_commissions (id, referrer_user_id, referred_user_id, investment_id, referral_code, plan_name, principal_usd, rate_percent, amount_usd, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, parents[0].user_id, userId, p.investment_id, p.referred_by_code, plans[0].name, p.total_investment_usd, rate, amount, ts]);
  if (amount <= 0) return;
  await conn.query('UPDATE investor_profiles SET usd_wallet_balance = usd_wallet_balance + ?, current_portfolio_value_usd = current_portfolio_value_usd + ?, updated_at = ? WHERE user_id = ?', [amount, amount, ts, parents[0].user_id]);
  await conn.query("INSERT INTO wallet_transactions (id, investor_user_id, type, amount_btc, amount_usd, status, note, network, created_at) VALUES (?, ?, 'Referral Commission', 0, ?, 'Completed', ?, 'USD', ?)", [id, parents[0].user_id, amount, 'Direct referral ' + p.referred_by_code + '; investor ' + userId + '; investment ' + p.investment_id + '; ' + rate + '%', ts]);
}

export async function listAdminReferrals() {
  const [rows] = await pool.query<RowDataPacket[]>(`SELECT
    p.user_id AS referredUserId, u.name AS referredName, u.username AS referredUsername,
    sponsor.user_id AS referrerUserId, su.name AS referrerName, su.username AS referrerUsername,
    COALESCE(c.referral_code, p.referred_by_code) AS referralCode,
    COALESCE(c.plan_name, p.plan) AS planName,
    c.principal_usd AS investmentUsd, c.rate_percent AS ratePercent,
    c.amount_usd AS commissionUsd, c.created_at AS creditedAt,
    CASE WHEN c.id IS NULL THEN 'Awaiting confirmation' WHEN c.amount_usd = 0 THEN 'No reward (0%)' ELSE 'Credited' END AS status
    FROM investor_profiles p JOIN users u ON u.id = p.user_id
    LEFT JOIN investor_profiles sponsor ON sponsor.user_id = (
      SELECT MIN(sp.user_id) FROM investor_profiles sp WHERE sp.referral_code = p.referred_by_code
      HAVING COUNT(*) = 1
    )
    LEFT JOIN users su ON su.id = sponsor.user_id
    LEFT JOIN referral_commissions c ON c.referred_user_id = p.user_id
    WHERE p.referred_by_code IS NOT NULL AND p.referred_by_code <> ''
    ORDER BY COALESCE(c.created_at, u.created_at) DESC, p.user_id`);
  return rows.map(r => ({ ...r, investmentUsd: r.investmentUsd === null ? null : Number(r.investmentUsd), ratePercent: r.ratePercent === null ? null : Number(r.ratePercent), commissionUsd: r.commissionUsd === null ? null : Number(r.commissionUsd) }));
}
