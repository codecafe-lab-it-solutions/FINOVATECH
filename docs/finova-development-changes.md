# Finova platform changes

Follow-up: [Requirement-by-requirement audit, 21 October 2026](finova-requirements-audit-2026-10-21.md) records the subsequent real email test, additional regression fixes, 38 passing automated checks, the final BTC denomination decision, and remaining PDF/release issues. Its findings supersede the initial verification notes below.

## Implementation

- Existing Express/MySQL APIs and React panels are retained. Stored monetary values remain USD/BTC; display conversion never writes balances or creates transactions.
- Investment plans support editing, confirmation before deletion, and a server-side deletion guard for assigned investors. New fields are daily return percentage, payout request days, retained principal threshold percentage, and withdrawal/entry fee percentage. The last field is information only: no deduction is applied.
- Assignments now retain the plan ID and a JSON snapshot of agreed terms. Catalog edits and renames do not change existing assignments, interest rates, or thresholds. Reassigning an existing funded investment is blocked to protect its agreement. The current architecture supports one investment profile and wallet per investor; this change does not aggregate multiple investments or introduce another balance.
- Withdrawal submission locks the investment profile and checks KYC approval, assigned terms, available BTC less pending requests, the global transaction limit, retained principal, manual locks, and `MAX(7, payoutRequestDays)`. First eligibility starts on the official joining day; subsequent eligibility starts on the most recent request day, including rejected requests. Request timestamps remain recorded. Status and balance updates now share a transaction, so repeated completion cannot debit twice; reversing a completed payout restores the recorded amounts once.
- KYC approval timestamps are recorded on the first transition to Verified and retained through later status changes. Joining/start dates derive only from this timestamp. Month-end maturity dates are clamped to the final valid day of the target month.
- Existing Verified investors without an approval timestamp remain undated. Admin > Investor Management allows a one-time confirmation from the actual approval record. No registration or historical text start date is silently substituted. Confirmed approval dates cannot be overwritten through profile editing.
- New public IDs use a database auto-increment sequence beginning at FINOVA786. UUID relationship keys are unchanged. The old displayed ID (the existing user UUID) is separately preserved for the contract agreement. Sequence gaps caused by rolled-back/removed records are not reused.
- Wallet, agreement/terms, profile, referral hierarchy, and admin investor/compliance views show the relevant dates and plan conditions. Plan conditions include the next eligibility date and configured interest timezone.
- Daily interest is credited in **BTC**, following the latest user decision. The USD daily return is divided by the credit-time BTC/USD price and rounded to eight decimals. Each credit records both amounts and the price. Existing USD balances and payouts remain supported without automatic conversion; new investor withdrawal requests use BTC. The existing market percentage functionality is unchanged.
- A server-side scheduler checks the midnight boundary in `PLATFORM_TIMEZONE` and retries reconciliation every minute and at startup. Completed eligible days are credited at the following midnight, ending at plan maturity. Transactions, BTC wallet increments and unique `(investor, investment, day)` credit records commit together. Missed days are reconciled without duplicates and with retries when the BTC quote is unavailable.
- Capital history records principal effective dates so a later principal change is not applied to earlier missed days. Historical approval confirmation uses the currently confirmed principal as its initial baseline; administrators must verify this against investment records before confirming old approvals. Existing credited transactions are never recalculated.
- USD/INR conversion uses Frankfurter's free central-bank/reference rate API: https://frankfurter.dev/ . The server caches successful rates in MySQL, refreshes after one hour and labels the last successful rate when refresh fails. The UI refreshes every five minutes and displays provider date, fetch time and stale status. INR is unavailable until there is a successful rate; no guessed fallback is used. Inputs remain in the explicitly labeled original USD/BTC denomination.
- Existing password changes remain integrated with authentication. Password reset and withdrawal codes now have separate purposes; codes expire after ten minutes, allow five failed attempts, are single-use even under concurrent verification, and have a 60-second resend cooldown. Successful password reset/change revokes existing sessions; password change issues a replacement session. Reset email sending is awaited so SMTP failures are not silently reported as success.
- Admin wallet adjustments and approved deposits now commit balance increments with their ledger entries. Deposit approval also commits its status atomically, and an unavailable conversion rate leaves it pending. This prevents simultaneous interest/deposit credits from overwriting one another.

## Main affected files

- `server/financialSchema.ts`: additive/idempotent schema migration and conservative legacy backfill.
- `server/planPolicy.ts`: timezone/calendar handling, maturity, thresholds and plan validation.
- `server/financialEngine.ts`: locked payout submission/settlement and daily interest scheduler/reconciliation.
- `server/adminData.ts`, `server/investors.ts`, `server/index.ts`: plan fields, assignments, dates, IDs and API integration.
- `server/deposits.ts`: conditional review transition to prevent duplicate/racing reviews.
- `server/exchangeRates.ts`: exchange API, persistent cache and stale fallback.
- `server/passwordReset.ts`, `server/mailer.ts`, `server/sessions.ts`: OTP separation, delivery error handling, SMTP verification and session revocation.
- `server/investorExtras.ts`: daily interest in earnings/statements and KYC-based referral dates.
- `src/lib/currency.tsx`, `src/lib/dates.ts`, `src/lib/api.ts`, `src/lib/investorMappers.ts`, `src/types.ts`: shared display and data contracts.
- Admin plan, investor, compliance and monetary presentation components; investor wallet, agreement, profile, referral, statements, earnings and monetary presentation components; both portal shells and `src/main.tsx`.

## Database migration

