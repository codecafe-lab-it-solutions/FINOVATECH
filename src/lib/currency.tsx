import React, { createContext, useContext, useEffect, useState } from 'react';

type Rate = { rate: number; fetchedAt: string; sourceDate: string; stale: boolean; source: string };
type Currency = 'USD' | 'INR';
export function formatDisplayMoney(usd: number, currency: Currency, rate: number | null, maximumFractionDigits = 2): string {
  const selected = currency === 'INR' && rate ? 'INR' : 'USD';
  return new Intl.NumberFormat(selected === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: selected, minimumFractionDigits: 2, maximumFractionDigits }).format(selected === 'INR' ? usd * rate! : usd);
}
export const CurrencyContext = createContext({ currency: 'USD' as Currency, setCurrency: (_value: Currency) => {}, rate: null as Rate | null, error: '', formatMoney: (amount: number, maximumFractionDigits = 2) => formatDisplayMoney(amount, 'USD', null, maximumFractionDigits) });
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => localStorage.getItem('finova_currency') === 'INR' ? 'INR' : 'USD');
  const [rate, setRate] = useState<Rate | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch('/api/exchange-rate');
        if (!response.ok) throw new Error('Exchange rate unavailable');
        const next = await response.json() as Rate;
        if (!Number.isFinite(next.rate) || next.rate <= 0) throw new Error('Invalid exchange rate');
        if (active) { setRate(next); setError(''); }
      } catch { if (active) { setRate(old => old ? { ...old, stale: true } : null); setError('Exchange rate unavailable'); } }
    };
    void load();
    const interval = setInterval(load, 5 * 60_000);
    return () => { active = false; clearInterval(interval); };
  }, []);
  const select = (next: Currency) => { setCurrency(next); localStorage.setItem('finova_currency', next); };
  const formatMoney = (usd: number, maximumFractionDigits = 2) => formatDisplayMoney(usd, currency, rate?.rate ?? null, maximumFractionDigits);
  return <CurrencyContext.Provider value={{ currency, setCurrency: select, rate, error, formatMoney }}>{children}</CurrencyContext.Provider>;
}
export const useCurrency = () => useContext(CurrencyContext);
export function Money({ usd, maximumFractionDigits = 2 }: { usd: number; maximumFractionDigits?: number }) {
  return <>{useCurrency().formatMoney(usd, maximumFractionDigits)}</>;
}
export function CurrencySelector() {
  const { currency, setCurrency, rate, error } = useCurrency();
  return <div className="flex flex-wrap items-center gap-3 px-5 py-2 bg-ink-950 border-b border-line text-xs text-fg-body">
    <div className="flex items-center gap-3 shrink-0">
      <span className="font-semibold text-white">Display currency</span>
      <div role="group" aria-label="Display currency" className="inline-flex gap-1 rounded-xl border border-line-warm bg-ink-850 p-1">
        {(['USD', 'INR'] as Currency[]).map(option => <button
          key={option}
          type="button"
          aria-pressed={(rate ? currency : 'USD') === option}
          disabled={option === 'INR' && !rate}
          onClick={() => setCurrency(option)}
          title={option === 'INR' && !rate ? 'INR will be available when the exchange rate loads' : 'Display amounts in ' + option}
          className={'rounded-lg px-4 py-2 text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ' + ((rate ? currency : 'USD') === option ? 'bg-gold-500 text-black shadow-sm' : 'text-fg-body hover:bg-ink-800 hover:text-white')}
        >{option === 'USD' ? 'USD ($)' : 'INR (₹)'}</button>)}
      </div>
    </div>
    {rate ? <span>{rate.stale ? 'Last successful rate (provider unavailable)' : 'Latest available rate'}: $1 = ₹{rate.rate.toFixed(4)} · {rate.sourceDate} · {rate.source} · fetched {new Date(rate.fetchedAt).toLocaleString()}</span> : <span>{error || 'Loading exchange rate…'} · displaying USD</span>}
    <span className="text-fg-muted">Display conversion only. Amount entry remains in USD or BTC as labeled.</span>
  </div>;
}
