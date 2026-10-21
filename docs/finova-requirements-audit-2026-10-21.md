# Finova requirement audit — 21 October 2026

Latest follow-up: [Full admin/investor audit](finova-full-system-audit-2026-10-21.md) supersedes the counts and browser-coverage limitations below, and records additional fixes and remaining failures.

## Verdict

The requested financial/authentication logic has been tested through service functions, the running HTTP API, rendered React output, and a controlled-clock run of the actual scheduler. Three additional regressions were reproduced and corrected during this audit. The user subsequently changed the decision to BTC. New daily returns are converted from their USD calculation into BTC at the recorded credit-time price; new withdrawal requests use BTC. Existing USD balances and history remain supported. The existing agreement PDF download remains a placeholder.

Do not interpret passing automated tests as confirmation that every existing screen or document export is complete. In particular, PDF generation is not covered by a passing test: inspection confirms it is absent.

## Requirement-by-requirement result

| # | Requirement | Result | Evidence and limits |
|---|---|---|---|
| 1 | Forgot Password | PASS | A real reset email was sent from `support@finovateck.com` to the user-provided Gmail test inbox. The user supplied its six-digit code. Reset returned 200, old-password login returned 401, new-password login returned 200, and code reuse returned 400. Expiry, purpose separation, five-attempt limits and concurrent single-use verification also passed. The isolated email test account was deleted afterward. No replacement sender/domain was invented. |
| 2 | Edit/delete investment plans | PASS | Admin HTTP creation/editing passed, including editing a plan with an assigned investor. Deletion of an assigned plan returned 409 with a clear error; an unused plan was deleted. Investor and anonymous attempts were rejected. Saved investor terms retained the old daily rate after a catalog rename/rate change. UI has disabled deletion and confirmation. |
| 3 | Four new plan fields | PASS | Daily rate, payout days, retained threshold and withdrawal/entry fee round-tripped through HTTP/MySQL. Decimal percentages passed. Negative percentages, percentages above 100 and fractional payout days were rejected. Interest credits used the full agreed return with no new entry/withdrawal fee deduction. |
| 4 | USD/INR display | PASS AFTER FIX | Main conversion and stale-rate fallback passed. Audit found fixed USD tariffs/amounts in secondary views. Those now use the shared formatter, including small tariff values. Rendered INR checks verified $10,000 → ₹900,000 and $0.042 → ₹3.78 at a controlled test rate of 90. Stored investment/wallet amounts remained unchanged. The test rate is synthetic and is not the live exchange rate. |
| 5 | Investor password management | PASS | Wrong current password rejected; verified change accepted; old sessions revoked; new password logged in. Both isolated API reset and actual email-delivered-code reset passed. Security Center remains available from the profile menu. |
| 6 | Assigned plan conditions in withdrawal/documents | PARTIAL | Rendered wallet and shared agreement conditions contain the saved plan name, principal, daily rate, payout interval, threshold, fees and dates. Catalog edits do not rewrite those agreed values. Fixed 48-month/2029 agreement text was corrected. **However, the existing Download Agreement PDF button only toggles a success message; it does not generate/download a PDF. Its signature/hash claims are also placeholders.** |
| 7 | Minimum retained wallet threshold | PASS | $10,000 principal / $2,000 wallet / 2% threshold produces $1,800 maximum. Backend rejects amounts above available funds and above the retained-balance maximum. Pending requests reserve funds. Admin completion also prevents violating the threshold. Global transaction limits may independently reduce the allowed amount. |
| 8 | Seven-day and plan-specific gap | PASS | First/subsequent eligibility and logs passed. A five-day plan enforced seven days; 15-, 30-, and 45-day cases honored their intervals. Requests one day early failed; requests on the eligible day succeeded; immediate repeat requests failed. Concurrent requests accepted only one. Manual locks and calendar boundaries were checked. |
| 9 | KYC approval as joining date | PASS AFTER FIX | Registration was deliberately earlier than KYC in the fixture; API joining/start dates followed KYC. Future approval was rejected; reapproval did not reset the original date. Maturity/month-end rules passed. Audit found and corrected the overview's fixed “Since Jan 2025” label and fixed contract-duration wording. Existing undated records still need confirmation from their actual KYC records. |
| 10 | FINOVA IDs and old contract ID | PASS WITH SEQUENCE NOTE | New concurrent investors received distinct increasing FINOVA IDs, and UUID relationship keys/legacy IDs remained intact. Migration re-runs preserved IDs. Contract UI uses the legacy ID. The sequence starts at FINOVA786; deleted or rolled-back test/account IDs are not reused, so historical gaps are possible. This is not a gapless numbering guarantee. |
| 11 | KYC/joining dates in BTC wallet | PASS | Rendered wallet output contains both labels and the same official KYC-derived date. Undated legacy investors display a confirmation-required message rather than a fabricated date. |
| 12 | Start date in agreement/referrals | PASS AFTER FIX | Agreement and referral components use the official joining date. Audit found Referral navigation inside a hidden group; a visible Partner / Referrals entry was added and rendered-output navigation test now passes. |
| 13 | Automatic daily interest | PASS ? BTC | $10,000 at 0.5% produces $50/day, converted to BTC at credit time (0.0005 BTC at the controlled $100,000 test price). Missed-day recovery, midnight execution without login, quote-failure safety, recorded conversion prices and duplicate prevention passed. Production requires the server process to stay running. |
| 14 | Preserve BTC-price percentage behavior | PASS ? latest BTC choice supersedes no-conversion instruction | The user explicitly authorized BTC earnings and withdrawals. Conversion uses the existing market provider; server/market.ts and its percentage behavior remain unchanged. Existing balances/history are preserved. |

