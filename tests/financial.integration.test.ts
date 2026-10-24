import 'dotenv/config';
import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import crypto from 'node:crypto';
import { pool, initSchema } from '../server/database';
import { initFinancialSchema } from '../server/financialSchema';
import { createPlan, listPlans, updatePlan, deletePlan } from '../server/adminData';
import { createUser, findUserByUsername } from '../server/db';
import { getProfile, updateProfile, getPayoutById, addTransaction } from '../server/investors';
import { createOtpForUser, verifyAndConsumeOtp } from '../server/passwordReset';
import { submitPayout, submitUsdPayout, settlePayout, reconcileDailyInterest } from '../server/financialEngine';
import { platformDay, addDays } from '../server/planPolicy';
import { getExchangeRate } from '../server/exchangeRates';

const users: string[] = [], plans: string[] = [];
let originalWithdrawalLimit: number | null = null;
const stamp = crypto.randomUUID().slice(0, 8);
const price = 100000;
const planInput = { name: `Finova test ${stamp}`, tagline: '', minInvestmentUsd: 100, maxInvestmentUsd: 100000, durationMonths: 12, managementFeePercent: 6.5, dailyReturnPercent: 0.5, payoutRequestDays: 15, minimumThresholdPercent: 2, withdrawalEntryFeePercent: 1.25, payoutFrequency: 'Monthly' as const, status: 'Active' as const };
const market = async () => ({ usd: price, change24hPercent: 0, difficultyT: 0, updatedAt: new Date().toISOString() });

after(async () => {
  if (originalWithdrawalLimit !== null) await pool.query("UPDATE withdrawal_settings SET max_withdrawal_usd=? WHERE id='global'",[originalWithdrawalLimit]);
  for (const id of users) await pool.query("DELETE FROM users WHERE id = ? AND username LIKE 'finova_test_%'", [id]);
  for (const id of plans) await pool.query('DELETE FROM investment_plans WHERE id = ? AND name LIKE ?', [id, `%${stamp}%`]);
  await pool.end();
});

