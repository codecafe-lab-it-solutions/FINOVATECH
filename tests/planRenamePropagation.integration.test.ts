import 'dotenv/config';
import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import crypto from 'node:crypto';
import { pool, initSchema } from '../server/database';
import { initFinancialSchema } from '../server/financialSchema';
import { createPlan, listPlans, updatePlan } from '../server/adminData';
import { createUser } from '../server/db';
import { getProfile, updateProfile } from '../server/investors';

const stamp = crypto.randomUUID().slice(0, 8), users: string[] = [], plans: string[] = [];
const terms = { tagline: '', minInvestmentUsd: 500, maxInvestmentUsd: 10000, durationMonths: 24, managementFeePercent: 10, dailyReturnPercent: .13, payoutRequestDays: 7, minimumThresholdPercent: 0, withdrawalEntryFeePercent: 10, payoutFrequency: 'Weekly' as const, status: 'Active' as const };

after(async () => {
  for (const id of users) await pool.query('DELETE FROM users WHERE id=? AND username LIKE ?', [id, `rename_${stamp}%`]);
  for (const id of plans) await pool.query('DELETE FROM investment_plans WHERE id=?', [id]);
  await pool.end();
});

test('renaming a plan from the admin panel propagates to every name location and leaves funded profiles saveable', async () => {
  await initSchema(); await initFinancialSchema();
  const from = `Admin rename ${stamp}`, to = `Admin renamed ${stamp}`;
  const plan = await createPlan({ ...terms, name: from }); plans.push(plan.id);
  const user = await createUser({ username: `rename_${stamp}_panel`, name: 'Disposable panel rename', password: 'RenameFixture123!', role: 'investor' }); users.push(user.id);
  await updateProfile(user.id, { plan: from, kycStatus: 'Verified', accountStatus: 'Active', totalInvestmentUsd: 5000 });
  const before = (await getProfile(user.id))!;
  const sponsor = await createUser({ username: `rename_${stamp}_sponsor`, name: 'Disposable panel sponsor', password: 'RenameFixture123!', role: 'investor' }); users.push(sponsor.id);
  const commission = crypto.randomUUID();
  await pool.query(
    'INSERT INTO referral_commissions (id,referrer_user_id,referred_user_id,investment_id,referral_code,plan_name,principal_usd,rate_percent,amount_usd,created_at) VALUES (?,?,?,?,?,?,5000,5,250,UTC_TIMESTAMP())',
    [commission, sponsor.id, user.id, before.investmentId, 'DEMO-PANEL', from]
  );

  await updatePlan(plan.id, { name: to });

  const after = (await getProfile(user.id))!;
  assert.equal((await listPlans()).find(p => p.id === plan.id)?.name, to, 'catalog renamed');
  assert.equal(after.plan, to, 'investor profile text copy follows the rename');
  assert.equal(after.planTerms?.name, to, 'frozen terms snapshot follows the rename');
  const [rows] = await pool.query<any[]>('SELECT plan_name FROM referral_commissions WHERE id=?', [commission]);
  assert.equal(rows[0].plan_name, to, 'historical commission label follows the rename');
  // Financial figures and identifiers are untouched by a rename.
  assert.equal(after.planId, before.planId);
  assert.equal(after.investmentId, before.investmentId);
  assert.equal(after.totalInvestmentUsd, before.totalInvestmentUsd);
  assert.deepEqual({ ...after.planTerms, name: from }, before.planTerms);
  // A funded profile can now be saved, and reassigned, without the old guard firing.
  const saved = await updateProfile(user.id, { plan: to, totalInvestmentUsd: 5000 });
  assert.equal(saved.plan, to);
});
