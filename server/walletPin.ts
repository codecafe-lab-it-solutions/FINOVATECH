import bcrypt from 'bcryptjs';

// Security PIN an admin must enter to change any wallet or deposit address. Only a bcrypt hash is
// configured, in the server environment as WALLET_CHANGE_PIN_HASH. Without it, every change is refused.
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; firstAt: number }>();

export class WalletPinError extends Error {}

// shortcut: failure counters live in memory, so a restart resets them; move to the DB if brute force becomes a concern.
export function verifyWalletPin(actorId: string, pin: unknown, now = Date.now()): void {
  const record = failures.get(actorId);
  if (record && now - record.firstAt > LOCK_MS) failures.delete(actorId);
  const current = failures.get(actorId);
  if (current && current.count >= MAX_FAILURES) throw new WalletPinError('Too many wrong security PIN attempts. Try again in 15 minutes.');
  const hash = process.env.WALLET_CHANGE_PIN_HASH;
  if (!hash) throw new WalletPinError('Wallet changes are disabled: WALLET_CHANGE_PIN_HASH is not configured on the server.');
  if (typeof pin !== 'string' || !pin || !bcrypt.compareSync(pin, hash)) {
    failures.set(actorId, { count: (current?.count ?? 0) + 1, firstAt: current?.firstAt ?? now });
    throw new WalletPinError('Security PIN is required and must be correct to change a wallet or deposit address.');
  }
  failures.delete(actorId);
}
