import 'dotenv/config';
import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { pool, initSchema } from '../server/database';
import { initFinancialSchema } from '../server/financialSchema';
import { createPlan } from '../server/adminData';
import { createUser } from '../server/db';
import { getProfile, updateProfile, addTransaction } from '../server/investors';
import { reconcileDailyInterest, submitUsdPayout, settlePayout } from '../server/financialEngine';
import { addDays, platformDay } from '../server/planPolicy';
import { getLevelIncomeSettings, saveLevelIncomeSettings, getRewardProgress } from '../server/levelIncome';

// Needs the API running on localhost:8787 (same as the other integration tests).
const tag = crypto.randomUUID().slice(0, 8);
const PASSWORD = 'ClientReq123!';
const PIN = process.env.WALLET_TEST_PIN ?? '';
const users: string[] = [];
const plans: string[] = [];
let originalLevels: number[] = [];
let previousActiveAddress: string | null = null;
let createdAddressIds: string[] = [];

const api = async (method: string, path: string, body?: unknown, token?: string) => {
  const response = await fetch('http://localhost:8787' + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await response.text();
  let parsed: any = {};
  try { parsed = JSON.parse(text); } catch { /* non-JSON body */ }
  return { status: response.status, body: parsed };
};
const login = (username: string, password = PASSWORD) => api('POST', '/api/auth/login', { username, password });
const src = (path: string) => fs.readFileSync(path, 'utf8');
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

after(async () => {
  if (originalLevels.length) await saveLevelIncomeSettings(originalLevels);
  for (const id of createdAddressIds) await pool.query('DELETE FROM deposit_addresses WHERE id = ?', [id]);
  if (previousActiveAddress) await pool.query('UPDATE deposit_addresses SET is_active = TRUE WHERE id = ?', [previousActiveAddress]);
  for (const id of users.reverse()) await pool.query('DELETE FROM users WHERE id = ?', [id]);
  await pool.query("DELETE FROM users WHERE username LIKE ?", [`clientreg_${tag}%`]);
  await pool.query("DELETE FROM activity_logs WHERE actor_name LIKE ? OR details LIKE ?", [`%${tag}%`, `%${tag}%`]);
  for (const id of plans) await pool.query('DELETE FROM investment_plans WHERE id = ?', [id]);
  await pool.end();
});

test('client requirements: access control, activity log, security PIN, fees, level income and rewards', async (t) => {
  await initSchema(); await initFinancialSchema();
  originalLevels = (await getLevelIncomeSettings()).map((l) => l.percent);
  const admin = await login('Admin', 'Admin');
  assert.equal(admin.status, 200);
  const adminToken = admin.body.token as string;
  const plan = await createPlan({ name: `ClientReq ${tag}`, tagline: '', minInvestmentUsd: 100, maxInvestmentUsd: 1000000, durationMonths: 12, managementFeePercent: 0, dailyReturnPercent: 1, payoutRequestDays: 7, minimumThresholdPercent: 0, withdrawalEntryFeePercent: 10, payoutFrequency: 'Monthly', status: 'Active' });
  plans.push(plan.id);
  const makeInvestor = async (name: string, sponsorCode: string | undefined, investmentUsd: number) => {
    const user = await createUser({ username: `clientreq_${tag}_${name}`, password: PASSWORD, name: `ClientReq ${name}`, role: 'investor', referredByCode: sponsorCode });
    users.push(user.id);
    await updateProfile(user.id, { plan: plan.name, totalInvestmentUsd: investmentUsd, kycStatus: 'Verified', accountStatus: 'Active' });
    return { user, profile: (await getProfile(user.id))! };
  };

  await t.test('forgot-password is removed from the API and the login screen', async () => {
    for (const route of ['forgot-password', 'reset-password']) {
      const response = await fetch('http://localhost:8787/api/auth/' + route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'a@b.co' }) });
      assert.equal(response.status, 404, route + ' must not exist');
    }
    assert.doesNotMatch(src('src/components/LoginScreen.tsx'), /forgot/i);
  });

  await t.test('website shows no map coordinates and the roles/demo-role switch is gone', () => {
    for (const file of ['src/components/Hero.tsx', 'src/components/OmanMuscatSection.tsx', 'src/data/companyData.ts']) {
      assert.doesNotMatch(src(file), /23\.5880|58\.3829|coordinates:/, file);
    }
    assert.doesNotMatch(src('src/components/admin/AdminSidebar.tsx'), /users-roles/);
    assert.doesNotMatch(src('src/components/admin/AdminHeader.tsx'), /Switch Admin Role/);
    assert.equal(fs.existsSync('src/components/admin/AdminRolesView.tsx'), false);
  });

  await t.test('copy buttons copy the real address, never a hard-coded one', () => {
    for (const file of ['src/components/admin/AdminPayoutsView.tsx', 'src/components/investor/WalletTab.tsx']) {
      assert.doesNotMatch(src(file), /0xc5ae4fc7de62952f7f613c28b117ac6443ddcb2e|FIXED_COPY_ADDRESS/, file);
    }
    assert.match(src('src/components/admin/AdminPayoutsView.tsx'), /writeText\(address\)/);
    assert.match(src('src/components/investor/WalletTab.tsx'), /writeText\(depositAddressInfo\.address\)/);
  });

  const primary = await makeInvestor('block', undefined, 0);

  await t.test('admin can block and unblock an investor login; blocking ends open sessions', async () => {
    const first = await login(primary.user.username);
    assert.equal(first.status, 200);
    const oldToken = first.body.token as string;
    assert.equal((await api('PUT', `/api/admin/investors/${primary.user.id}/login-block`, { blocked: true }, oldToken)).status, 403, 'investors cannot block');
    assert.equal((await api('PUT', `/api/admin/investors/${primary.user.id}/login-block`, { blocked: 'yes' }, adminToken)).status, 400);
    assert.equal((await api('PUT', `/api/admin/investors/${primary.user.id}/login-block`, { blocked: true }, adminToken)).status, 200);
    assert.equal((await api('GET', '/api/investor/profile', undefined, oldToken)).status, 401, 'open session is revoked');
    const blocked = await login(primary.user.username);
    assert.equal(blocked.status, 403);
    assert.match(blocked.body.error, /blocked/i);
    assert.equal((await login(primary.user.username, 'WrongPassword!')).status, 401, 'wrong password still reads as invalid');
    const listed = (await api('GET', '/api/admin/investors', undefined, adminToken)).body.investors.find((i: any) => i.userId === primary.user.id);
    assert.equal(listed.loginBlocked, true);
    assert.equal((await api('PUT', `/api/admin/investors/${primary.user.id}/login-block`, { blocked: false }, adminToken)).status, 200);
    assert.equal((await login(primary.user.username)).status, 200);
    const adminId = (await pool.query<any[]>("SELECT id FROM users WHERE username = 'Admin'"))[0][0].id;
    assert.equal((await api('PUT', `/api/admin/investors/${adminId}/login-block`, { blocked: true }, adminToken)).status, 404, 'admin accounts can never be blocked');
  });

  await t.test('access/activity log records logins, failures, blocks and admin changes without secrets', async () => {
    await sleep(500);
    const logs = (await api('GET', '/api/admin/activity-logs?limit=500', undefined, adminToken)).body.logs as any[];
    const mine = logs.filter((l) => String(l.details).includes(primary.user.username) || l.targetId === primary.user.id || l.actorName === primary.user.name);
    assert.ok(mine.some((l) => l.action === 'Login' && l.status === 'Success'), 'successful login logged');
    assert.ok(mine.some((l) => l.action === 'Login failed' && l.status === 'Failed'), 'failed login logged');
    assert.ok(mine.some((l) => l.action === 'Login blocked' && l.status === 'Blocked'), 'blocked login attempt logged');
    const change = mine.find((l) => l.targetId === primary.user.id && /login-block/.test(l.action) && l.actorRole === 'admin' && l.status === 'Success');
    assert.ok(change, 'admin block change logged');
    assert.equal(change.actorRole, 'admin');
    assert.ok(change.ipAddress);
    assert.ok(!JSON.stringify(logs).includes(PASSWORD), 'passwords are never stored in the log');
    assert.equal((await api('GET', '/api/admin/activity-logs')).status, 401);
    assert.equal((await api('GET', '/api/admin/activity-logs', undefined, (await login(primary.user.username)).body.token)).status, 403);
  });

  await t.test('one email can only belong to one investor account', async () => {
    const email = `clientreg_${tag}@example.invalid`;
    const registration = (username: string) => api('POST', '/api/auth/register', { username, password: PASSWORD, name: 'Dup Test', email });
    assert.equal((await registration(`clientreg_${tag}_a`)).status, 201);
    const second = await registration(`clientreg_${tag}_b`);
    assert.equal(second.status, 409);
    assert.match(second.body.error, /already exists/i);
    assert.equal((await registration(`clientreg_${tag}_a`)).status, 409);
  });

  await t.test('changing a deposit address needs the security PIN', async () => {
    const [active] = await pool.query<any[]>('SELECT id FROM deposit_addresses WHERE is_active = TRUE LIMIT 1');
    previousActiveAddress = active[0]?.id ?? null;
    const body = { address: `TQA${tag}address`, network: 'TRC20', visibility: 'All' };
    assert.equal((await api('POST', '/api/admin/deposit-addresses', body, adminToken)).status, 403);
    assert.equal((await api('POST', '/api/admin/deposit-addresses', { ...body, pin: 'wrong' }, adminToken)).status, 403);
    const created = await api('POST', '/api/admin/deposit-addresses', { ...body, pin: PIN }, adminToken);
    assert.equal(created.status, 201);
    createdAddressIds.push(created.body.address.id);
    const shown = await api('GET', '/api/investor/deposit-address', undefined, (await login(primary.user.username)).body.token);
    assert.equal(shown.body.address.address, body.address, 'investors are shown the configured deposit address');
    assert.ok(src('src/components/admin/AdminDepositsView.tsx').includes('Security PIN'));
  });

  await t.test('wallet PIN locks after repeated wrong attempts', async () => {
    // A throwaway admin, so the real admin is not locked out for the next 15 minutes.
    const tempAdmin = await createUser({ username: `clientreq_${tag}_admin`, password: PASSWORD, name: 'ClientReq temp admin', role: 'admin' });
    users.push(tempAdmin.id);
    const tempToken = (await login(tempAdmin.username)).body.token as string;
    const results: number[] = [];
    for (let i = 0; i < 6; i++) results.push((await api('POST', '/api/admin/wallets', { walletName: 'lock test', pin: 'bad' + i }, tempToken)).status);
    assert.ok(results.every((status) => status === 403));
    // even the right PIN is refused while locked
    assert.equal((await api('POST', '/api/admin/wallets', { walletName: 'lock test', pin: PIN }, tempToken)).status, 403);
  });

  await t.test('plan withdrawal fee is cut from each withdrawal request and the full amount leaves the wallet', async () => {
    const investor = await makeInvestor('fee', undefined, 0);
    await addTransaction({ investorUserId: investor.user.id, type: 'Adjustment', amountUsd: 1000, amountBtc: 0, network: 'USD', applyToWallet: true });
    const payoutId = await submitUsdPayout({ investorUserId: investor.user.id, amountUsd: 100, destination: 'bank acct 123456' });
    const token = (await login(investor.user.username)).body.token;
    const payout = (await api('GET', '/api/investor/payouts', undefined, token)).body.payouts.find((p: any) => p.id === payoutId);
    assert.equal(payout.feePercent, 10);
    assert.equal(payout.feeUsd, 10);
    assert.equal(payout.netUsd, 90);
    assert.equal(payout.amountUsd, 100);
    await settlePayout(payoutId, 'Completed', 'paid');
    assert.equal((await getProfile(investor.user.id))!.usdWalletBalance, 900, 'the full requested amount is debited');
    // A 100% fee would pay nothing: the request is refused and the balance stays untouched.
    await pool.query("UPDATE investor_profiles SET plan_terms = JSON_SET(plan_terms, '$.withdrawalEntryFeePercent', 100) WHERE user_id = ?", [investor.user.id]);
    await assert.rejects(submitUsdPayout({ investorUserId: investor.user.id, amountUsd: 50, destination: 'bank acct 123456' }), /leaves nothing to pay/);
    assert.equal((await getProfile(investor.user.id))!.usdWalletBalance, 900);
  });

  const chain: Record<string, { user: { id: string; username: string }; profile: { referralCode: string } }> = {};
  await t.test('level income pays the upline a share of ROI and honours the referral conditions', async () => {
    await saveLevelIncomeSettings([10, 5, 2, 0, 0, 0, 0, 0, 0, 0]);
    chain.a = await makeInvestor('a', undefined, 1000);
    chain.b = await makeInvestor('b', chain.a.profile.referralCode, 1000);
    chain.c = await makeInvestor('c', chain.b.profile.referralCode, 1000);
    chain.d = await makeInvestor('d', chain.c.profile.referralCode, 1000);
    const day = platformDay();
    const dayCount = async () => Number((await pool.query<any[]>('SELECT COUNT(*) AS n FROM daily_interest_credits WHERE investor_user_id = ?', [chain.d.user.id]))[0][0].n);
    const byReceiver = async (receiverId: string) => (await pool.query<any[]>('SELECT level_no, amount_usd FROM level_income_credits WHERE source_user_id = ? AND receiver_user_id = ?', [chain.d.user.id, receiverId]))[0];
    await reconcileDailyInterest({ investorUserId: chain.d.user.id, now: new Date(addDays(day, 1) + 'T12:00:00Z') });
    const firstDays = await dayCount();
    assert.ok(firstDays >= 1);
    const cRows = await byReceiver(chain.c.user.id), bRows = await byReceiver(chain.b.user.id);
    assert.equal(cRows.length, firstDays); assert.ok(cRows.every((r) => r.level_no === 1 && Number(r.amount_usd) === 1), 'level 1 = 10% of 10.00');
    assert.equal(bRows.length, firstDays); assert.ok(bRows.every((r) => r.level_no === 2 && Number(r.amount_usd) === 0.5), 'level 2 = 5% of 10.00');
    assert.equal((await byReceiver(chain.a.user.id)).length, 0, 'A (level 3) is locked: only one qualified direct referral');
    const [bTx] = await pool.query<any[]>("SELECT COUNT(*) AS n FROM wallet_transactions WHERE investor_user_id = ? AND type = 'Level Income' AND amount_usd = 0.5", [chain.b.user.id]);
    assert.equal(Number(bTx[0].n), firstDays);
    // A gets a second qualified direct referral ($500+) -> level 3 unlocks for ROI credited from now on
    await makeInvestor('e', chain.a.profile.referralCode, 500);
    await reconcileDailyInterest({ investorUserId: chain.d.user.id, now: new Date(addDays(day, 3) + 'T12:00:00Z') });
    const totalDays = await dayCount();
    const newDays = totalDays - firstDays;
    assert.ok(newDays >= 1);
    const aRows = await byReceiver(chain.a.user.id);
    assert.equal(aRows.length, newDays, 'only days credited after unlock pay level 3');
    assert.ok(aRows.every((r) => r.level_no === 3 && Number(r.amount_usd) === 0.2), 'level 3 = 2% of 10.00');
    assert.equal((await byReceiver(chain.c.user.id)).length, totalDays);
    // running the same days again cannot pay twice
    await reconcileDailyInterest({ investorUserId: chain.d.user.id, now: new Date(addDays(day, 3) + 'T12:00:00Z') });
    assert.equal(await dayCount(), totalDays);
    assert.equal((await byReceiver(chain.a.user.id)).length, newDays);
    assert.equal((await byReceiver(chain.c.user.id)).length, totalDays);
  });

  await t.test('level percentages are admin-editable and validated', async () => {
    assert.equal((await api('PUT', '/api/admin/level-income-settings', { percents: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, (await login(chain.a.user.username)).body.token)).status, 403);
    assert.equal((await api('PUT', '/api/admin/level-income-settings', { percents: [1, 2] }, adminToken)).status, 400);
    assert.equal((await api('PUT', '/api/admin/level-income-settings', { percents: [101, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, adminToken)).status, 400);
    const saved = await api('PUT', '/api/admin/level-income-settings', { percents: [1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, adminToken);
    assert.equal(saved.status, 200);
    assert.equal((await api('GET', '/api/admin/level-income-settings', undefined, adminToken)).body.levels[0].percent, 1.5);
    const summary = await api('GET', '/api/investor/level-income', undefined, (await login(chain.a.user.username)).body.token);
    assert.equal(summary.status, 200);
    assert.equal(summary.body.summary.levels.length, 10);
    assert.equal(summary.body.summary.qualifiedReferrals, 2);
    assert.equal(summary.body.summary.levels[2].unlocked, true);
    assert.equal(summary.body.summary.levels[5].unlocked, false, 'levels 6-10 need 4 qualified referrals');
  });

  await t.test('reward unlocks when team business in the level range reaches the target and admin can grant it', async () => {
    const before = (await getRewardProgress(chain.a.user.id)).find((r) => r.key === 'R1')!;
    assert.equal(before.achieved, false);
    await updateProfile(chain.b.user.id, { totalInvestmentUsd: 10000 });
    const reward = (await getRewardProgress(chain.a.user.id)).find((r) => r.key === 'R1')!;
    assert.equal(reward.reward, 'Thailand Trip');
    assert.equal(reward.businessUsd, 10500, 'level 1 business = B 10000 + E 500');
    assert.equal(reward.achieved, true);
    assert.equal((await getRewardProgress(chain.a.user.id)).find((r) => r.key === 'R2')!.achieved, false);
    const list = await api('GET', '/api/admin/rewards', undefined, adminToken);
    const grant = list.body.rewards.find((r: any) => r.userId === chain.a.user.id && r.tierKey === 'R1');
    assert.equal(grant.status, 'Pending');
    assert.equal((await api('PATCH', '/api/admin/rewards/' + grant.id, { status: 'Granted' }, (await login(chain.a.user.username)).body.token)).status, 403);
    assert.equal((await api('PATCH', '/api/admin/rewards/' + grant.id, { status: 'Granted', note: 'ticket sent' }, adminToken)).status, 200);
    const seen = await api('GET', '/api/investor/level-income', undefined, (await login(chain.a.user.username)).body.token);
    assert.equal(seen.body.rewards.find((r: any) => r.key === 'R1').status, 'Granted');
  });
});
