import { pool } from './database';
import type { RowDataPacket } from 'mysql2';

let retryAfter = 0;
let pending: Promise<ExchangeRate> | null = null;
interface ExchangeRate { rate: number; fetchedAt: string; sourceDate: string; stale: boolean; source: string }
export async function getExchangeRate(options: { fetchProvider?: typeof fetch; now?: number } = {}): Promise<ExchangeRate> {
  if (pending) return pending;
  pending = loadRate(options);
  try { return await pending; } finally { pending = null; }
}
async function loadRate(options: { fetchProvider?: typeof fetch; now?: number }): Promise<ExchangeRate> {
  const now = options.now ?? Date.now();
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM exchange_rate_cache WHERE base_currency = 'USD'");
  const saved = rows[0];
  const fetchedAt = saved ? new Date(saved.fetched_at.replace(' ', 'T') + 'Z').toISOString() : '';
  const cached = saved ? { rate: Number(saved.inr_rate), fetchedAt, sourceDate: saved.source_date, source: 'Frankfurter' } : null;
  if (cached && now - Date.parse(fetchedAt) < 60 * 60 * 1000) return { ...cached, stale: false };
  if (cached && now < retryAfter) return { ...cached, stale: true };
  try {
    const response = await (options.fetchProvider || fetch)('https://api.frankfurter.dev/v2/rate/USD/INR', { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Rate provider unavailable');
    const data = await response.json() as { rate: number; date: string; base: string; quote: string };
    if (data.base !== 'USD' || data.quote !== 'INR' || !Number.isFinite(data.rate) || data.rate <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error('Invalid provider response');
    const timestamp = new Date().toISOString();
    await pool.query(`INSERT INTO exchange_rate_cache (base_currency, inr_rate, fetched_at, source_date) VALUES ('USD', ?, ?, ?)
      ON DUPLICATE KEY UPDATE inr_rate = VALUES(inr_rate), fetched_at = VALUES(fetched_at), source_date = VALUES(source_date)`, [data.rate, timestamp.slice(0, 19).replace('T', ' '), data.date]);
    return { rate: data.rate, fetchedAt: timestamp, sourceDate: data.date, stale: false, source: 'Frankfurter' };
  } catch (err) {
    retryAfter = Date.now() + 60_000;
    if (cached) return { ...cached, stale: true };
    throw err;
  }
}
