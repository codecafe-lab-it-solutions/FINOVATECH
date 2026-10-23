import crypto from 'node:crypto';
import {getPlatformSettings} from './platformSettings';
import type { RowDataPacket } from 'mysql2';
import { pool } from './database';
import type { BtcMarketData } from './market';
import { PlanTerms, platformDay, utcDay, addDays, nextEligibleDay, maximumWithdrawal, maturityDay } from './planPolicy';

const nowSql = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
const readTerms = (value: any): PlanTerms | null => typeof value === 'string' ? JSON.parse(value) : value;
export class PolicyError extends Error {}

export async function submitUsdPayout(params: { investorUserId: string; amountUsd: number; destination: string }): Promise<string> {
  if (!Number.isFinite(params.amountUsd) || params.amountUsd < 0.01 || Math.abs(params.amountUsd * 100 - Math.round(params.amountUsd * 100)) > 0.000001) throw new PolicyError('Enter a positive USD amount with at most two decimal places.');
  if (!params.destination.trim() || params.destination.trim().length < 6 || params.destination.trim() === 'Not set') throw new PolicyError('Enter your USD bank/payment destination details.');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM investor_profiles WHERE user_id = ? FOR UPDATE', [params.investorUserId]);
    const p = rows[0], terms = readTerms(p?.plan_terms);
    if (!p || !terms || p.kyc_status !== 'Verified' || !p.kyc_approved_at || p.account_status !== 'Active') throw new PolicyError('A verified KYC approval date and assigned investment plan are required for an active account.');
    const [settings] = await conn.query<RowDataPacket[]>("SELECT * FROM withdrawal_settings WHERE id = 'global' LOCK IN SHARE MODE");
    if (!settings[0]?.withdrawals_enabled) throw new PolicyError('Withdrawals are currently disabled.');
    const [previous] = await conn.query<RowDataPacket[]>("SELECT MAX(requested_at) AS latest, COALESCE(SUM(CASE WHEN currency = 'USD' AND status IN ('Requested', 'Processing') THEN amount_usd ELSE 0 END), 0) AS reserved FROM payouts WHERE investor_user_id = ? AND (investment_id = ? OR investment_id IS NULL)", [p.user_id, p.investment_id]);
    const next = nextEligibleDay(utcDay(p.kyc_approved_at), previous[0].latest ? utcDay(previous[0].latest) : null, terms.payoutRequestDays, p.next_withdrawal_date);
    if (platformDay() < next) throw new PolicyError(`Next eligible withdrawal date: ${next}.`);
    if (params.amountUsd > Number(settings[0].max_withdrawal_usd)) throw new PolicyError('Requested amount exceeds the global USD transaction limit.');
    const available = Number(p.usd_wallet_balance) - Number(previous[0].reserved);
    if (params.amountUsd > available) throw new PolicyError('Requested amount exceeds your available USD wallet balance.');
    if (params.amountUsd > maximumWithdrawal(Number(p.total_investment_usd), available, terms.dailyReturnPercent) + 0.000001) throw new PolicyError('Requested amount would violate the 30-day payout obligation.');
    const id = crypto.randomUUID();
    await conn.query("INSERT INTO payouts (id, investor_user_id, investment_id, amount_btc, amount_usd, currency, destination_wallet, network, status, requested_at, notes) VALUES (?, ?, ?, 0, ?, 'USD', ?, 'USD bank/payment', 'Requested', ?, '')", [id, p.user_id, p.investment_id, params.amountUsd, params.destination.trim(), nowSql()]);
    await conn.commit(); return id;
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
}