## Issues reproduced and corrected during this audit

1. Secondary monetary displays bypassed the USD/INR formatter. Added currency-aware tariff/amount formatting with sufficient decimal precision.
2. Investor overview displayed “Since Jan 2025” and a fixed four-year term instead of the official joining date/assigned duration. Replaced those values and corrected agreement maturity/duration wording.
3. The referral component had its date, but investors could not reach it through the visible navigation. Added a visible referral entry.

Changes are in `src/lib/currency.tsx`, the affected admin monetary displays, `InvestmentDetailsTab.tsx`, `InvestorDashboardTab.tsx`, and `InvestorSidebar.tsx`. Added `tests/requirements.audit.test.tsx` for HTTP permissions, persistence, rendered values/navigation, eligibility boundaries and an actual timer-driven midnight simulation.

## Validation

Commands:

```powershell
node --import tsx --test --test-concurrency=1 tests/planPolicy.test.ts tests/financial.integration.test.ts tests/requirements.audit.test.tsx
npm.cmd run lint
npm.cmd run build
git diff --check
git diff --exit-code -- server/market.ts
```

The original suite, updated for BTC earnings and withdrawals, with historical USD support, passed 21 checks. The additional audit suite passed 17 checks, for 38 runner-reported passing checks including the suite container cases. These checks do not test or certify a working PDF export. The production build and TypeScript passed; the build still reports the existing large-bundle advisory.

Browser login and live INR amounts were observed. Broader click-through automation was intermittent, so rendered React tests and HTTP checks were used for the detailed field/date checks. A complete visual walkthrough at multiple screen sizes is not claimed.

## Existing investor data and deployment state

After test cleanup, the database contained six existing investors, zero catalog plans, six missing KYC approval dates, and six missing assigned-term snapshots. Aggregate existing principal was $65,000 and BTC wallet balance was 0.82470000 BTC. Zero disposable audit/email accounts remained. All financial mutations in tests targeted disposable fixtures, not those six existing investors.

The local records therefore cannot yet exercise the new withdrawal/interest workflow as configured: an administrator must create/assign actual plans and confirm historical KYC approval dates from records. Do not substitute registration dates. The scheduling timezone currently defaults to UTC; agree the production IANA timezone before activating financial jobs.

Open release items: real agreement PDF generation/verification, legacy plan/KYC setup, and a full visual browser acceptance walkthrough. The interest denomination decision is resolved: BTC.
