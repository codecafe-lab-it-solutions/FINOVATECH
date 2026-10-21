import { pool } from './database';

export async function initFinancialSchema(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    const [lock] = await conn.query<any[]>("SELECT GET_LOCK('finova_financial_schema_v1', 30) AS acquired");
    if (!lock[0].acquired) throw new Error('Could not lock financial schema migration');
    const columns = [
      ['investment_plans', 'direct_referral_percent', 'DECIMAL(7,4) NOT NULL DEFAULT 5'],
      ['investment_plans', 'daily_return_percent', 'DECIMAL(9,5) NOT NULL DEFAULT 0'],
      ['investment_plans', 'payout_request_days', 'INT NOT NULL DEFAULT 7'],
      ['investment_plans', 'minimum_threshold_percent', 'DECIMAL(9,5) NOT NULL DEFAULT 0'],
      ['investment_plans', 'withdrawal_entry_fee_percent', 'DECIMAL(9,5) NOT NULL DEFAULT 0'],
      ['investor_profiles', 'plan_id', 'CHAR(36) NULL'],
      ['investor_profiles', 'plan_terms', 'JSON NULL'],
      ['investor_profiles', 'investment_id', 'CHAR(36) NULL'],
      ['investor_profiles', 'kyc_approved_at', 'DATETIME NULL'],
      ['investor_profiles', 'legacy_investor_id', 'VARCHAR(100) NULL'],
      ['password_reset_otps', 'purpose', "VARCHAR(20) NOT NULL DEFAULT 'password-reset'"],
      ['password_reset_otps', 'attempts', 'INT NOT NULL DEFAULT 0'],
      ['payouts', 'investment_id', 'CHAR(36) NULL'],
      ['payouts', 'amount_usd', 'DECIMAL(18,2) NULL'],
      ['payouts', 'currency', "VARCHAR(3) NOT NULL DEFAULT 'BTC'"],
      ['investor_profiles', 'usd_wallet_balance', 'DECIMAL(18,2) NOT NULL DEFAULT 0']
    ];
    for (const [table, name, type] of columns) {
      const [existing] = await conn.query<any[]>('SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?', [table, name]);
      if (!existing.length) await conn.query(`ALTER TABLE ${table} ADD COLUMN ${name} ${type}`);
    }
    await conn.query(`CREATE TABLE IF NOT EXISTS referral_commissions (
      id CHAR(36) PRIMARY KEY, referrer_user_id CHAR(36) NOT NULL, referred_user_id CHAR(36) NOT NULL,
      investment_id CHAR(36) NOT NULL, referral_code VARCHAR(60) NOT NULL, plan_name VARCHAR(150) NOT NULL,
      principal_usd DECIMAL(18,2) NOT NULL, rate_percent DECIMAL(7,4) NOT NULL,
      amount_usd DECIMAL(18,2) NOT NULL, created_at DATETIME NOT NULL,
      UNIQUE KEY uniq_referral_investment (referred_user_id, investment_id),
      FOREIGN KEY (referrer_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);
    await conn.query("UPDATE investor_profiles SET referral_code = CONCAT('FINO-', REPLACE(user_id, '-', '')) WHERE referral_code = '' OR referral_code IS NULL");
    await conn.query(`CREATE TABLE IF NOT EXISTS investor_identifiers (
      sequence BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id CHAR(36) NOT NULL UNIQUE,
      CONSTRAINT fk_identifier_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=786`);
    await conn.query(`INSERT INTO investor_identifiers (user_id)
      SELECT id FROM users u WHERE role = 'investor' AND NOT EXISTS (SELECT 1 FROM investor_identifiers ids WHERE ids.user_id = u.id) ORDER BY created_at, id`);
    await conn.query('UPDATE investor_profiles SET legacy_investor_id = user_id WHERE legacy_investor_id IS NULL');
    // Contract identifiers retain the original unique investor UUID, independently of FINOVA IDs.
    await conn.query('UPDATE investor_profiles SET agreement_number = legacy_investor_id WHERE agreement_number <> legacy_investor_id');
    await conn.query('UPDATE investor_profiles SET investment_id = UUID() WHERE investment_id IS NULL');
    // Only unambiguous exact-name matches can be migrated automatically.
    await conn.query(`UPDATE investor_profiles p JOIN investment_plans pl ON pl.name = p.plan
      JOIN (SELECT name FROM investment_plans GROUP BY name HAVING COUNT(*) = 1) unique_names ON unique_names.name = pl.name
      SET p.plan_id = pl.id, p.plan_terms = JSON_OBJECT('name', pl.name, 'dailyReturnPercent', pl.daily_return_percent,
      'payoutRequestDays', pl.payout_request_days, 'minimumThresholdPercent', pl.minimum_threshold_percent,
      'withdrawalEntryFeePercent', pl.withdrawal_entry_fee_percent, 'managementFeePercent', pl.management_fee_percent,
      'durationMonths', pl.duration_months)
      WHERE p.plan_id IS NULL AND p.plan_terms IS NULL`);
    const [planForeignKey] = await conn.query<any[]>("SELECT 1 FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'investor_profiles' AND constraint_name = 'fk_profile_plan'");
    if (!planForeignKey.length) await conn.query('ALTER TABLE investor_profiles ADD CONSTRAINT fk_profile_plan FOREIGN KEY (plan_id) REFERENCES investment_plans(id) ON DELETE RESTRICT');
    await conn.query(`CREATE TABLE IF NOT EXISTS daily_interest_credits (
      id CHAR(36) PRIMARY KEY, investor_user_id CHAR(36) NOT NULL, investment_id CHAR(36) NOT NULL,
      eligible_day DATE NOT NULL, amount_usd DECIMAL(18,2) NOT NULL, amount_btc DECIMAL(18,8) NOT NULL,
      btc_price_usd DECIMAL(18,2) NOT NULL, created_at DATETIME NOT NULL,
      UNIQUE KEY uniq_interest_day (investor_user_id, investment_id, eligible_day),
      CONSTRAINT fk_interest_user FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);
    const [creditCurrency] = await conn.query<any[]>("SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'daily_interest_credits' AND column_name = 'currency'");
    if (!creditCurrency.length) await conn.query("ALTER TABLE daily_interest_credits ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'BTC'");
    await conn.query(`CREATE TABLE IF NOT EXISTS investment_capital_history (
      investor_user_id CHAR(36) NOT NULL, investment_id CHAR(36) NOT NULL,
      effective_day DATE NOT NULL, principal_usd DECIMAL(18,2) NOT NULL,
      recorded_at DATETIME NOT NULL,
      PRIMARY KEY (investor_user_id, investment_id, effective_day),
      CONSTRAINT fk_capital_user FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);
    await conn.query(`CREATE TABLE IF NOT EXISTS exchange_rate_cache (
      base_currency VARCHAR(3) PRIMARY KEY, inr_rate DECIMAL(18,8) NOT NULL,
      fetched_at DATETIME NOT NULL, source_date VARCHAR(40) NOT NULL
    ) ENGINE=InnoDB`);
  } finally {
    await conn.query("SELECT RELEASE_LOCK('finova_financial_schema_v1')");
    conn.release();
  }
}