export async function submitPayout(params: { investorUserId: string; amountBtc: number; destinationWallet: string; network: string }, btcPrice: number): Promise<string> {
  if (params.amountBtc < (await getPlatformSettings()).minPayoutBtc) throw new PolicyError('Amount is below the configured legacy BTC minimum.');
  if (!Number.isFinite(btcPrice) || btcPrice <= 0 || !Number.isFinite(params.amountBtc) || params.amountBtc <= 0) throw new PolicyError('Invalid withdrawal amount or BTC price.');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [profiles] = await conn.query<RowDataPacket[]>('SELECT * FROM investor_profiles WHERE user_id = ? FOR UPDATE', [params.investorUserId]);
    const p = profiles[0];
    const terms = readTerms(p?.plan_terms);
    if (!p || !terms || !p.kyc_approved_at || p.kyc_status !== 'Verified' || p.account_status !== 'Active') throw new PolicyError('A verified KYC approval date and assigned investment plan are required for an active account. Contact your administrator.');
    const [settings] = await conn.query<RowDataPacket[]>("SELECT * FROM withdrawal_settings WHERE id = 'global' LOCK IN SHARE MODE");
    if (!settings[0]?.withdrawals_enabled) throw new PolicyError('Withdrawals are currently disabled.');
    const [previous] = await conn.query<RowDataPacket[]>('SELECT MAX(requested_at) AS latest, COALESCE(SUM(CASE WHEN status IN (\'Requested\', \'Processing\') THEN amount_btc ELSE 0 END), 0) AS reserved FROM payouts WHERE investor_user_id = ? AND (investment_id = ? OR investment_id IS NULL)', [params.investorUserId, p.investment_id]);
    const next = nextEligibleDay(utcDay(p.kyc_approved_at), previous[0].latest ? utcDay(previous[0].latest) : null, terms.payoutRequestDays, p.next_withdrawal_date);
    if (platformDay() < next) throw new PolicyError(`Next eligible withdrawal date: ${next}. Required gap: ${Math.max(7, terms.payoutRequestDays)} days.`);
    const requestedUsd = params.amountBtc * btcPrice;
    const usd = Math.round(requestedUsd * 100) / 100;
    if (requestedUsd > Number(settings[0].max_withdrawal_usd)) throw new PolicyError(`Withdrawal exceeds the $${settings[0].max_withdrawal_usd} transaction limit.`);
    const availableBtc = Number(p.total_btc_allocated) - Number(previous[0].reserved);
    if (params.amountBtc > availableBtc) throw new PolicyError('Requested amount exceeds your available wallet balance, including pending withdrawals.');
    const max = maximumWithdrawal(Number(p.total_investment_usd), availableBtc * btcPrice, terms.dailyReturnPercent);
    if (requestedUsd > max + 0.000001) throw new PolicyError(`Maximum eligible withdrawal is $${Math.floor(max * 100) / 100}. Your wallet must retain ${terms.dailyReturnPercent * 30}% of the invested amount across 30 days.`);
    const id = crypto.randomUUID();
    await conn.query(`INSERT INTO payouts (id, investor_user_id, investment_id, amount_btc, amount_usd, destination_wallet, network, status, requested_at, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Requested', ?, '')`, [id, params.investorUserId, p.investment_id, params.amountBtc, usd, params.destinationWallet, params.network, nowSql()]);
    await conn.commit();
    return id;
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
}

