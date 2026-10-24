# Earnings server handover for Antima

The earlier implementation runs inside the Node API. It was not an installed operating-system cron. If the Node process stops or the hosting timezone differs, expected midnight credits may not appear. Only verified, active, funded investors with an assigned plan, confirmed KYC approval, and capital history earn. Existing legacy investors may lack these prerequisites. No server deployment access was supplied in this session; the live server has not been changed.

The selected earnings timezone is now Asia/Kolkata. Midnight India equals 18:30 UTC on the previous calendar date. Changing the timezone can change the mapping of older timestamps to calendar dates; review existing credit days and historical KYC dates before production rollout. Do not recalculate or delete historical ledger entries.

## Job

Run from the deployed application directory: npm run earnings:run. This is a separate process; it loads .env, runs schema initialization and the same transaction-safe reconciliation as the API. Do not expose it as an unauthenticated HTTP endpoint. A database lock prevents concurrent job processes; unique investment/day records prevent duplicate credits. Missed completed days are recovered, and credits stop at maturity. Errors produce a nonzero process exit and a Failed job record. API and cron can coexist safely.

## Install on a Linux host

1. Back up the database and validate on staging.
2. Deploy source, lockfile and dependencies including tsx (this job uses the TypeScript runner), and configure .env with DB credentials and PLATFORM_TIMEZONE=Asia/Kolkata. Do not place credentials in the service file or commit .env.
3. Adjust deploy/finovateck-earnings.service User, WorkingDirectory and absolute npm path for the actual host. Use the account that can read the application .env. Do not use root for the application.
4. Copy the service and timer to /etc/systemd/system/ using the server administrator's normal deployment process.
5. Run systemctl daemon-reload, then systemctl enable --now finovateck-earnings.timer.
6. Run systemctl start finovateck-earnings.service once; inspect systemctl status finovateck-earnings.service and journalctl -u finovateck-earnings.service.
7. Check systemctl list-timers finovateck-earnings.timer. The calendar event is India midnight; a one-minute retry also recovers downtime.
8. Admin > System Settings > Daily Earnings Job shows recent run source, timestamps (UTC), status, errors and credit count. Verify the midnight event and an actual eligible investor on the production database with consent.

For cron-only hosting, install a once-per-minute crontab invoking the same npm run earnings:run command from the deployed directory, with absolute paths and a writable log destination. Reconciliation uses India calendar days and cannot credit a day before it completes. Use either the systemd timer or cron, not both.

## Four-day acceptance

Automated tests simulate four completed India-calendar days for three disposable investors with different rates, and verify balances, ledger and repeat-run protection. This is not a four-day production observation. Retain monitored test accounts in staging for a real four-day soak after Antima activates the service.