test('financial and authentication integration against disposable test investors', async t => {
  await initSchema(); await initFinancialSchema();
  const [limits] = await pool.query<any[]>("SELECT max_withdrawal_usd FROM withdrawal_settings WHERE id='global'");
  originalWithdrawalLimit = Number(limits[0].max_withdrawal_usd);
  await pool.query("UPDATE withdrawal_settings SET max_withdrawal_usd=4000 WHERE id='global'");
  const plan = await createPlan(planInput); plans.push(plan.id);
  const user = await createUser({ username: `finova_test_${stamp}`, password: 'TestPassword123!', name: 'Disposable integration fixture', role: 'investor' }); users.push(user.id);
  let fixture = (await getProfile(user.id))!;
  const publicId = fixture.investorId;
  await t.test('ID migration is idempotent and preserves legacy ID and wallet balance', async () => {
    assert.match(publicId, /^FINOVA\d+$/);
    assert.equal(fixture.legacyInvestorId, user.id);
    assert.equal(fixture.agreementNumber, user.id);
    await pool.query("UPDATE investor_profiles SET agreement_number = 'FNV-MCT-AGR-2025-0842' WHERE user_id = ?", [user.id]);
    await initFinancialSchema();
    fixture = (await getProfile(user.id))!;
    assert.equal(fixture.investorId, publicId);
    assert.equal(fixture.agreementNumber, user.id);
    const [contracts] = await pool.query<any[]>('SELECT agreement_number FROM investor_profiles WHERE user_id = ?', [user.id]);
    assert.equal(contracts[0].agreement_number, user.id);
    assert.equal((await updateProfile(user.id, {agreementNumber: 'manual-replacement'})).agreementNumber, user.id);
    assert.equal(fixture.totalBtcAllocated, 0);
    assert.equal(fixture.joiningDate, null);
  });
  await t.test('plan edits preserve assigned terms and deletion stays blocked after rename', async () => {
    await updateProfile(user.id, { plan: plan.name });
    await updatePlan(plan.id, { name: `${plan.name} edited`, dailyReturnPercent: 2.75, minimumThresholdPercent: 50 });
    fixture = (await getProfile(user.id))!;
    assert.equal(fixture.planTerms?.dailyReturnPercent, 0.5);
    assert.equal(fixture.planTerms?.minimumThresholdPercent, 2);
    assert.equal((await listPlans()).find(p => p.id === plan.id)?.activeInvestorsCount, 1);
    await assert.rejects(deletePlan(plan.id), /assigned investors/);
  });
  await t.test('KYC approval becomes joining date and cannot be reset by reapproval', async () => {
    fixture = await updateProfile(user.id, { kycStatus: 'Verified', accountStatus: 'Active', totalInvestmentUsd: 10000, totalBtcAllocated: 0.02, currentPortfolioValueUsd: 2000 });
    assert.equal(fixture.joiningDate, platformDay());
    const first = fixture.kycApprovedAt;
    await updateProfile(user.id, { kycStatus: 'Pending' });
    fixture = await updateProfile(user.id, { kycStatus: 'Verified', kycApprovedAt: '2020-01-01T00:00:00Z' });
    assert.equal(fixture.kycApprovedAt, first);
    await assert.rejects(submitPayout({ investorUserId: user.id, amountBtc: 0.0001, destinationWallet: 'test-wallet', network: 'BTC' }, price), /Next eligible/);
  });
  // Move only the disposable fixture's approval date to exercise a seasoned investment.
  const join = addDays(platformDay(), -30);
  await pool.query('UPDATE investor_profiles SET kyc_approved_at = ? WHERE user_id = ?', [`${join} 00:00:00`, user.id]);
  await pool.query('UPDATE investment_capital_history SET effective_day = ? WHERE investor_user_id = ?', [join, user.id]);
  await t.test('wallet and minimum retained principal are enforced in the backend', async () => {
    await assert.rejects(submitPayout({ investorUserId: user.id, amountBtc: 0.03, destinationWallet: 'test-wallet', network: 'BTC' }, price), /available wallet/);
    // $2000 wallet - $1500 monthly payout obligation = $500 maximum.
    await assert.rejects(submitPayout({ investorUserId: user.id, amountBtc: 0.00501, destinationWallet: 'test-wallet', network: 'BTC' }, price), /Maximum eligible/);
    const blocked = crypto.randomUUID();
    await pool.query("INSERT INTO payouts (id, investor_user_id, investment_id, amount_btc, amount_usd, destination_wallet, requested_at, status) VALUES (?, ?, ?, 0.008, 800, 'test-wallet', UTC_TIMESTAMP(), 'Rejected')", [blocked, user.id, fixture.investmentId]);
    await assert.rejects(settlePayout(blocked, 'Completed', 'test'), /minimum wallet threshold/);
    await pool.query('DELETE FROM payouts WHERE id = ? AND investor_user_id = ?', [blocked, user.id]);
  });
  let payoutId: string;
  await t.test('simultaneous requests accept only one and record investment and valuation', async () => {
    const request = () => submitPayout({ investorUserId: user.id, amountBtc: 0.0005, destinationWallet: 'test-wallet', network: 'BTC' }, price);
    const outcomes = await Promise.allSettled([request(), request()]);
    assert.equal(outcomes.filter(r => r.status === 'fulfilled').length, 1);
    payoutId = (outcomes.find(r => r.status === 'fulfilled') as PromiseFulfilledResult<string>).value;
    assert.equal((await getPayoutById(payoutId))?.amountBtc, 0.0005);
    assert.equal((await getProfile(user.id))?.nextWithdrawalDate, addDays(platformDay(), 15));
  });
  await t.test('repeated settlement debits once and reversal restores funds exactly once', async () => {
    await Promise.all([settlePayout(payoutId, 'Completed', 'test'), settlePayout(payoutId, 'Completed', 'test')]);
    assert.equal((await getProfile(user.id))?.totalBtcAllocated, 0.0195);
    await Promise.all([settlePayout(payoutId, 'Requested', 'reversal'), settlePayout(payoutId, 'Requested', 'reversal')]);
    assert.equal((await getProfile(user.id))?.totalBtcAllocated, 0.02);
    await settlePayout(payoutId, 'Completed', 'test');
  });
  await t.test('daily interest reconciles missed days once, without applying stored fee deductions', async () => {
    const credited = await reconcileDailyInterest({ investorUserId: user.id, getMarket: market });
    assert.equal(credited, 30);
    assert.equal(await reconcileDailyInterest({ investorUserId: user.id, getMarket: market }), 0);
    assert.equal((await getProfile(user.id))?.totalBtcAllocated, 0.0195);
    assert.equal((await getProfile(user.id))?.usdWalletBalance, 1500);
    const [rows] = await pool.query<any[]>('SELECT COUNT(*) AS credits, SUM(amount_usd) AS usd FROM daily_interest_credits WHERE investor_user_id = ?', [user.id]);
    assert.equal(rows[0].credits, 30); assert.equal(Number(rows[0].usd), 1500);
    const [denominations] = await pool.query<any[]>('SELECT currency, btc_price_usd, amount_btc FROM daily_interest_credits WHERE investor_user_id = ?', [user.id]);
    assert.ok(denominations.every(row => row.currency === 'USD' && Number(row.btc_price_usd) === 0 && Number(row.amount_btc) === 0));
  });
  await t.test('USD interest never requests a BTC quote, including when the provider is unavailable', async () => {
    let calls=0;
    assert.equal(await reconcileDailyInterest({investorUserId:user.id,getMarket:async()=>{calls++;throw Error('Provider unavailable');}}),0);
    assert.equal(calls,0);
    assert.equal((await getProfile(user.id))?.totalBtcAllocated,0.0195);
    assert.equal((await getProfile(user.id))?.usdWalletBalance,1500);
  });
  await t.test('USD withdrawal enforces its own available balance and retained threshold, and settles once without changing BTC', async () => {
    await pool.query('UPDATE payouts SET requested_at = ? WHERE investor_user_id = ?', [addDays(platformDay(), -16) + ' 00:00:00', user.id]);
    await pool.query('UPDATE investor_profiles SET usd_wallet_balance = 1550 WHERE user_id = ?', [user.id]);
    const request = (amountUsd: number) => submitUsdPayout({investorUserId: user.id, amountUsd, destination: 'Audit USD bank account'});
    await assert.rejects(request(1551), /available USD/);
    await assert.rejects(request(51), /30-day/);
    await assert.rejects(request(1.001), /two decimal/);
    const beforeBtc = (await getProfile(user.id))!.totalBtcAllocated;
    const id = await request(50);
    const payout = (await getPayoutById(id))!;
    assert.equal(payout.currency, 'USD'); assert.equal(payout.amountBtc, 0); assert.equal(payout.amountUsd, 50);
    await Promise.all([settlePayout(id, 'Completed', 'USD test'), settlePayout(id, 'Completed', 'USD test')]);
    assert.equal((await getProfile(user.id))!.usdWalletBalance, 1500);
    assert.equal((await getProfile(user.id))!.totalBtcAllocated, beforeBtc);
    await settlePayout(id, 'Rejected', 'USD reversal');
    assert.equal((await getProfile(user.id))!.usdWalletBalance, 1550);
  });
  await t.test('OTP purposes are separate and only one concurrent consume succeeds', async () => {
    const otp = await createOtpForUser(user.id);
    assert.match(otp, /^\d{6}$/);
    assert.equal(await verifyAndConsumeOtp(user.id, otp, 'withdrawal'), false);
    const outcomes = await Promise.all([verifyAndConsumeOtp(user.id, otp), verifyAndConsumeOtp(user.id, otp)]);
    assert.equal(outcomes.filter(Boolean).length, 1);
    assert.equal(await verifyAndConsumeOtp(user.id, otp), false);
  });
  await t.test('five bad OTP attempts and expired codes are rejected', async () => {
    const otp = await createOtpForUser(user.id, 'withdrawal');
    for (let i = 0; i < 5; i++) assert.equal(await verifyAndConsumeOtp(user.id, otp === '000000' ? '111111' : '000000', 'withdrawal'), false);
    assert.equal(await verifyAndConsumeOtp(user.id, otp, 'withdrawal'), false);
    await pool.query("UPDATE password_reset_otps SET attempts = 0, expires_at = DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 SECOND) WHERE user_id = ?", [user.id]);
    assert.equal(await verifyAndConsumeOtp(user.id, otp, 'withdrawal'), false);
  });
  await t.test('reset API changes password, new login works and old login fails', async () => {
    await pool.query('DELETE FROM password_reset_otps WHERE user_id = ?', [user.id]);
    const otp = await createOtpForUser(user.id);
    const request = (route: string, data: object) => fetch(`http://localhost:8787/api/auth/${route}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    // This test does not send mail to any address; it tests the issued-code reset flow.
    await updateProfile(user.id, { email: `finova-test-${stamp}@example.invalid` });
    const reset = await request('reset-password', { email: `finova-test-${stamp}@example.invalid`, otp, newPassword: 'ChangedPassword123!' });
    assert.equal(reset.status, 200, await reset.text());
    assert.equal((await request('login', { username: user.username, password: 'TestPassword123!' })).status, 401);
    assert.equal((await request('login', { username: user.username, password: 'ChangedPassword123!' })).status, 200);
    assert.ok(await findUserByUsername(user.username));
  });
  await t.test('unassigned plan can be deleted', async () => {
    const unused = await createPlan({ ...planInput, name: `${planInput.name} unused` });
    await deletePlan(unused.id);
    assert.equal((await listPlans()).find(p => p.id === unused.id), undefined);
  });
  await t.test('concurrent wallet credits and principal history preserve every balance movement', async () => {
    const before = (await getProfile(user.id))!;
    await Promise.all([
      addTransaction({ investorUserId: user.id, type: 'Deposit', amountBtc: 0.01, amountUsd: 1000, applyToWallet: true }),
      addTransaction({ investorUserId: user.id, type: 'Adjustment', amountBtc: 0.001, amountUsd: 100, applyToWallet: true })
    ]);
    const after = (await getProfile(user.id))!;
    assert.equal(after.totalInvestmentUsd, 11000);
    assert.equal(after.totalBtcAllocated, Math.round((before.totalBtcAllocated + 0.011) * 1e8) / 1e8);
    assert.equal(await reconcileDailyInterest({ investorUserId: user.id, getMarket: market, now: new Date(addDays(platformDay(), 1) + 'T12:00:00Z') }), 1);
    const [credit] = await pool.query<any[]>('SELECT amount_usd FROM daily_interest_credits WHERE investor_user_id = ? AND eligible_day = ?', [user.id, platformDay()]);
    assert.equal(Number(credit[0].amount_usd), 55);
  });
  await t.test('investor password change rejects an incorrect current password and accepts a verified change', async () => {
    const login = await fetch('http://localhost:8787/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: user.username, password: 'ChangedPassword123!' }) });
    const { token } = await login.json() as { token: string };
    const change = (currentPassword: string) => fetch('http://localhost:8787/api/auth/credentials', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ currentPassword, newPassword: 'FinalTestPassword123!' }) });
    assert.equal((await change('incorrect')).status, 401);
    assert.equal((await change('ChangedPassword123!')).status, 200);
    assert.equal((await fetch('http://localhost:8787/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })).status, 401);
    const signedIn = await fetch('http://localhost:8787/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: user.username, password: 'FinalTestPassword123!' }) });
    assert.equal(signedIn.status, 200);
  });
  await t.test('exchange provider failure returns the stored successful rate with a stale label', async () => {
    const [saved] = await pool.query<any[]>("SELECT * FROM exchange_rate_cache WHERE base_currency = 'USD'");
    if (!saved[0]) throw new Error('Fetch /api/exchange-rate once before running the cached-rate integration test.');
    const rate = await getExchangeRate({ now: Date.now() + 2 * 3600000, fetchProvider: async () => { throw new Error('Simulated provider failure'); } });
    assert.equal(rate.stale, true);
    assert.equal(rate.rate, Number(saved[0].inr_rate));
    assert.equal(rate.sourceDate, saved[0].source_date);
  });
});