// Status and balance changes share a transaction. Repeating Completed cannot debit twice.
export async function settlePayout(id: string, status: string, notes: string): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [found] = await conn.query<RowDataPacket[]>('SELECT investor_user_id FROM payouts WHERE id = ?', [id]);
    if (!found[0]) throw new PolicyError('Payout not found.');
    const [profiles] = await conn.query<RowDataPacket[]>('SELECT * FROM investor_profiles WHERE user_id = ? FOR UPDATE', [found[0].investor_user_id]);
    const [payouts] = await conn.query<RowDataPacket[]>('SELECT * FROM payouts WHERE id = ? FOR UPDATE', [id]);
    const p = payouts[0], profile = profiles[0];
    if (p.currency === 'USD') {
      if (p.investment_id !== profile.investment_id) throw new PolicyError('This payout belongs to a different investment.');
      const amount = Number(p.amount_usd);
      if (p.status !== 'Completed' && status === 'Completed') {
        const [reserved] = await conn.query<RowDataPacket[]>("SELECT COALESCE(SUM(amount_usd), 0) AS usd FROM payouts WHERE investor_user_id = ? AND id <> ? AND currency = 'USD' AND status IN ('Requested', 'Processing') AND (investment_id = ? OR investment_id IS NULL)", [p.investor_user_id, id, profile.investment_id]);
        const available = Number(profile.usd_wallet_balance) - Number(reserved[0].usd);
        const terms = readTerms(profile.plan_terms);
        if (!terms || amount > maximumWithdrawal(Number(profile.total_investment_usd), available, terms.dailyReturnPercent) + 0.000001) throw new PolicyError('Insufficient USD funds after pending requests and the 30-day payout obligation.');
      }
      const delta = p.status === 'Completed' && status !== 'Completed' ? amount : p.status !== 'Completed' && status === 'Completed' ? -amount : 0;
      if (delta) {
        await conn.query('UPDATE investor_profiles SET usd_wallet_balance = usd_wallet_balance + ?, current_portfolio_value_usd = current_portfolio_value_usd + ?, updated_at = ? WHERE user_id = ?', [delta, delta, nowSql(), p.investor_user_id]);
        await conn.query("INSERT INTO wallet_transactions (id, investor_user_id, type, amount_btc, amount_usd, status, note, network, created_at) VALUES (?, ?, 'Payout', 0, ?, ?, ?, 'USD bank/payment', ?)", [crypto.randomUUID(), p.investor_user_id, delta, delta > 0 ? 'Reversed' : 'Completed', `USD payout ${id}`, nowSql()]);
      }
      await conn.query('UPDATE payouts SET status = ?, notes = ?, processed_at = ? WHERE id = ?', [status, notes, ['Completed', 'Rejected'].includes(status) ? nowSql() : null, id]);
      await conn.commit(); return;
    }
    if (p.status === 'Completed' && status !== 'Completed') {
      await conn.query('UPDATE investor_profiles SET total_btc_allocated = total_btc_allocated + ?, current_portfolio_value_usd = current_portfolio_value_usd + ?, updated_at = ? WHERE user_id = ?', [p.amount_btc, p.amount_usd || 0, nowSql(), p.investor_user_id]);
      await conn.query(`INSERT INTO wallet_transactions (id, investor_user_id, type, amount_btc, amount_usd, status, note, network, created_at)
        VALUES (?, ?, 'Payout', ?, ?, 'Reversed', ?, ?, ?)`, [crypto.randomUUID(), p.investor_user_id, p.amount_btc, p.amount_usd || 0, `Reversal of payout ${id}`, p.network, nowSql()]);
    }
    if (p.status !== 'Completed' && status === 'Completed') {
      if (p.investment_id && p.investment_id !== profile.investment_id) throw new PolicyError('This payout belongs to a different investment.');
      const [reserved] = await conn.query<RowDataPacket[]>("SELECT COALESCE(SUM(amount_btc), 0) AS btc FROM payouts WHERE investor_user_id = ? AND id <> ? AND status IN ('Requested', 'Processing') AND (investment_id = ? OR investment_id IS NULL)", [p.investor_user_id, id, profile.investment_id]);
      const availableBtc = Number(profile.total_btc_allocated) - Number(reserved[0].btc);
      if (Number(p.amount_btc) > availableBtc) throw new PolicyError('Wallet balance is insufficient to complete this payout after other reserved requests.');
      const terms = readTerms(profile.plan_terms);
      if (terms && Number(p.amount_usd) > 0) {
        const requestPrice = Number(p.amount_usd) / Number(p.amount_btc);
        const max = maximumWithdrawal(Number(profile.total_investment_usd), availableBtc * requestPrice, terms.dailyReturnPercent);
        if (Number(p.amount_usd) > max + 0.000001) throw new PolicyError('Completing this payout would violate the required minimum wallet threshold.');
      }
      await conn.query('UPDATE investor_profiles SET total_btc_allocated = total_btc_allocated - ?, current_portfolio_value_usd = current_portfolio_value_usd - ?, updated_at = ? WHERE user_id = ?', [p.amount_btc, p.amount_usd || 0, nowSql(), p.investor_user_id]);
      await conn.query(`INSERT INTO wallet_transactions (id, investor_user_id, type, amount_btc, amount_usd, status, note, network, created_at)
        VALUES (?, ?, 'Payout', ?, ?, 'Completed', ?, ?, ?)`, [crypto.randomUUID(), p.investor_user_id, -Number(p.amount_btc), -Number(p.amount_usd || 0), `Payout ${id}`, p.network, nowSql()]);
    }
    await conn.query('UPDATE payouts SET status = ?, notes = ?, processed_at = ? WHERE id = ?', [status, notes, ['Completed', 'Rejected'].includes(status) ? nowSql() : null, id]);
    await conn.commit();
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
}

