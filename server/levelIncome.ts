import crypto from 'node:crypto';
import type { PoolConnection } from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';

export const MAX_LEVEL = 10;
export const QUALIFYING_INVESTMENT_USD = 500;

// Levels 1-2 pay without a condition. Levels 3-5 need 2 direct referrals who each invested
// at least USD 500; levels 6-10 need 4 such direct referrals.
export function requiredQualifiedReferrals(level: number): number {
  return level <= 2 ? 0 : level <= 5 ? 2 : 4;
}

// Team-business milestones: the total investment of the downline within the level range.
export const REWARD_TIERS = [
  { key: 'R1', targetUsd: 10000, fromLevel: 1, toLevel: 1, reward: 'Thailand Trip' },
  { key: 'R2', targetUsd: 25000, fromLevel: 2, toLevel: 3, reward: 'iPhone' },
  { key: 'R3', targetUsd: 50000, fromLevel: 4, toLevel: 6, reward: 'Dubai Trip + $2,500' },
  { key: 'R4', targetUsd: 100000, fromLevel: 7, toLevel: 8, reward: '$10,000 (Car Fund)' },
  { key: 'R5', targetUsd: 250000, fromLevel: 9, toLevel: 10, reward: '$15,000 (House Fund)' }
] as const;

const nowSql = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
type Q = Pick<PoolConnection, 'query'>;

export async function getLevelIncomeSettings(): Promise<{ level: number; percent: number }[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT level_no, percent FROM level_income_settings ORDER BY level_no');
  return rows.map((r) => ({ level: Number(r.level_no), percent: Number(r.percent) }));
}

export async function saveLevelIncomeSettings(percents: unknown): Promise<{ level: number; percent: number }[]> {
  if (!Array.isArray(percents) || percents.length !== MAX_LEVEL) throw new Error(`Provide a percentage for each of the ${MAX_LEVEL} levels.`);
  const clean = percents.map((value) => Number(value));
  clean.forEach((value, i) => {
    if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error(`Level ${i + 1} percentage must be between 0 and 100.`);
  });
  for (let i = 0; i < MAX_LEVEL; i++) {
    await pool.query('UPDATE level_income_settings SET percent = ?, updated_at = ? WHERE level_no = ?', [Math.round(clean[i] * 10000) / 10000, nowSql(), i + 1]);
  }
  return getLevelIncomeSettings();
}

async function uplineOf(conn: Q, userId: string): Promise<{ userId: string; level: number }[]> {
  const out: { userId: string; level: number }[] = [];
  const seen = new Set([userId]);
  let current = userId;
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const [rows] = await conn.query<RowDataPacket[]>("SELECT s.user_id FROM investor_profiles c JOIN investor_profiles s ON s.referral_code = c.referred_by_code WHERE c.user_id = ? AND c.referred_by_code IS NOT NULL AND c.referred_by_code <> ''", [current]);
    if (rows.length !== 1 || seen.has(rows[0].user_id)) break;
    current = rows[0].user_id;
    seen.add(current);
    out.push({ userId: current, level });
  }
  return out;
}

async function qualifiedDirectCount(conn: Q, receiverId: string): Promise<number> {
  const [rows] = await conn.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM investor_profiles c JOIN investor_profiles r ON r.referral_code = c.referred_by_code WHERE r.user_id = ? AND c.user_id <> r.user_id AND c.total_investment_usd >= ?', [receiverId, QUALIFYING_INVESTMENT_USD]);
  return Number(rows[0].n);
}

