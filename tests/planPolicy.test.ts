import assert from 'node:assert/strict';
import { test } from 'node:test';
import { maximumWithdrawal, nextEligibleDay, platformDay, maturityDay, validatePlan } from '../server/planPolicy';

test('threshold retains thirty days of daily earnings, and clamps insufficient wallets to zero', () => {
  assert.equal(maximumWithdrawal(10000, 2000, .5), 500);
  assert.equal(maximumWithdrawal(10000, 100, .5), 0);
  assert.equal(maximumWithdrawal(10000, 2000, 0), 2000);
  assert.equal(maximumWithdrawal(10000, 4000, 1.25), 250);
});
test('first and subsequent payouts honor plan interval, seven days and manual lock', () => {
  assert.equal(nextEligibleDay('2026-10-01', null, 15), '2026-10-16');
  assert.equal(nextEligibleDay('2026-10-01', '2026-10-16', 15), '2026-10-31');
  assert.equal(nextEligibleDay('2026-10-01', null, 5), '2026-10-08');
  assert.equal(nextEligibleDay('2026-10-01', null, 7, '2026-11-01'), '2026-11-01');
});
test('calendar boundaries use configured timezone and clamp month-end maturity', () => {
  assert.equal(platformDay(new Date('2026-10-20T18:30:00Z'), 'Asia/Kolkata'), '2026-10-21');
  assert.equal(platformDay(new Date('2026-10-20T18:30:00Z'), 'UTC'), '2026-10-20');
  assert.equal(maturityDay('2026-01-31', 1), '2026-02-28');
  assert.equal(maturityDay('2024-02-29', 12), '2025-02-28');
});
test('invalid plan fields, fractional days, NaN, and inconsistent investment limits fail', () => {
  for (const values of [{dailyReturnPercent: -1}, {dailyReturnPercent: Infinity}, {minimumThresholdPercent: 101}, {payoutRequestDays: 1.5}, {payoutRequestDays: 0}, {minInvestmentUsd: 500, maxInvestmentUsd: 10}, {dailyReturnPercent: '1'}, {status: 'invalid'}]) assert.throws(() => validatePlan(values));
  assert.doesNotThrow(() => validatePlan({dailyReturnPercent: 0.5, payoutRequestDays: 15, minimumThresholdPercent: 2, withdrawalEntryFeePercent: 1.25}));
});
