import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'finovateck_app',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'finovateck',
  waitForConnections: true,
  connectionLimit: 10,
  // Return DATETIME columns as plain strings instead of JS Date objects.
  dateStrings: true
});

// MySQL has no `ADD COLUMN IF NOT EXISTS` (that's a MariaDB-only extension),
// so a plain ALTER TABLE would fail every boot once the column exists. This
// runs the ALTER and just swallows the "column already exists" error,
// making it safe to call unconditionally on every server start.
async function addColumnIfMissing(alterSql: string): Promise<void> {
  try {
    await pool.query(alterSql);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'ER_DUP_FIELDNAME') {
      return;
    }
    throw err;
  }
}

// Schema lives here so any future table has one place to register its
// migration alongside `users`.
export async function initSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      username VARCHAR(64) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('investor', 'admin') NOT NULL,
      name VARCHAR(120) NOT NULL,
      created_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS investor_profiles (
      user_id CHAR(36) PRIMARY KEY,
      email VARCHAR(160) NOT NULL DEFAULT '',
      phone VARCHAR(60) NOT NULL DEFAULT '',
      country VARCHAR(100) NOT NULL DEFAULT '',
      kyc_status ENUM('Verified', 'Pending', 'Action Required') NOT NULL DEFAULT 'Pending',
      account_status ENUM('Active', 'Under Review') NOT NULL DEFAULT 'Under Review',
      plan VARCHAR(200) NOT NULL DEFAULT 'No active investment plan',
      agreement_number VARCHAR(80) NOT NULL DEFAULT '',
      start_date VARCHAR(40) NOT NULL DEFAULT '',
      maturity_date VARCHAR(40) NOT NULL DEFAULT '',
      referral_code VARCHAR(60) NOT NULL DEFAULT '',
      referred_by_code VARCHAR(60) NULL,
      referrer_name VARCHAR(120) NOT NULL DEFAULT '',
      payout_btc_address VARCHAR(140) NOT NULL DEFAULT '',
      payout_network VARCHAR(20) NOT NULL DEFAULT 'TRC20',
      bank_name VARCHAR(120) NOT NULL DEFAULT '',
      bank_account_holder VARCHAR(120) NOT NULL DEFAULT '',
      bank_account_number VARCHAR(80) NOT NULL DEFAULT '',
      bank_iban VARCHAR(60) NOT NULL DEFAULT '',
      bank_swift VARCHAR(30) NOT NULL DEFAULT '',
      total_investment_usd DECIMAL(18,2) NOT NULL DEFAULT 0,
      current_portfolio_value_usd DECIMAL(18,2) NOT NULL DEFAULT 0,
      total_btc_allocated DECIMAL(18,8) NOT NULL DEFAULT 0,
      btc_mined DECIMAL(18,8) NOT NULL DEFAULT 0,
      btc_pending_accrued DECIMAL(18,8) NOT NULL DEFAULT 0,
      mining_share_percent DECIMAL(7,3) NOT NULL DEFAULT 0,
      updated_at DATETIME NOT NULL,
      CONSTRAINT fk_investor_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id CHAR(36) PRIMARY KEY,
      investor_user_id CHAR(36) NOT NULL,
      type VARCHAR(40) NOT NULL,
      amount_btc DECIMAL(18,8) NOT NULL,
      amount_usd DECIMAL(18,2) NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'Completed',
      note VARCHAR(255) NOT NULL DEFAULT '',
      network VARCHAR(20) NOT NULL DEFAULT '',
      created_at DATETIME NOT NULL,
      CONSTRAINT fk_wallet_tx_user FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_wallet_tx_investor (investor_user_id, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payouts (
      id CHAR(36) PRIMARY KEY,
      investor_user_id CHAR(36) NOT NULL,
      amount_btc DECIMAL(18,8) NOT NULL,
      destination_wallet VARCHAR(160) NOT NULL,
      network VARCHAR(20) NOT NULL DEFAULT '',
      status ENUM('Requested', 'Processing', 'Completed', 'Rejected') NOT NULL DEFAULT 'Requested',
      requested_at DATETIME NOT NULL,
      processed_at DATETIME NULL,
      notes VARCHAR(255) NOT NULL DEFAULT '',
      CONSTRAINT fk_payouts_user FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_payouts_investor (investor_user_id, requested_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS investment_plans (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      tagline VARCHAR(255) NOT NULL DEFAULT '',
      min_investment_usd DECIMAL(18,2) NOT NULL DEFAULT 0,
      max_investment_usd DECIMAL(18,2) NOT NULL DEFAULT 0,
      duration_months INT NOT NULL DEFAULT 12,
      management_fee_percent DECIMAL(6,3) NOT NULL DEFAULT 0,
      payout_frequency ENUM('Daily', 'Weekly', 'Monthly') NOT NULL DEFAULT 'Monthly',
      status ENUM('Active', 'Draft', 'Deactivated') NOT NULL DEFAULT 'Draft',
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS company_wallets (
      id CHAR(36) PRIMARY KEY,
      wallet_name VARCHAR(150) NOT NULL,
      type ENUM('Cold Vault', 'Hot Payout', 'Treasury', 'Operational OPEX', 'USDT Reserve') NOT NULL,
      currency ENUM('BTC', 'USDT') NOT NULL DEFAULT 'BTC',
      address VARCHAR(160) NOT NULL DEFAULT '',
      balance DECIMAL(18,8) NOT NULL DEFAULT 0,
      requires_multisig BOOLEAN NOT NULL DEFAULT FALSE,
      status ENUM('Secure', 'Active', 'Restricted') NOT NULL DEFAULT 'Active',
      updated_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id CHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category ENUM('Investment Agreement', 'Amendment', 'Investor Statement', 'Tax Document', 'KYC Document', 'Payment Receipt', 'Mining Audit') NOT NULL,
      investor_user_id CHAR(36) NULL,
      uploaded_by VARCHAR(120) NOT NULL DEFAULT '',
      status ENUM('Active', 'Archived') NOT NULL DEFAULT 'Active',
      created_at DATETIME NOT NULL,
      CONSTRAINT fk_documents_investor FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id CHAR(36) PRIMARY KEY,
      investor_user_id CHAR(36) NOT NULL,
      title VARCHAR(200) NOT NULL,
      message VARCHAR(500) NOT NULL,
      type VARCHAR(30) NOT NULL DEFAULT 'general',
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATETIME NOT NULL,
      CONSTRAINT fk_notifications_user FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_notifications_investor (investor_user_id, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  // Real login sessions — `revoked` is enforced at auth-check time (see
  // server/auth.ts / requireAuth), so "Revoke" here actually invalidates
  // that session's token on its next request, not just a cosmetic flag.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_sessions (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      device VARCHAR(200) NOT NULL DEFAULT '',
      ip_address VARCHAR(64) NOT NULL DEFAULT '',
      user_agent VARCHAR(255) NOT NULL DEFAULT '',
      created_at DATETIME NOT NULL,
      revoked BOOLEAN NOT NULL DEFAULT FALSE,
      CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_sessions_user (user_id, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id CHAR(36) PRIMARY KEY,
      investor_user_id CHAR(36) NOT NULL,
      subject VARCHAR(200) NOT NULL,
      category VARCHAR(60) NOT NULL DEFAULT 'General',
      status ENUM('Open', 'In Progress', 'Resolved') NOT NULL DEFAULT 'Open',
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      CONSTRAINT fk_tickets_investor FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_tickets_investor (investor_user_id, updated_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id CHAR(36) PRIMARY KEY,
      ticket_id CHAR(36) NOT NULL,
      sender_role ENUM('investor', 'admin') NOT NULL,
      sender_name VARCHAR(120) NOT NULL,
      message VARCHAR(2000) NOT NULL,
      created_at DATETIME NOT NULL,
      CONSTRAINT fk_messages_ticket FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
      INDEX idx_messages_ticket (ticket_id, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mining_machines (
      id CHAR(36) PRIMARY KEY,
      investor_user_id CHAR(36) NULL,
      pod_id VARCHAR(100) NOT NULL DEFAULT '',
      model VARCHAR(150) NOT NULL,
      hashrate_th DECIMAL(10,2) NOT NULL DEFAULT 0,
      power_draw_watts INT NOT NULL DEFAULT 0,
      temp_celsius DECIMAL(6,2) NOT NULL DEFAULT 0,
      status ENUM('Online', 'Offline', 'Maintenance') NOT NULL DEFAULT 'Online',
      pool VARCHAR(150) NOT NULL DEFAULT '',
      uptime_percent DECIMAL(6,2) NOT NULL DEFAULT 0,
      updated_at DATETIME NOT NULL,
      CONSTRAINT fk_machines_investor FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  // Real, single-use, expiring OTP codes for the forgot-password flow.
  // The code itself is bcrypt-hashed, same as passwords — never stored plain.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_otps (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      otp_hash VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATETIME NOT NULL,
      CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_otp_user (user_id, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  // Real record of every admin broadcast sent — backs the Communication
  // Center's history table with actual sends, not fabricated ones.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_broadcasts (
      id CHAR(36) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      message VARCHAR(2000) NOT NULL,
      recipient_type ENUM('All', 'Specific') NOT NULL,
      recipient_count INT NOT NULL DEFAULT 0,
      email_sent BOOLEAN NOT NULL DEFAULT FALSE,
      sent_by VARCHAR(120) NOT NULL DEFAULT '',
      created_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  // Added after the tables above already existed in production — these three
  // calls are no-ops once the columns are in place, so this stays safe to
  // run on every boot rather than needing a one-off migration script.
  await addColumnIfMissing("ALTER TABLE investor_profiles ADD COLUMN payout_network VARCHAR(20) NOT NULL DEFAULT 'TRC20'");
  await addColumnIfMissing("ALTER TABLE wallet_transactions ADD COLUMN network VARCHAR(20) NOT NULL DEFAULT ''");
  await addColumnIfMissing("ALTER TABLE payouts ADD COLUMN network VARCHAR(20) NOT NULL DEFAULT ''");
}
