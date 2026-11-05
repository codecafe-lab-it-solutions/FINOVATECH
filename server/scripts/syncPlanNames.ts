import 'dotenv/config';
import { pool } from '../database';
import { initSchema } from '../database';
import { initFinancialSchema } from '../financialSchema';

// Repairs profiles whose stored plan name drifted from the catalog, which happens to any
// investor whose plan was renamed before updatePlan propagated the name. Until it is fixed,
// saving that profile trips the "existing funded investment cannot be reassigned" guard.
// Run without arguments to preview; pass --apply to write.
async function main() {
  const apply = process.argv.includes('--apply');
  await initSchema();
  await initFinancialSchema();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [drifted] = await conn.query<any[]>(
      `SELECT p.user_id, u.name AS investor, p.plan AS profile_name, pl.name AS catalog,
              JSON_UNQUOTE(JSON_EXTRACT(p.plan_terms, '$.name')) AS terms_name
         FROM investor_profiles p
         JOIN investment_plans pl ON pl.id = p.plan_id
         LEFT JOIN users u ON u.id = p.user_id
        WHERE p.plan <> pl.name
           OR (p.plan_terms IS NOT NULL AND JSON_UNQUOTE(JSON_EXTRACT(p.plan_terms, '$.name')) <> pl.name)
        FOR UPDATE`
    );
    // A profile with no plan_id link cannot be repaired automatically: there is no catalog row
    // to copy the name from. These are reported so they can be assigned a plan by hand.
    const [unlinked] = await conn.query<any[]>(
      `SELECT p.user_id, u.name AS investor, p.plan AS profile_name, p.total_investment_usd
         FROM investor_profiles p LEFT JOIN users u ON u.id = p.user_id
        WHERE p.plan_id IS NULL AND p.plan <> 'No active investment plan'`
    );
    if (unlinked.length) {
      console.log(`${unlinked.length} profile(s) carry a plan name but no catalog link:`);
      for (const row of unlinked) {
        console.log(`  ${row.investor ?? row.user_id}: plan "${row.profile_name}", invested ${row.total_investment_usd} — assign a plan in the admin panel`);
      }
    }
    if (!drifted.length) {
      console.log('No profiles are out of sync with the plan catalog.');
    } else {
      console.log(`${drifted.length} profile(s) out of sync with the catalog:`);
      for (const row of drifted) {
        console.log(`  ${row.investor ?? row.user_id}: profile "${row.profile_name}" / terms "${row.terms_name}" -> catalog "${row.catalog}"`);
      }
      if (apply) {
        await conn.query('UPDATE investor_profiles p JOIN investment_plans pl ON pl.id = p.plan_id SET p.plan = pl.name WHERE p.plan <> pl.name');
        await conn.query(
          `UPDATE investor_profiles p JOIN investment_plans pl ON pl.id = p.plan_id
              SET p.plan_terms = JSON_SET(p.plan_terms, '$.name', pl.name)
            WHERE p.plan_terms IS NOT NULL AND JSON_UNQUOTE(JSON_EXTRACT(p.plan_terms, '$.name')) <> pl.name`
        );
        await conn.query(
          `UPDATE referral_commissions rc
             JOIN investor_profiles p ON p.user_id = rc.referred_user_id
             JOIN investment_plans pl ON pl.id = p.plan_id
              SET rc.plan_name = pl.name
            WHERE rc.plan_name <> pl.name`
        );
      }
    }
    if (apply) { await conn.commit(); console.log('Applied. Plan names are back in sync; IDs and financial figures were not touched.'); }
    else { await conn.rollback(); console.log('Preview only. Nothing was written. Re-run with --apply to fix.'); }
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); await pool.end(); }
}

main().catch(err => { console.error(err); process.exit(1); });
