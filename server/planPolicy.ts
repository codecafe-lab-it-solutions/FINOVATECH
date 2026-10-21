// Calendar days are evaluated in the platform timezone; persisted timestamps are UTC.
export const platformTimezone = process.env.PLATFORM_TIMEZONE || 'UTC';
export function platformDay(now = new Date(), timeZone = platformTimezone): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (key: string) => parts.find(p => p.type === key)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function addDays(day: string, count: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
}
export function maturityDay(joining: string, months: number): string {
  const date = new Date(`${joining}T00:00:00Z`);
  const originalDay = date.getUTCDate();
  date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + months);
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(originalDay, last));
  return date.toISOString().slice(0, 10);
}
export function utcDay(timestamp: string): string {
  return platformDay(new Date(timestamp.replace(' ', 'T') + (timestamp.endsWith('Z') ? '' : 'Z')));
}
export interface PlanTerms {
  name: string;
  dailyReturnPercent: number;
  payoutRequestDays: number;
  minimumThresholdPercent: number;
  withdrawalEntryFeePercent: number;
  managementFeePercent: number;
  durationMonths: number;
}
export function nextEligibleDay(joining: string, latest: string | null, interval: number, manual: string | null = null): string {
  const base = latest && latest > joining ? latest : joining;
  const day = addDays(base, Math.max(7, interval));
  return manual && manual > day ? manual : day;
}
export function maximumWithdrawal(principal: number, wallet: number, threshold: number): number {
  return Math.max(0, wallet - principal * threshold / 100);
}
export function validatePlan(params: Record<string, unknown>): void {
  for (const key of ['directReferralPercent', 'minInvestmentUsd', 'maxInvestmentUsd', 'managementFeePercent', 'dailyReturnPercent', 'minimumThresholdPercent', 'withdrawalEntryFeePercent', 'durationMonths', 'payoutRequestDays']) {
    const value = params[key];
    if (value === undefined) continue;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error(`Invalid ${key}: enter a non-negative number.`);
    if (key.endsWith('Percent') && value > 100) throw new Error(`${key} cannot exceed 100%.`);
    if ((key === 'durationMonths' || key === 'payoutRequestDays') && (!Number.isInteger(value) || value < 1 || value > 3650)) throw new Error(`Invalid ${key}: enter a whole number from 1 to 3650.`);
  }
  if (params.name !== undefined && (typeof params.name !== 'string' || !params.name.trim() || params.name.length > 150)) throw new Error('Plan name is required (maximum 150 characters).');
  if (params.tagline !== undefined && (typeof params.tagline !== 'string' || params.tagline.length > 255)) throw new Error('Invalid plan tagline.');
  if (Number(params.maxInvestmentUsd) < Number(params.minInvestmentUsd)) throw new Error('Maximum investment must be at least the minimum.');
  if (params.status !== undefined && !['Active', 'Draft', 'Deactivated'].includes(String(params.status))) throw new Error('Invalid plan status.');
  if (params.payoutFrequency !== undefined && !['Daily', 'Weekly', 'Monthly'].includes(String(params.payoutFrequency))) throw new Error('Invalid payout frequency.');
}
