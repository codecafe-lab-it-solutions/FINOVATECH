import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from './database';

const OTP_TTL_MS = 10 * 60 * 1000;

function toMysqlDateTime(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function createOtpForUser(userId: string, purpose: 'password-reset' | 'withdrawal' = 'password-reset'): Promise<string> {
  const otp = generateOtp();
  const otpHash = bcrypt.hashSync(otp, 10);
  const now = new Date();

  // Requesting a new code invalidates any earlier unused one for this user —
  // only the most recently sent code should ever be accepted.
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('SELECT id FROM users WHERE id = ? FOR UPDATE', [userId]);
    const [recent] = await conn.query<RowDataPacket[]>('SELECT id FROM password_reset_otps WHERE user_id = ? AND purpose = ? AND created_at > DATE_SUB(UTC_TIMESTAMP(), INTERVAL 60 SECOND)', [userId, purpose]);
    if (recent.length) throw new Error('Please wait 60 seconds before requesting another code.');
    await conn.query('UPDATE password_reset_otps SET used = TRUE WHERE user_id = ? AND purpose = ? AND used = FALSE', [userId, purpose]);
    await conn.query('INSERT INTO password_reset_otps (id, user_id, otp_hash, expires_at, used, created_at, purpose) VALUES (?, ?, ?, ?, ?, ?, ?)', [crypto.randomUUID(), userId, otpHash, toMysqlDateTime(new Date(now.getTime() + OTP_TTL_MS)), false, toMysqlDateTime(now), purpose]);
    await conn.commit();
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }

  return otp;
}

interface OtpRow extends RowDataPacket {
  id: string;
  otp_hash: string;
  expires_at: string;
}

export async function verifyAndConsumeOtp(userId: string, otp: string, purpose: 'password-reset' | 'withdrawal' = 'password-reset'): Promise<boolean> {
  if (!/^\d{6}$/.test(otp)) return false;
  // Checks every still-valid unused code rather than picking "the latest" by
  // timestamp — createOtpForUser normally leaves at most one, but this avoids
  // any ordering ambiguity if two codes were ever created within the same
  // second (DATETIME here only has whole-second precision).
  // expires_at is stored in UTC (matching toMysqlDateTime below), so this
  // must compare against UTC_TIMESTAMP(), not NOW() — NOW() returns the
  // MySQL server's local time, which caused every OTP to appear instantly
  // expired on a server whose local timezone is ahead of UTC.
  const [rows] = await pool.query<OtpRow[]>(
    'SELECT id, otp_hash, expires_at FROM password_reset_otps WHERE user_id = ? AND purpose = ? AND attempts < 5 AND used = FALSE AND expires_at > UTC_TIMESTAMP()',
    [userId, purpose]
  );

  for (const row of rows) {
    if (bcrypt.compareSync(otp, row.otp_hash)) {
      const [result] = await pool.query<ResultSetHeader>('UPDATE password_reset_otps SET used = TRUE WHERE id = ? AND used = FALSE AND attempts < 5 AND expires_at > UTC_TIMESTAMP()', [row.id]);
      return result.affectedRows === 1;
    }
    await pool.query('UPDATE password_reset_otps SET attempts = attempts + 1 WHERE id = ? AND used = FALSE', [row.id]);
  }

  return false;
}