The existing `initSchema()` runs first, then `initFinancialSchema()` on server startup. Migration takes a MySQL advisory lock to serialize startup. Existing UUIDs, ledger rows and wallet amounts are retained.

Added columns:

- `investment_plans`: `daily_return_percent`, `payout_request_days`, `minimum_threshold_percent`, `withdrawal_entry_fee_percent`.
- `investor_profiles`: `plan_id`, `plan_terms`, `investment_id`, `kyc_approved_at`, `legacy_investor_id`.
- `payouts`: `investment_id`, `amount_usd`, `currency` (legacy default BTC; new requests use BTC; historical USD requests remain explicit USD).
- `investor_profiles`: additionally `usd_wallet_balance` to preserve existing dollar balances without converting holdings.
- `daily_interest_credits`: `currency` (historical default BTC; new interest credits explicitly BTC).
- `password_reset_otps`: `purpose`, `attempts`.

Added tables:

- `investor_identifiers`: unique public sequential IDs, preserving UUID relationships.
- `daily_interest_credits`: unique daily credit keys and recorded amounts/conversion prices.
- `investment_capital_history`: effective-day principal snapshots.
- `exchange_rate_cache`: last successful USD/INR rate and dates.

Only unambiguous exact-name legacy plan matches are backfilled automatically. Unknown/missing plans need admin review. New financial fields default to zero, with a seven-day payout interval; no return rates or fees are invented for old plans.

Before production rollout, back up the database and run the migration against a restored staging copy. Do not drop the new tables/columns on rollback: they contain identifiers, agreement terms and credit de-duplication history. Stop the scheduler before rolling back server code.

## API changes

- Existing `GET/POST/PUT /api/admin/plans` now include/validate the four fields. PUT merges validation against the saved plan. Added `DELETE /api/admin/plans/:id` returns a conflict when investors are assigned.
- Investor/admin profile responses now include `investorId`, `legacyInvestorId`, `investmentId`, `planId`, `planTerms`, `kycApprovedAt`, `joiningDate`, and `platformTimezone`. Existing `userId` is unchanged. `startDate`, maturity and next eligible dates are derived consistently.
- Existing admin profile update supports confirming an absent historical `kycApprovedAt` for a verified investor. New KYC approvals are captured automatically.
- Existing payout POST accepts `{currency: 'USD', amountUsd, destinationWallet, otp}` for USD withdrawals, enforces plan policy transactionally, and stores the currency/investment. Existing legacy BTC records remain supported. Admin status updates are transactional and idempotent; USD completion/reversal changes USD funds only. Both panels display payout currency and dollar amounts.
- Added `GET /api/exchange-rate`: `{rate, fetchedAt, sourceDate, source, stale}`; returns 503 if no real rate has ever been fetched and the provider is unavailable.
- Authentication paths remain unchanged; OTP purpose is enforced internally. Password reset invalidates old sessions.

## Configuration and verification

- Current sender: **FINOVATECK Mining Company <support@finovateck.com>**, SMTP host **smtp.hostinger.com**, port **465**. SMTP connection/authentication verified successfully; no messages were sent to existing investors during testing. Recipient inbox delivery still requires an approved test inbox. No replacement Finova address/domain has been invented.
- Set `PLATFORM_TIMEZONE` to an agreed IANA timezone before production use. Default **UTC** retains the existing platform's stated daily boundary. Keep it stable after financial operation begins.
- The Node API must run continuously under the deployment's process/service manager. Startup reconciliation recovers downtime; a browser does not need to remain open. Failed provider requests leave balances untouched and are retried.
- The configured database account needs the same schema-migration privileges used by the current app. Outbound HTTPS to Frankfurter, CoinGecko and the existing blockchain difficulty provider, and SMTP connectivity, are required. The local server was restarted with network access.
- Existing local data contains six investors and no catalog plans. Their legacy plan labels, balances and IDs were preserved. Missing catalog assignments and historical KYC approval dates must be confirmed by admin before interest/withdrawals can run for them.

## Tests

Run `npm run lint`, `npm run build`, and `node --import tsx --test tests/planPolicy.test.ts tests/financial.integration.test.ts` while the local API is running. Integration tests create uniquely named disposable investors/plans, exercise only their financial records, and clean them up. They do not email real users or change existing balances. The cached-rate test uses the actual last successful rate; call `/api/exchange-rate` once before running it.

Covered: decimal field validation, retained balance example/zero floor, seven-day/plan/manual date rules, timezone midnight and leap/month-end boundaries, ID migration idempotence, agreed-term preservation after rename, assigned-plan deletion guard, KYC/reapproval dates, early/oversized payouts, concurrent requests, idempotent completion/reversal, missed interest recovery and failed-job retry, fee storage without deduction, OTP expiry/purpose/attempt limits/concurrent consumption, password reset and subsequent login, unused-plan deletion, and stale exchange-rate fallback.

Result: **20 automated checks passed**, TypeScript passed, and production build passed. Browser checks confirmed admin login, live exchange-rate provenance, USD/INR selection and plan dialog fields. Investor login and profile/policy data were verified through the API; repeated browser automation timeouts prevented completing the investor visual walkthrough. Production build emits the existing large-bundle advisory; it is not a build failure.

Contract identifier follow-up: Contract Agreement now uses the preserved original investor UUID (legacy_investor_id), replacing the old FNV-MCT-AGR reference. Existing stored agreement numbers are migrated, new profiles receive their UUID immediately, and admin updates preserve this identifier. Public FINOVA sequence IDs remain unchanged. Migration/idempotency and replacement protection are covered by the integration suite.
