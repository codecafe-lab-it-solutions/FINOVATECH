import type { RowDataPacket } from 'mysql2';
import { pool } from './database';

export interface WithdrawalSettings {
  maxWithdrawalUsd: number;
  withdrawalsEnabled: boolean;
  updatedAt: string;
}

interface SettingsRow extends RowDataPacket {
  max_withdrawal_usd: string;
  withdrawals_enabled: number;
  updated_at: string;
}

function toSettings(row: SettingsRow): WithdrawalSettings {
  return {
    maxWithdrawalUsd: Number(row.max_withdrawal_usd),
    withdrawalsEnabled: !!row.withdrawals_enabled,
    updatedAt: row.updated_at
  };
}

export async function getWithdrawalSettings(): Promise<WithdrawalSettings> {
  const [rows] = await pool.query<SettingsRow[]>("SELECT * FROM withdrawal_settings WHERE id = 'global'");
  if (rows[0]) return toSettings(rows[0]);

  // Defensive fallback in case the seed row was somehow never created.
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await pool.query(
    "INSERT INTO withdrawal_settings (id, max_withdrawal_usd, withdrawals_enabled, updated_at) VALUES ('global', 1000, TRUE, ?)",
    [now]
  );
  return { maxWithdrawalUsd: 1000, withdrawalsEnabled: true, updatedAt: now };
}

export async function updateWithdrawalSettings(updates: {
  maxWithdrawalUsd?: number;
  withdrawalsEnabled?: boolean;
}): Promise<WithdrawalSettings> {
  await getWithdrawalSettings(); // ensures the row exists

  const setParts: string[] = [];
  const values: (string | number | boolean)[] = [];

  if (updates.maxWithdrawalUsd !== undefined) {
    setParts.push('max_withdrawal_usd = ?');
    values.push(updates.maxWithdrawalUsd);
  }
  if (updates.withdrawalsEnabled !== undefined) {
    setParts.push('withdrawals_enabled = ?');
    values.push(updates.withdrawalsEnabled);
  }

  if (setParts.length > 0) {
    setParts.push('updated_at = ?');
    values.push(new Date().toISOString().slice(0, 19).replace('T', ' '));
    await pool.query(`UPDATE withdrawal_settings SET ${setParts.join(', ')} WHERE id = 'global'`, values);
  }

  return getWithdrawalSettings();
}
