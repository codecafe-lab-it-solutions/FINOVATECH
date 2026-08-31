import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'finovatech_app',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'finovatech',
  waitForConnections: true,
  connectionLimit: 10,
  // Return DATETIME columns as plain strings instead of JS Date objects.
  dateStrings: true
});

// Schema lives here so any future table (investors, transactions, etc.)
// has one place to register its migration alongside `users`.
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
}
