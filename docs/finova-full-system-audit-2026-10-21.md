# Finova full admin and investor acceptance audit

**Later confirmed decision:** [Earnings and new withdrawals now use USD](finova-usd-confirmation.md). That follow-up supersedes this audit's historical BTC-denomination descriptions and test count.

Date: 21 October 2026. Local application: http://localhost:3000; API: http://localhost:8787. Platform financial timezone: UTC.

## Result

**74 automated checks passed, zero failed, zero skipped.** The runner includes three parent test containers, so this represents 71 individual cases. TypeScript, production frontend/server build, whitespace checks and the unchanged market-module check passed. The existing large-bundle build advisory remains.

Browser checks exercised plan creation/editing, assigned-plan deletion protection, KYC request-information and approval, admin test funding, investor login/profile, withdrawal conditions/amount validation/error handling, agreement viewing/download, referrals, earnings, payout records, currency switching and responsive contract display. Additional admin pages were opened and checked for visible loading failures.

**The platform is not fully release-ready.** Agreement PDF download remains an actual failure. Existing investor plan/KYC records still require administrator setup using genuine records. Fresh mailbox receipt was not repeated during this audit: SMTP authentication was verified now, and real inbox delivery plus code/reset/login was verified earlier with the user's supplied code. Administrative payout completion was tested; no blockchain payment was made.

## Complete requested-feature checklist

| Requirement | Result | Tests and observed outcome |
|---|---|---|
| 1. Forgot Password | PASS with delivery provenance | Six-digit generation, wrong/expired codes, five-attempt rejection, single use, concurrent consumption, reset, old-password rejection and new-password login passed. Earlier real delivery was confirmed by the user. Current SMTP connection/authentication verification passed, sending no additional email. Sender: FINOVATECK Mining Company <support@finovateck.com>. |
| 2. Plan creation/edit/deletion | PASS | Browser created QA Full Audit 20261021 with decimal values. Reopening retained all fields. Assigned plan remained editable; Delete was disabled with an explanation. HTTP/service deletion guards survived plan rename; an unassigned plan was deleted. Investor and anonymous mutations were rejected. |
| 3. New plan fields | PASS | Daily percentage, payout days, retained threshold and stored-only entry/withdrawal fee round-trip through API/MySQL. Negative/out-of-range percentages, fractional/zero days, invalid duration/status/frequency and inconsistent investment limits were rejected. Daily rates 0.5%, 1%, 1.25% and 2.75% were calculated independently. |
| 4. USD/INR | PASS for tested displays | Both panels expose the selector and conversion provenance. Browser switched currency; rendered tests check principal and small tariffs. Controlled rate 90 converts $10,000 to INR 900,000 and $0.042 to INR 3.78. Provider failure returns the saved successful rate with a stale label. Stored principal/BTC values remain unchanged. |
| 5. Password management | PASS | Wrong current password rejected, correct change accepted, old session revoked and new credentials accepted. Reset and change use the existing auth system. Credential-changing tests used isolated accounts through HTTP, not a real person's browser account. |
| 6. Assigned conditions during withdrawal/documents | PASS for screen; FAIL for PDF | Actual saved name, principal, daily return, payout interval, threshold, entry fee, management fee, joining date, duration and eligibility were visible in wallet, withdrawal modal and full agreement. Catalog changed from 0.5% to 1.25%; existing investor retained 0.5%. PDF button generated no download; its handler only toggles a success message. |
| 7. Retained threshold and available funds | PASS | At controlled BTC/USD 100,000: principal $10,000, wallet 0.02 BTC/$2,000, threshold 2%/$200, exact maximum 0.018 BTC/$1,800 succeeds when the global limit allows it; larger amounts fail. Completion leaves exactly 0.002 BTC/$200. Pending reservations and a smaller global limit reduce the maximum. No 1.25% fee was deducted. |
| 8. Minimum seven days and plan-specific interval | PASS | Plans of 5, 7, 15, 30 and 45 days enforce effective intervals of 7, 7, 15, 30 and 45 days. First and subsequent requests fail one day early and succeed on the boundary. Rejected requests still establish the latest request date. Immediate/concurrent repeats, manual future locks and clearing locks were tested. |
| 9. KYC approval as joining date | PASS | Browser Pending -> Action Required -> Verified worked. Approval set Active status and approval/joining dates. Registration and KYC were deliberately separated in fixtures; financial dates followed KYC. Future approval rejected; reapproval could not reset the original timestamp. Pending/unconfirmed KYC, unassigned plans and accounts Under Review cannot withdraw/earn. |
| 10. FINOVA IDs and original contract UUID | PASS | Concurrent investors received unique sequential FINOVA identifiers. Migration re-runs retained public IDs and original UUID keys. Old agreement references migrated to the legacy UUID; new accounts received it immediately. Attempts to replace the agreement ID were overridden. Desktop/mobile UUID fits one line. |
| 11. BTC wallet dates | PASS | Wallet shows both KYC approval and official joining/start dates. Missing approval remains explicitly unconfirmed. |
| 12. Profile/contract/referral dates and plan | PASS | Profile shows assigned plan, registration, KYC approval, joining/start and maturity separately. Full agreement uses the original UUID and official dates. Referral start date and referred investors' joined dates follow each investor's own KYC approval, not account creation. |
| 13. Midnight BTC interest | PASS | Same-day non-credit, completed-day credits, missed-day recovery, actual timer at a simulated midnight without login, concurrent/repeated runs, maturity stop, zero rate/principal, missing capital history and quote failure/recovery all passed. BTC rounded to eight decimals; USD amount and BTC price retained. Wallet, earnings and monthly totals agree after the statement fix. |
| 14. Original BTC market percentage behavior | PASS | server/market.ts is unchanged. The later explicit user choice authorizes conversion of the USD daily return into BTC; existing market percentage logic was not edited. |

