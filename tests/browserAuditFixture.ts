import 'dotenv/config';
import fs from 'node:fs';
import { pool } from '../server/database';
import { createUser } from '../server/db';
import { updateProfile, getProfile } from '../server/investors';
import { addDays, platformDay } from '../server/planPolicy';

// Local disposable browser fixture. No mail is sent and no existing investor is edited.
const username = 'finova_test_browser_20261021';
const path = 'docs/qa-browser-fixture.json';
const [existing] = await pool.query<any[]>('SELECT id FROM users WHERE username = ?', [username]);
if (!existing.length) {
  const [baseline] = await pool.query<any[]>('SELECT user_id, total_investment_usd, total_btc_allocated, usd_wallet_balance, kyc_approved_at, plan_terms FROM investor_profiles ORDER BY user_id');
  fs.writeFileSync('docs/qa-existing-investors-baseline.json', JSON.stringify(baseline, null, 2));
  const user = await createUser({username, password: 'BrowserAudit123!', name: 'QA Browser Full Audit', role: 'investor'});
  await updateProfile(user.id, {plan: 'QA Full Audit 20261021', payoutBtcAddress: 'bc1q000000000000000000000000000000000000000', payoutNetwork: 'BTC'});
  fs.writeFileSync(path, JSON.stringify({userId:user.id, username, purpose:'Disposable local browser acceptance fixture; no real funds or email'}, null, 2));
}
const [rows] = await pool.query<any[]>('SELECT id FROM users WHERE username = ?', [username]);
if (process.argv.includes('--clean-clock-credit')) {
  const conn=await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [credits]=await conn.query<any[]>('SELECT id,amount_btc,amount_usd FROM daily_interest_credits WHERE investor_user_id=? AND eligible_day=? AND btc_price_usd=100000 FOR UPDATE',[rows[0].id,platformDay()]);
    for(const credit of credits){
      await conn.query('DELETE FROM wallet_transactions WHERE id=? AND investor_user_id=?',[credit.id,rows[0].id]);
      await conn.query('DELETE FROM daily_interest_credits WHERE id=? AND investor_user_id=?',[credit.id,rows[0].id]);
      await conn.query('UPDATE investor_profiles SET total_btc_allocated=total_btc_allocated-?,btc_mined=btc_mined-?,current_portfolio_value_usd=current_portfolio_value_usd-? WHERE user_id=?',[credit.amount_btc,credit.amount_btc,credit.amount_usd,rows[0].id]);
    }
    await conn.commit();console.log('Removed controlled-clock credits from browser fixture:',credits.length);
  }catch(error){await conn.rollback();throw error;}finally{conn.release();}
}
if (process.argv.includes('--seasoned')) {
  // Controlled historical dates ONLY for the named disposable fixture, never a real KYC record.
  const day = addDays(platformDay(), -16);
  await pool.query('UPDATE investor_profiles SET kyc_approved_at=?, next_withdrawal_date=NULL WHERE user_id=?', [day+' 00:00:00',rows[0].id]);
  await pool.query('UPDATE investment_capital_history SET effective_day=? WHERE investor_user_id=?', [day,rows[0].id]);
}
const p = await getProfile(rows[0].id);
console.log(JSON.stringify({username, investorId:p?.investorId, agreementNumber:p?.agreementNumber, kycStatus:p?.kycStatus, plan:p?.plan}));
await pool.end();
