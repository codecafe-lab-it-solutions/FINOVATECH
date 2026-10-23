export function parseAdminAmount(value: unknown, label: string, allowNegative = false): number {
  const text = String(value ?? '').trim();
  // Accept plain decimals and familiar USD formatting, without silently
  // turning malformed input into a zero balance.
  let normalized = text.replace(/^\$\s*/, '');
  const sign = allowNegative && normalized.startsWith('-') ? -1 : 1;
  if (sign === -1) normalized = normalized.slice(1);
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(normalized)) {
    throw new Error(`${label}: enter a valid amount, such as 10000 or 10,000.00.`);
  }
  const amount = Number(normalized.replace(/,/g, ''));
  if (!Number.isFinite(amount) || amount < 0) throw new Error(`${label}: enter a non-negative amount.`);
  return sign * amount;
}
