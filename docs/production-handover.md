# Production handover: investor, referrals and operations release

Local acceptance completed 23 October 2026: all 15 requested workflows covered by browser testing and database/API tests. Final suite: 95 passed, zero failures/skips. Type checking and production build passed. SMTP connection verified. Compatible dependency updates cleared the npm security audit. This does not certify a deployed server or elapsed multi-day production operation.

## Before deployment

- Review and deploy the release branch and its package-lock.json through the normal release process. Do not copy local .env or QA database records into production.
- Back up MySQL and server/uploads/deposit-proofs; verify restoration and retain the previous release for rollback. Support images are stored in MySQL; deposit proof images are stored on disk.
- Use a suitable supported Node runtime and MySQL. Install from the lockfile with npm ci, then npm run lint and npm run build. The standalone earnings job needs tsx, currently a runtime dependency.
- Database schema setup runs at API startup; review the additive migrations in server/database.ts and server/financialSchema.ts on staging first. Ensure the deployment database account can perform the required migration operations.
- Configure environment variables from .env.example using the production secret store/private environment file: database, SMTP, API_PORT, NODE_ENV=production, PLATFORM_TIMEZONE=Asia/Kolkata and JWT_SECRET. JWT_SECRET must be unique, random and at least 32 characters; missing, short and placeholder values intentionally prevent production startup.
- Production startup no longer seeds demo accounts. Provision the real admin securely using the terminal admin:create process, or verify the existing real admin. Rotate weak/demo credentials and revoke obsolete sessions. The secret guard does not automatically fix existing weak account passwords.
- Review existing investors for correct funded principal, assigned plan, permanent KYC approval date and capital history. Do not fabricate missing historical dates or recompute historical credits casually. Existing funded plans retain their agreed terms when the catalog changes.

## Application service and storage

- Run the built Node API/frontend service with NODE_ENV=production and a process supervisor that restarts it after failure/reboot. The entry point is server.js, created by npm run build. Do not use Vite/npm run dev as the public production service.
- Put it behind the intended HTTPS domain and reverse proxy. Keep database access restricted. Configure request/upload limits consistently with the API (support JSON images up to 2 MB and deposit proof uploads up to 5 MB).
- Mount server/uploads/deposit-proofs as persistent private storage with backups. Do not publicly serve that directory; the API checks proof access.
- Verify signup/login, admin access, investor access, actual email delivery and reset/withdrawal OTP on the deployed domain. Confirm sender DNS/SPF/DKIM/DMARC with the mail administrator. Recovery allows a username to identify an account when an email is shared; email alone never selects an arbitrary duplicate.
- Monitor service failures, API errors, earnings-job failures, storage and backups. Configure login/edge abuse protection appropriate to the deployed reverse proxy and infrastructure.

## Earnings job: coordinate with Antima

See [earnings-server-setup.md](earnings-server-setup.md) and deploy/finovateck-earnings.service plus deploy/finovateck-earnings.timer. Adjust OS user, application directory and absolute npm path for the actual server before installation.

- Install either the documented systemd timer or cron, verify India midnight (00:00 Asia/Kolkata), then confirm retries and reboot recovery.
- npm run earnings:run uses the same reconciliation as the API scheduler. Unique investment/day records and a database lock prevent duplicate daily credits. Run it only from trusted server administration; do not expose a public job endpoint.
- Admin > System Settings > Daily Earnings Job shows source, UTC timestamps, credits and failures. Verify these on production; passing local timer tests does not prove a production timer exists.
- Timezone migration needs review of historical KYC timestamps/credit days before rollout. Midnight India corresponds to 18:30 UTC on the preceding date.

## Business configuration and remaining integrations

- Confirm real plan daily rates, referral rates, withdrawal intervals/global cap, treasury policy and deposit/company wallet addresses. Do not deploy dummy QA addresses or simulated balances as real records.
- USD payouts reserve/settle USD without debiting BTC. Marking a request Completed is bookkeeping; the operator must arrange and verify any real bank/blockchain payment. The app does not automatically transfer funds or collect treasury multi-signatures.
- Dashboard production, machine readings, revenue and OPEX are saved reported data, not automatic hardware/pool collection. Supply actual reports/readings or arrange a separate provider integration using the operator's real API access. Missing records correctly show Not reported.
- Pool references, maintenance reserve and quorum/schedule fields are policy/reference values, not hardware configuration or signature enforcement. Electricity tariff calculates an estimate, separate from actual OPEX entries.
- The PDF export is a real downloadable unsigned investment-terms summary. Provide actual company-signed agreements separately if required; no verified e-signature/stamp workflow is included.

## Release acceptance

- Use a staging database for npm run test:audit. Tests create/delete disposable fixtures and temporarily change global withdrawal/maintenance/earnings settings before restoring them. Do not run this suite against production investors.
- Repeat the key browser journey on the deployed environment: plan -> sponsor registration -> referral registration -> investment confirmation -> commission -> earnings -> OTP withdrawal -> admin review -> investor history; also support image, notification, deposit proof and PDF export.
- Observe 2-3 controlled staging investors for a real 3-4 days. Compare daily credits, ledger, referral credits, payout reservations, retry/restart behavior and logs. Local multi-day tests use simulated dates and do not replace this observation.
- Deployment, timer installation, real payment execution and live mining-provider verification were not performed during the local acceptance review.

Local screenshots, raw database snapshots, test-account credentials and personal inbox details are intentionally excluded from GitHub. The repeatable automated tests and this sanitized deployment handover are included.