// Runs inside the daily-interest transaction: pays the upline a share of the ROI just credited.
// The unique key (receiver, source, day) makes a repeated run harmless.
export async function creditLevelIncome(conn: PoolConnection, sourceUserId: string, roiUsd: number, day: string): Promise<number> {
  const [settings] = await conn.query<RowDataPacket[]>('SELECT level_no, percent FROM level_income_settings WHERE percent > 0');
  if (!settings.length || roiUsd <= 0) return 0;
  const percentByLevel = new Map(settings.map((s) => [Number(s.level_no), Number(s.percent)]));
  let credited = 0;
  for (const { userId: receiverId, level } of await uplineOf(conn, sourceUserId)) {
    const percent = percentByLevel.get(level);
    if (!percent) continue;
    const [receivers] = await conn.query<RowDataPacket[]>('SELECT kyc_status, account_status FROM investor_profiles WHERE user_id = ? FOR UPDATE', [receiverId]);
    if (!receivers[0] || receivers[0].kyc_status !== 'Verified' || receivers[0].account_status !== 'Active') continue;
    const needed = requiredQualifiedReferrals(level);
    if (needed > 0 && (await qualifiedDirectCount(conn, receiverId)) < needed) continue;
    const amount = Math.round(roiUsd * percent) / 100;
    if (amount <= 0) continue;
    const id = crypto.randomUUID(), ts = nowSql();
    const [inserted] = await conn.query<any>('INSERT IGNORE INTO level_income_credits (id, receiver_user_id, source_user_id, level_no, eligible_day, source_roi_usd, rate_percent, amount_usd, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, receiverId, sourceUserId, level, day, roiUsd, percent, amount, ts]);
    if (!inserted.affectedRows) continue;
    await conn.query('UPDATE investor_profiles SET usd_wallet_balance = usd_wallet_balance + ?, current_portfolio_value_usd = current_portfolio_value_usd + ?, updated_at = ? WHERE user_id = ?', [amount, amount, ts, receiverId]);
    await conn.query("INSERT INTO wallet_transactions (id, investor_user_id, type, amount_btc, amount_usd, status, note, network, created_at) VALUES (?, ?, 'Level Income', 0, ?, 'Completed', ?, 'USD', ?)", [id, receiverId, amount, `Level ${level} ROI income ${percent}% of ${roiUsd.toFixed(2)} USD (${day})`, ts]);
    credited++;
  }
  return credited;
}

export async function getLevelIncomeSummary(userId: string) {
  const [byLevel] = await pool.query<RowDataPacket[]>('SELECT level_no, COUNT(*) AS credits, COALESCE(SUM(amount_usd), 0) AS total FROM level_income_credits WHERE receiver_user_id = ? GROUP BY level_no ORDER BY level_no', [userId]);
  const settings = await getLevelIncomeSettings();
  const qualified = await qualifiedDirectCount(pool, userId);
  return {
    qualifiedReferrals: qualified,
    qualifyingInvestmentUsd: QUALIFYING_INVESTMENT_USD,
    totalEarnedUsd: byLevel.reduce((sum, r) => sum + Number(r.total), 0),
    levels: settings.map((s) => {
      const found = byLevel.find((r) => Number(r.level_no) === s.level);
      const required = requiredQualifiedReferrals(s.level);
      return { level: s.level, percent: s.percent, requiredReferrals: required, unlocked: qualified >= required, credits: found ? Number(found.credits) : 0, earnedUsd: found ? Number(found.total) : 0 };
    })
  };
}

// --- Rewards ---

type Business = Map<string, Map<number, number>>;

async function downlineBusiness(): Promise<Business> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT user_id, referral_code, referred_by_code, total_investment_usd FROM investor_profiles");
  const byCode = new Map<string, string>();
  for (const r of rows) if (r.referral_code) byCode.set(r.referral_code, r.user_id);
  const children = new Map<string, { id: string; invested: number }[]>();
  for (const r of rows) {
    const parent = r.referred_by_code ? byCode.get(r.referred_by_code) : undefined;
    if (!parent || parent === r.user_id) continue;
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent)!.push({ id: r.user_id, invested: Number(r.total_investment_usd) });
  }
  const result: Business = new Map();
  for (const r of rows) {
    const perLevel = new Map<number, number>();
    const seen = new Set<string>([r.user_id]);
    let frontier = [r.user_id];
    for (let level = 1; level <= MAX_LEVEL && frontier.length; level++) {
      const next: string[] = [];
      for (const parent of frontier) {
        for (const child of children.get(parent) ?? []) {
          if (seen.has(child.id)) continue;
          seen.add(child.id);
          next.push(child.id);
          perLevel.set(level, (perLevel.get(level) ?? 0) + child.invested);
        }
      }
      frontier = next;
    }
    result.set(r.user_id, perLevel);
  }
  return result;
}

function tierBusiness(perLevel: Map<number, number>, tier: (typeof REWARD_TIERS)[number]): number {
  let total = 0;
  for (let level = tier.fromLevel; level <= tier.toLevel; level++) total += perLevel.get(level) ?? 0;
  return Math.round(total * 100) / 100;
}

// Records newly reached milestones once; the admin later marks each reward Granted.
async function syncRewardGrants(business: Business): Promise<void> {
  for (const [userId, perLevel] of business) {
    for (const tier of REWARD_TIERS) {
      if (tierBusiness(perLevel, tier) >= tier.targetUsd) {
        await pool.query('INSERT IGNORE INTO reward_grants (id, user_id, tier_key, achieved_at, status) VALUES (?, ?, ?, ?, ?)', [crypto.randomUUID(), userId, tier.key, nowSql(), 'Pending']);
      }
    }
  }
}

export async function getRewardProgress(userId: string) {
  const business = await downlineBusiness();
  await syncRewardGrants(business);
  const perLevel = business.get(userId) ?? new Map<number, number>();
  const [grants] = await pool.query<RowDataPacket[]>('SELECT tier_key, status, achieved_at, granted_at FROM reward_grants WHERE user_id = ?', [userId]);
  return REWARD_TIERS.map((tier) => {
    const businessUsd = tierBusiness(perLevel, tier);
    const grant = grants.find((g) => g.tier_key === tier.key);
    return { key: tier.key, reward: tier.reward, fromLevel: tier.fromLevel, toLevel: tier.toLevel, targetUsd: tier.targetUsd, businessUsd, achieved: businessUsd >= tier.targetUsd, status: grant ? (grant.status as string) : 'Not reached', achievedAt: grant?.achieved_at ?? null, grantedAt: grant?.granted_at ?? null };
  });
}

export async function listRewardGrants() {
  await syncRewardGrants(await downlineBusiness());
  const [rows] = await pool.query<RowDataPacket[]>('SELECT g.id, g.user_id, g.tier_key, g.status, g.achieved_at, g.granted_at, g.note, u.name, u.username FROM reward_grants g JOIN users u ON u.id = g.user_id ORDER BY g.achieved_at DESC');
  return rows.map((r) => {
    const tier = REWARD_TIERS.find((t) => t.key === r.tier_key);
    return { id: r.id as string, userId: r.user_id as string, name: r.name as string, username: r.username as string, tierKey: r.tier_key as string, reward: tier?.reward ?? r.tier_key, fromLevel: tier?.fromLevel ?? 0, toLevel: tier?.toLevel ?? 0, targetUsd: tier?.targetUsd ?? 0, status: r.status as string, achievedAt: r.achieved_at, grantedAt: r.granted_at, note: r.note as string };
  });
}

export async function setRewardStatus(id: string, status: 'Pending' | 'Granted', note: string): Promise<boolean> {
  const [result] = await pool.query<any>('UPDATE reward_grants SET status = ?, granted_at = ?, note = ? WHERE id = ?', [status, status === 'Granted' ? nowSql() : null, note.slice(0, 255), id]);
  return result.affectedRows > 0;
}
