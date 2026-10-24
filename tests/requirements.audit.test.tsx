import 'dotenv/config';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { after, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { pool } from '../server/database';
import { createUser } from '../server/db';
import { getProfile, updateProfile } from '../server/investors';
import { createPlan } from '../server/adminData';
import { submitPayout, reconcileDailyInterest, startInterestScheduler } from '../server/financialEngine';
import { platformDay, platformTimezone, addDays } from '../server/planPolicy';
import { profileToUser, profileToMetrics } from '../src/lib/investorMappers';
import { WalletTab } from '../src/components/investor/WalletTab';
import { InvestorProfileTab } from '../src/components/investor/InvestorProfileTab';
import { PayoutHistoryTab } from '../src/components/investor/PayoutHistoryTab';
import { InvestmentDetailsTab } from '../src/components/investor/InvestmentDetailsTab';
import { InvestorDashboardTab } from '../src/components/investor/InvestorDashboardTab';
import { InvestorSidebar } from '../src/components/investor/InvestorSidebar';
import { ReferralPartnerTab } from '../src/components/investor/ReferralPartnerTab';
import { CurrencyContext, formatDisplayMoney } from '../src/lib/currency';
import { createOtpForUser } from '../server/passwordReset';

// This audit adds HTTP and rendered-output checks beyond the original service tests.
// No implementation changes are made by this file. All mutations target its fixtures.
const users: string[] = [], plans: string[] = [];
const stamp = crypto.randomUUID().slice(0, 8);
const input = { name: `Audit ${stamp}`, tagline: 'Requirement audit', minInvestmentUsd: 100, maxInvestmentUsd: 100000, durationMonths: 12, managementFeePercent: 6.5, dailyReturnPercent: 0.5, payoutRequestDays: 15, minimumThresholdPercent: 2, withdrawalEntryFeePercent: 1.25, payoutFrequency: 'Monthly' as const, status: 'Active' as const };
const today = platformDay();
const request = async (method: string, path: string, body?: object, token?: string) => {
  const response = await fetch('http://localhost:8787' + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: response.status, body: await response.json() as any };
};
const createFixture = async () => {
  const user = await createUser({ username: `finova_test_audit_${stamp}_${users.length}`, password: 'AuditFixture123!', name: 'Disposable requirement audit', role: 'investor' });
  users.push(user.id); return user;
};
after(async () => {
  for (const id of users) await pool.query("DELETE FROM users WHERE id = ? AND username LIKE 'finova_test_audit_%'", [id]);
  for (const id of plans) await pool.query('DELETE FROM investment_plans WHERE id = ? AND name LIKE ?', [id, `%${stamp}%`]);
  await pool.end();
});

test('additional requirement-by-requirement HTTP and rendered-output audit', async t => {
  const admin = await request('POST', '/api/auth/login', { username: 'Admin', password: 'Admin' });
  assert.equal(admin.status, 200, 'Local demo admin credentials are required for the HTTP audit.');
  const adminToken = admin.body.token;
  const fixture = await createFixture();
  const login = await request('POST', '/api/auth/login', { username: fixture.username, password: 'AuditFixture123!' });
  const investorToken = login.body.token;
  let planId = '';
  await t.test('REQ 2 and 3: admin plan creation and decimal-field database/API round trip', async () => {
    const created = await request('POST', '/api/admin/plans', input, adminToken);
    assert.equal(created.status, 201); planId = created.body.plan.id; plans.push(planId);
    const list = await request('GET', '/api/admin/plans', undefined, adminToken);
    const saved = list.body.plans.find((p: any) => p.id === planId);
    for (const key of ['dailyReturnPercent', 'payoutRequestDays', 'minimumThresholdPercent', 'withdrawalEntryFeePercent'] as const) assert.equal(saved[key], input[key]);
  });
  await t.test('REQ 2: investors and anonymous callers cannot edit/delete admin plans', async () => {
    assert.equal((await request('PUT', `/api/admin/plans/${planId}`, { dailyReturnPercent: 99 }, investorToken)).status, 403);
    assert.equal((await request('DELETE', `/api/admin/plans/${planId}`, undefined, investorToken)).status, 403);
    assert.equal((await request('DELETE', `/api/admin/plans/${planId}`)).status, 401);
  });
  await t.test('REQ 3: fractional payout days and invalid percentages are rejected by HTTP API', async () => {
    for (const change of [{ payoutRequestDays: 1.5 }, { dailyReturnPercent: -1 }, { minimumThresholdPercent: 101 }, { withdrawalEntryFeePercent: -0.5 }]) assert.equal((await request('PUT', `/api/admin/plans/${planId}`, change, adminToken)).status, 400);
  });
  await t.test('REQ 2: edit remains available with investors; deletion returns a clear conflict', async () => {
    assert.equal((await request('PUT', `/api/admin/investors/${fixture.id}`, { plan: input.name }, adminToken)).status, 200);
    assert.equal((await request('PUT', `/api/admin/plans/${planId}`, { name: input.name + ' revised', dailyReturnPercent: 2.75 }, adminToken)).status, 200);
    const blocked = await request('DELETE', `/api/admin/plans/${planId}`, undefined, adminToken);
    assert.equal(blocked.status, 409); assert.match(blocked.body.error, /assigned investors/);
    assert.equal((await getProfile(fixture.id))?.planTerms?.dailyReturnPercent, 0.5);
  });
  await t.test('REQ 9: registration date is not used; confirmed KYC date controls joining and maturity', async () => {
    await pool.query('UPDATE users SET created_at = ? WHERE id = ?', [addDays(today, -45) + ' 00:00:00', fixture.id]);
    const approved = addDays(today, -30);
    const updated = await request('PUT', `/api/admin/investors/${fixture.id}`, { kycStatus: 'Verified', accountStatus: 'Active', kycApprovedAt: approved + 'T00:00:00Z', totalInvestmentUsd: 10000, totalBtcAllocated: 0.02, currentPortfolioValueUsd: 2000 }, adminToken);
    assert.equal(updated.status, 200); assert.equal(updated.body.profile.joiningDate, approved); assert.equal(updated.body.profile.startDate, approved);
    const investor = await request('GET', '/api/investor/profile', undefined, investorToken);
    assert.equal(investor.status, 200); assert.equal(investor.body.profile.joiningDate, approved);
    assert.notEqual(investor.body.profile.joiningDate, addDays(today, -45));
  });
  await t.test('REQ 9: future KYC approval timestamps are rejected', async () => {
    const pending = await createFixture();
    const result = await request('PUT', `/api/admin/investors/${pending.id}`, { kycStatus: 'Verified', kycApprovedAt: addDays(today, 1) + 'T00:00:00Z' }, adminToken);
    assert.equal(result.status, 400);
    assert.equal((await getProfile(pending.id))?.joiningDate, null);
  });
  const profile = (await getProfile(fixture.id))!;
  const user = profileToUser(profile);
  const metrics = profileToMetrics(profile, 100000, 0);
  await t.test('profile contract section shows registration, KYC, joining, maturity and assigned plan', async () => {
    const [registered] = await pool.query<any[]>('SELECT created_at FROM users WHERE id = ?', [fixture.id]);
    assert.equal(profile.registrationDate, String(registered[0].created_at).slice(0, 10));
    assert.equal(profile.joiningDate, profile.kycApprovedAt!.slice(0, 10));
    const html = renderToStaticMarkup(<InvestorProfileTab user={user} onUpdateUser={async () => {}} />);
    const section = html.slice(html.indexOf('Contract &amp; Referral Hierarchy'));
    for (const value of ['Account Registration Date:', 'KYC Approval Date:', 'Start Date / Investment Joining Date:', 'Maturity / End Date:', profile.registrationDate!, profile.joiningDate!, profile.maturityDate, user.planTerms!.name, profile.agreementNumber]) assert.ok(section.includes(value), `Contract section missing ${value}`);
  });
  const wallet = () => renderToStaticMarkup(<WalletTab user={user} metrics={metrics} reservedPayoutBtc={0} transactions={[]} depositRequests={[]} withdrawalSettings={{ maxWithdrawalUsd: 1000, withdrawalsEnabled: true, updatedAt: '' }} onRequestPayoutOtp={async () => ({ok: true, message: 'test'})} onRequestPayout={async () => {}} onFetchDepositAddress={async () => ({ address: 'test', network: 'BTC' })} onSubmitDeposit={async () => ({referenceNumber: 'test'})} />);
  await t.test('REQ 6 and 11: rendered wallet includes assigned terms, all new fields, and both KYC/joining dates', () => {
    const html = wallet();
    for (const value of [input.name, 'Request USD Withdrawal', 'Daily interest is credited in USD', 'Daily Return', '0.5%', 'Allow Payout Request', '15 days', 'Minimum Threshold', '15%', 'Withdrawal / Entry Fee', '1.25%', 'KYC Approval Date', 'Joining Date / Start Date', profile.joiningDate!]) assert.ok(html.includes(value), `Wallet does not contain ${value}`);
    assert.ok(!html.includes('2.75%'), 'Catalog edits must not replace the saved 0.5% investor rate.');
  });
  await t.test('REQ 10: concurrent new investors receive unique consecutive FINOVA IDs and preserve UUID legacy keys', async () => {
    const start = users.length;
    const created = await Promise.all([0, 1].map(n => createUser({ username: `finova_test_audit_${stamp}_sequence_${n}`, password: 'AuditFixture123!', name: 'Disposable sequence audit', role: 'investor' })));
    users.push(...created.map(u => u.id));
    const profiles = await Promise.all(created.map(u => getProfile(u.id)));
    const numbers = profiles.map(p => Number(p!.investorId.replace('FINOVA', ''))).sort((a, b) => a - b);
    assert.equal(numbers[1] - numbers[0], 1);
    for (let n = 0; n < profiles.length; n++) { assert.equal(profiles[n]?.userId, created[n].id); assert.equal(profiles[n]?.legacyInvestorId, created[n].id); }
    assert.equal(users.length, start + 2);
  });
  await t.test('REQ 12: referral component renders the official joining date as Start Date', () => {
    const html = renderToStaticMarkup(<ReferralPartnerTab joiningDate={user.joiningDate} referralCode="TEST" referredUsers={[]} />);
    assert.match(html, /Start Date:/); assert.ok(html.includes(user.joiningDate!));
  });
  await t.test('REQ 4: INR conversion covers investment principal without modifying stored amounts or inventing a tariff', async () => {
    const before = (await getProfile(fixture.id))!;
    const html = renderToStaticMarkup(<CurrencyContext.Provider value={{ currency: 'INR', setCurrency: () => {}, rate: {rate: 90, fetchedAt: '', sourceDate: '', source: 'Test fixture', stale: false}, error: '', formatMoney: (value, digits) => formatDisplayMoney(value, 'INR', 90, digits) }}><InvestmentDetailsTab user={user} metrics={metrics} /></CurrencyContext.Provider>);
    assert.ok(!html.includes('$0.042'), 'The investment document still hardcodes $0.042 instead of converting this monetary display.');
    assert.ok(html.includes('₹9,00,000.00')); assert.doesNotMatch(html,/0\.042/);
    const after = (await getProfile(fixture.id))!;
    assert.equal(after.totalInvestmentUsd, before.totalInvestmentUsd); assert.equal(after.totalBtcAllocated, before.totalBtcAllocated);
  });
  await t.test('REQ 9: overview uses KYC joining date rather than a fixed registration-era date', () => {
    const html = renderToStaticMarkup(<InvestorDashboardTab user={user} metrics={metrics} withdrawalSettings={null} onNavigateTab={() => {}} />);
    assert.ok(!html.includes('Since Jan 2025'), 'The dashboard still shows Since Jan 2025 for this recently KYC-approved test investor.');
    assert.ok(html.includes(`Since ${user.joiningDate}`));
  });
  await t.test('daily dashboard return does not mislabel a missed-day catch-up total as a single-day return', () => {
    const html = renderToStaticMarkup(<InvestorDashboardTab user={user} metrics={{...metrics, miningRevenuePerDayUsd:800}} withdrawalSettings={null} onNavigateTab={() => {}} />);
    const card = html.slice(html.indexOf('Daily Plan Return (USD equivalent)'),html.indexOf('Network Difficulty'));
    assert.ok(card.includes('$50.00')); assert.ok(!card.includes('$800.00'));
  });
  await t.test('payout records use calculated eligibility rather than a fixed Friday/date or delivery claim', () => {
    const html = renderToStaticMarkup(<PayoutHistoryTab payouts={[]} nextWithdrawalDate="2026-11-05" />);
    assert.ok(html.includes('Next eligible request: 2026-11-05'));
    for(const obsolete of ['Automatic Friday Cycle','28 Aug 2026','100% Delivery Rate']) assert.ok(!html.includes(obsolete));
  });
  await t.test('REQ 12: referral hierarchy is reachable from the investor navigation', () => {
    const html = renderToStaticMarkup(<InvestorSidebar currentTab="overview" onSelectTab={() => {}} unreadNotificationsCount={0} openTicketsCount={0} hasActiveAllocation={true} />);
    assert.ok(html.includes('investor-tab-referrals'), 'Partner / Referrals is inside a hidden menu group; no alternative referral navigation exists in the navbar.');
  });
  await t.test('REQ 8: server enforces 7-, 30-, and 45-day eligibility boundaries', async () => {
    for (const gap of [5, 30, 45]) {
      const plan = await createPlan({ ...input, name: `${input.name} gap ${gap}`, dailyReturnPercent: 0, payoutRequestDays: gap }); plans.push(plan.id);
      const member = await createFixture();
      const effective = Math.max(7, gap);
      await updateProfile(member.id, { plan: plan.name, kycStatus: 'Verified', accountStatus: 'Active', kycApprovedAt: addDays(today, -(effective - 1)) + 'T00:00:00Z', totalInvestmentUsd: 100, totalBtcAllocated: 0.01 });
      const withdrawal = () => submitPayout({investorUserId: member.id, amountBtc: 0.00001, destinationWallet: 'audit-wallet', network: 'BTC'}, 100000);
      await assert.rejects(withdrawal(), /Next eligible withdrawal date/);
      await pool.query('UPDATE investor_profiles SET kyc_approved_at = ? WHERE user_id = ?', [addDays(today, -effective) + ' 00:00:00', member.id]);
      assert.ok(await withdrawal());
      await assert.rejects(withdrawal(), /Next eligible withdrawal date/);
    }
  });
  await t.test('REQ 13: midnight boundary simulation credits no same-day interest, then one full day, then recovers missed days exactly once', async () => {
    const plan = await createPlan({ ...input, name: `${input.name} interest` }); plans.push(plan.id);
    const member = await createFixture();
    await updateProfile(member.id, { plan: plan.name, kycStatus: 'Verified', accountStatus: 'Active', totalInvestmentUsd: 10000 });
    const market = async () => ({usd: 100000, change24hPercent: 0, difficultyT: 0, updatedAt: ''});
    const run = (day: string) => reconcileDailyInterest({investorUserId: member.id, getMarket: market, now: new Date(day + 'T00:00:00Z')});
    assert.equal(await run(today), 0);
    assert.equal(await run(addDays(today, 1)), 1);
    assert.equal(await run(addDays(today, 1)), 0);
    assert.equal(await run(addDays(today, 4)), 3);
    assert.equal((await getProfile(member.id))?.totalBtcAllocated, 0);
    assert.equal((await getProfile(member.id))?.usdWalletBalance, 200);
    const [rows] = await pool.query<any[]>('SELECT SUM(amount_usd) AS usd, COUNT(*) AS credits FROM daily_interest_credits WHERE investor_user_id = ?', [member.id]);
    assert.equal(Number(rows[0].usd), 200); assert.equal(rows[0].credits, 4);
  });
  await t.test('REQ 13: actual server timer detects midnight and automatically credits an investor without any login', async ctx => {
    assert.ok(['UTC','Asia/Kolkata'].includes(platformTimezone));
    const plan = await createPlan({ ...input, name: `${input.name} timer` }); plans.push(plan.id);
    const member = await createFixture();
    await updateProfile(member.id, {plan: plan.name, kycStatus: 'Verified', accountStatus: 'Active', totalInvestmentUsd: 10000});
    const originalFetch = globalThis.fetch;
    let quoteRequests = 0;
    ctx.mock.timers.enable({apis: ['Date', 'setInterval'], now: Date.parse(today + (platformTimezone === 'Asia/Kolkata' ? 'T18:29:59Z' : 'T23:59:59Z'))});
    globalThis.fetch = async (url, options) => {
      if (String(url).includes('api.coingecko.com')) { quoteRequests++; throw new Error('USD interest must not request a BTC price'); }
      if (String(url).includes('blockchain.info')) return new Response('1000000000000');
      return originalFetch(url, options);
    };
    const count = async () => { const [r] = await pool.query<any[]>('SELECT COUNT(*) AS n FROM daily_interest_credits WHERE investor_user_id = ?', [member.id]); return Number(r[0].n); };
    try {
      startInterestScheduler({investorUserId:member.id});
      await new Promise(resolve => setTimeout(resolve, 75));
      assert.equal(await count(), 0, 'No credit before midnight.');
      ctx.mock.timers.tick(1000);
      for (let attempt = 0; attempt < 100 && await count() === 0; attempt++) await new Promise(resolve => setTimeout(resolve, 10));
      assert.equal(await count(), 1, 'The timer must create the credit at the midnight boundary.');
      assert.equal((await getProfile(member.id))?.totalBtcAllocated, 0);
      assert.equal((await getProfile(member.id))?.usdWalletBalance, 50);
      ctx.mock.timers.tick(60_000);
      await new Promise(resolve => setTimeout(resolve, 75));
      assert.equal(await count(), 1, 'The retry timer must not duplicate the day.');
      assert.equal(quoteRequests,0);
    } finally { globalThis.fetch = originalFetch; ctx.mock.timers.reset(); }
  });
  await t.test('USD payout HTTP API records dollars and admin approval never changes BTC balances', async () => {
    await pool.query('UPDATE investor_profiles SET usd_wallet_balance = 2000 WHERE user_id = ?', [fixture.id]);
    const beforeBtc = (await getProfile(fixture.id))!.totalBtcAllocated;
    const code = await createOtpForUser(fixture.id, 'withdrawal');
    const result = await request('POST', '/api/investor/payouts', {currency: 'USD', amountUsd: 100, destinationWallet: 'Disposable audit bank account', otp: code}, investorToken);
    assert.equal(result.status, 201, result.body.error);
    assert.equal(result.body.payout.currency, 'USD'); assert.equal(result.body.payout.amountUsd, 100); assert.equal(result.body.payout.amountBtc, 0);
    const settled = await request('PATCH', `/api/admin/payouts/${result.body.payout.id}`, {status: 'Completed', notes: 'USD audit settlement'}, adminToken);
    assert.equal(settled.status, 200, settled.body.error);
    const after = (await getProfile(fixture.id))!;
    assert.equal(after.usdWalletBalance, 1900); assert.equal(after.totalBtcAllocated, beforeBtc);
    const repeated = await request('PATCH', `/api/admin/payouts/${result.body.payout.id}`, {status: 'Completed'}, adminToken);
    assert.equal(repeated.status, 200); assert.equal((await getProfile(fixture.id))!.usdWalletBalance, 1900);
  });
});