## Additional admin/investor workflow checks

- Admin read endpoints for investors, plans, payouts, transactions, deposits, documents, wallets, tickets and machines returned 200. Investor profile, transactions, payouts, earnings, statements, notifications, sessions, tickets, referrals, machines, documents and withdrawal settings returned 200.
- Anonymous requests returned 401 and investor calls to tested admin mutations returned 403. Investor self-service could update contact details but could not change KYC, principal, balances, plan, financial dates, public ID or contract UUID.
- Funded investments cannot be reassigned to new agreed terms. Invalid admin monetary values and lock-date formats were rejected.
- Global withdrawals disabled and USD transaction limits were tested through the admin HTTP API. Original settings were restored: enabled, $1,000 maximum.
- A complete BTC HTTP workflow tested withdrawal-purpose OTP, wrong-purpose rejection, investor request, Processing, Completed, repeated completion, Rejected reversal and repeated reversal. BTC deducted/restored once; investor history reflected admin status. Reusing the original request/code failed.
- Historical USD payout support was retained and tested independently; USD settlement/reversal did not alter BTC balances.
- Deposit approval used clearly simulated disposable requests, credited principal/BTC once under concurrent review, and rejected repeat approval. Rejection changed no funds. Another investor could not view the proof. No real deposit was made. The proof-upload/file-storage browser workflow itself was not exercised; service-created test requests were used.
- New investor fixtures were created through the real account-creation service. Registration HTTP validation and duplicate handling were tested. A complete fresh browser registration/welcome-email submission was not repeated; this is a limit, not a claimed browser pass.
- Desktop and 375px mobile profile layouts were checked. After the compact-header fix, document width was 367px in a 375px viewport, with no horizontal page overflow. The UUID occupied one line (260px content/available width, about 14.7px height). Temporary viewport settings were reset.

## Defects found and corrected in this audit

1. **Unrelated investment reservations blocked payout completion.** Submission scoped reservations to the relevant investment, but completion did not. BTC and USD settlement now use the same investment scope. A failing settlement regression was reproduced, then passed after correction.
2. **First-step withdrawal errors were invisible.** An investor without an email clicked Review & Confirm and saw no explanation. The error had only rendered in step two. A shared alert now displays it on either step; browser retest showed “Add an email address to your profile before requesting a withdrawal.”
3. **Withdrawal email falsely reported immediate success.** The endpoint returned before SMTP finished. It now awaits SMTP submission and returns an error if submission fails. SMTP acceptance still does not prove inbox delivery.
4. **Profile retained USDT/weekly wording after the BTC decision.** Profile destination/edit controls now use Bitcoin (BTC), and explain administrator review and plan eligibility. Admin manual credit form now includes/defaults to BTC; existing USDT options remain available for relevant historical/deposit entries.
5. **Under Review accounts could request payouts.** Financial service and investor button now require Active status as well as confirmed KYC/assigned terms. New negative-state tests cover this.
6. **Catch-up totals appeared as a daily return.** The live scheduler posted 16 days together; the dashboard labelled all $800 as “/ day.” Assigned-plan daily display now shows $50/day, independently of catch-up batches.
7. **Monthly earnings omitted daily interest.** A failing comparison returned $0 statement earnings against $100 wallet/log credits. Statement earnings now include Daily Interest; the regression passes.
8. **Mobile header overflow.** Compact portal/wallet presentation now fits the tested phone viewport while keeping an accessible wallet control and the full contract UUID.
9. **Payout history showed fixed Friday/August dates and a 100% delivery claim.** Replaced with actual next-request eligibility, plan-based wording and administrator status descriptions. Regression verifies obsolete labels are absent.