let running = false;
export async function reconcileDailyInterest(options: { now?: Date; investorUserId?: string; getMarket?: () => Promise<BtcMarketData> } = {}): Promise<number> {
  if (running) return 0;
  running = true;
  let credits = 0, failures = 0;
  try {
    if (!(await getPlatformSettings()).autoCalculateDaily) return 0;
    const today = platformDay(options.now);
    const [eligible] = await pool.query<RowDataPacket[]>("SELECT user_id FROM investor_profiles WHERE kyc_status = 'Verified' AND account_status = 'Active' AND kyc_approved_at IS NOT NULL AND plan_terms IS NOT NULL AND total_investment_usd > 0" + (options.investorUserId ? ' AND user_id = ?' : ''), options.investorUserId ? [options.investorUserId] : []);
    if (!eligible.length) return 0;
    // Daily earnings are dollar funds. Never fetch a BTC quote or convert these credits.
    for (const user of eligible) {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM investor_profiles WHERE user_id = ? FOR UPDATE', [user.user_id]);
        const p = rows[0];
        if (!p) { await conn.commit(); continue; }
        const terms = readTerms(p.plan_terms);
        if (!terms || !p.kyc_approved_at || p.kyc_status !== 'Verified' || p.account_status !== 'Active' || terms.dailyReturnPercent <= 0) { await conn.commit(); continue; }
        const joining = utcDay(p.kyc_approved_at);
        const maturity = maturityDay(joining, terms.durationMonths);
        const [existing] = await conn.query<RowDataPacket[]>('SELECT eligible_day FROM daily_interest_credits WHERE investor_user_id = ? AND investment_id = ?', [p.user_id, p.investment_id]);
        const days = new Set(existing.map(r => r.eligible_day));
        const [capital] = await conn.query<RowDataPacket[]>('SELECT effective_day, principal_usd FROM investment_capital_history WHERE investor_user_id = ? AND investment_id = ? ORDER BY effective_day', [p.user_id, p.investment_id]);
        // Missing capital history must be reviewed rather than applying today's balance to past days.
        if (!capital.length) { await conn.commit(); continue; }
        // Credit a completed eligible day at the following midnight, including missed runs.
        for (let day = joining; day < today && day < maturity; day = addDays(day, 1)) {
          if (days.has(day)) continue;
          const principal = [...capital].reverse().find(event => event.effective_day <= day);
          if (!principal) continue;
          const amountUsd = Math.round(Number(principal.principal_usd) * terms.dailyReturnPercent) / 100;
          if (amountUsd <= 0) continue;
          const id = crypto.randomUUID(), ts = nowSql();
          await conn.query("INSERT INTO daily_interest_credits (id, investor_user_id, investment_id, eligible_day, amount_usd, amount_btc, btc_price_usd, created_at, currency) VALUES (?, ?, ?, ?, ?, 0, 0, ?, 'USD')", [id, p.user_id, p.investment_id, day, amountUsd, ts]);
          await conn.query(`INSERT INTO wallet_transactions (id, investor_user_id, type, amount_btc, amount_usd, status, note, network, created_at)
            VALUES (?, ?, 'Daily Interest', 0, ?, 'Completed', ?, 'USD', ?)`, [id, p.user_id, amountUsd, `USD daily interest ${day}; investment ${p.investment_id}`, ts]);
          await conn.query('UPDATE investor_profiles SET usd_wallet_balance = usd_wallet_balance + ?, current_portfolio_value_usd = current_portfolio_value_usd + ?, updated_at = ? WHERE user_id = ?', [amountUsd, amountUsd, ts, p.user_id]);
          credits++;
        }
        await conn.commit();
      } catch (err) { await conn.rollback(); failures++; console.error('Interest reconciliation failed for investor', user.user_id, err); }
      finally { conn.release(); }
    }
    if (failures) throw new Error(failures + ' investor reconciliations failed; see server logs.');
    return credits;
  } finally { running = false; }
}

export function startInterestScheduler(options: { investorUserId?: string; getMarket?: () => Promise<BtcMarketData> } = {}): void {
  const run = () => runDailyEarningsJob(options.investorUserId ? 'scoped-scheduler' : 'api-scheduler', options).catch(err => console.error('Daily interest scheduler failed; will retry', err));
  void run();
  // Checking the calendar boundary every second schedules midnight in the configured timezone;
  // retries and startup reconciliation recover downtime without relying on browser sessions.
  let lastDay = platformDay();
  setInterval(() => {
    const day = platformDay();
    if (day !== lastDay) { lastDay = day; void run(); }
  }, 1000).unref();
  setInterval(() => void run(), 60_000).unref();
}

export async function runDailyEarningsJob(source = 'cron', options: Parameters<typeof reconcileDailyInterest>[0] = {}) {
 const lock=await pool.getConnection();const id=crypto.randomUUID();let acquired=false;
 try {
  const [held]=await lock.query<any[]>("SELECT GET_LOCK('finova_daily_earnings_job',0) AS acquired");acquired=!!held[0].acquired;if(!acquired)return 0;
  await lock.query("INSERT INTO earnings_job_runs(id,started_at,status,source) VALUES (?,UTC_TIMESTAMP(),'Running',?)",[id,source]);
  const enabled=(await getPlatformSettings()).autoCalculateDaily;
  const credits=enabled?await reconcileDailyInterest(options):0;
  await lock.query('UPDATE earnings_job_runs SET completed_at=UTC_TIMESTAMP(),status=?,credits=? WHERE id=?',[enabled?'Succeeded':'Disabled',credits,id]);
  return credits;
 }catch(err){if(acquired)await lock.query("UPDATE earnings_job_runs SET completed_at=UTC_TIMESTAMP(),status='Failed',error=? WHERE id=?",[err instanceof Error?err.message:String(err),id]);throw err;}
 finally{if(acquired)await lock.query("SELECT RELEASE_LOCK('finova_daily_earnings_job')");lock.release();}
}
