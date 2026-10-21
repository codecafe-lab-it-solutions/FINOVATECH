# Confirmed earnings denomination: USD

The user's final confirmed instruction supersedes the earlier BTC choice: daily earnings remain in dollars. A $10,000 principal at 0.5% earns **$50 in the USD wallet per eligible day**, not a BTC equivalent.

## Current behavior

- New daily credits use currency USD, the actual dollar amount, zero BTC amount and no BTC quote. BTC-provider availability has no effect on dollar interest.
- New investor withdrawal requests use the available USD earnings wallet and USD bank/payment destination. Existing plan intervals, seven-day minimum, KYC/Active-account requirements, retained threshold, global limits and OTP/admin approval remain enforced.
- Completion/reversal changes USD funds once and leaves BTC holdings unchanged.
- Existing BTC balances, old BTC interest credits, payout history and market functionality are preserved. Previously credited eligible days are not credited a second time in USD. No retrospective conversion has been applied.
- Wallet, assigned conditions and profile explanation now describe USD earnings and withdrawals. USD/INR remains a display option; it does not convert the underlying account denomination.
- No new database migration was required: separate USD balances and explicit credit/payout currency already exist.

## Validation

The full automated audit was updated for USD and rerun. Additional cases cover:

1. BTC-provider outage does not prevent a new USD credit or trigger a quote request.
2. Different daily rates credit their exact dollar amounts with zero BTC conversion.
3. Timer-driven midnight credit, catch-up, maturity stopping and duplicate prevention work in USD.
4. Dollar earnings agree across wallet, ledger and monthly statements.
5. Historical BTC credits remain intact and are not credited again after changing the denomination.
6. USD earnings -> OTP request submission -> repeated admin completion/reversal preserves the retained threshold and leaves BTC unchanged.
7. USD first and subsequent withdrawal boundaries enforce effective 7-, 15-, 30- and 45-day intervals, including a five-day plan's mandatory seven-day minimum.

Latest results: [USD audit output](qa-usd-final-results.txt). Run `npm.cmd run test:audit` with the local API and MySQL running.

The earlier full-system audit remains the historical record of its browser tests and discovered defects. Its BTC-denomination descriptions are superseded by this note. Previously reported PDF export and legacy-record/referral issues remain unresolved; this denomination change does not claim to fix those features.