The simulated-clock scheduler test was also scoped to its own disposable investor. A controlled-clock credit that reached the separately retained QA browser fixture during an early run was removed from that fixture; final runs no longer touch other investors. None of the six pre-existing investors was eligible for this test credit, and their financial baseline matches.

## Remaining failures and limits

1. **FAIL: real agreement PDF generation.** Clicking Download Agreement PDF produced no download. Download Stamped PDF shares the placeholder handler. Hash, stamp and verified-signature statements in the agreement are static placeholders, not verified signatures. This feature must be implemented and tested before relying on exported agreements.
2. **CONFIGURATION: six existing investor records.** They have no confirmed historical KYC approval date or assigned-term snapshot. Do not invent those dates or replace them with registration dates. An administrator must assign real plans and confirm actual historical approvals before those accounts can use the new financial workflow.
3. **Delivery coverage:** fresh SMTP verification passed; earlier user-confirmed reset-email delivery remains the actual inbox evidence. This run did not claim a new browser OTP/inbox end-to-end pass. Successful BTC submission/settlement was tested through HTTP with test-issued OTPs. The browser exercised the modal, amount constraints and missing-email failure.
4. **Scope limits:** no blockchain transfers, actual identity-document verification, legally valid signature verification, penetration test, performance/load certification or uninterrupted multi-day soak test was performed. Midnight/date boundary behavior was tested with controlled clocks and isolated dates, not by waiting 45 real days. KYC screens currently manage status/approval; no new identity-document upload workflow was implemented by the requested date changes.
5. **Legacy observations outside the requested changes:** generated referral codes currently use the first eight sanitized username characters, so accounts sharing that prefix can share a code. This was observed by code inspection; referral-code uniqueness/migration needs separate correction before relying on attribution for such accounts. Negative-return dashboard values also retain cosmetic “+ -” formatting. These observations are not included in the passing new-feature claims.

## Retained review fixture and data integrity

- Test investor: **finova_test_browser_20261021**; password: **BrowserAudit123!**. This is a disposable local test account with no real funds and no email set.
- Public ID: FINOVA932. Contract UUID: c70ac966-3691-4b02-8afb-6fb15e367ea2.
- Assigned snapshot: QA Full Audit 20261021, $10,000 principal, 0.5% daily, 15 days, 2% threshold, 1.25% stored-only fee, 6.5% management fee, 12 months. Catalog was edited to 1.25% daily to demonstrate preserved agreed terms.
- KYC was first approved through the browser on 21 October. For the eligibility/catch-up scenario, **only this QA fixture** was then given a simulated historical approval of 5 October. Its registration remains 21 October. This artificial scenario is not a genuine historical approval record.
- Running scheduler reconciled 16 eligible days, $800 total, 0.009604 BTC at the recorded price; wallet became 0.029604 BTC from its seeded 0.02 BTC. Values are test data, not actual payments or investment performance.
- All temporary automated fixtures were removed. The named browser account and its one QA plan were deliberately retained for review.
- Baseline comparison confirmed all six pre-existing investors' principal, BTC balance, USD balance, KYC timestamps and plan snapshots unchanged. See qa-data-integrity-results.json.
- Tests consume sequence identifiers; deleted test IDs are not reused. Gaps in FINOVA numbers are expected.

## Evidence and rerun

- [Automated results](qa-automated-results-2026-10-21.txt)
- [SMTP verification](qa-smtp-result.json)
- [Financial data comparison](qa-data-integrity-results.json)
- [Admin browser navigation results](qa-admin-browser-results.json)
- [Desktop contract/profile](qa-profile-desktop.png)
- [Mobile contract/profile](qa-profile-mobile.png)

With local MySQL and the development API running:

```powershell
npm.cmd run test:audit
npm.cmd run lint
npm.cmd run build
npm.cmd run test:smtp
```

The audit uses local demo admin credentials and disposable fixtures; it is intended for this development environment. The SMTP check sends no email.
