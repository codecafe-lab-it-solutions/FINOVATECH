export interface BtcMarketData {
  usd: number;
  change24hPercent: number;
  difficultyT: number;
  updatedAt: string;
}

let cache: BtcMarketData | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 60_000;

export async function getBtcMarketData(): Promise<BtcMarketData> {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL_MS) {
    return cache;
  }

  const [priceRes, difficultyRes] = await Promise.all([
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'),
    fetch('https://blockchain.info/q/getdifficulty')
  ]);

  if (!priceRes.ok) {
    throw new Error(`CoinGecko price fetch failed: ${priceRes.status}`);
  }
  const priceJson = await priceRes.json();
  const usd = priceJson?.bitcoin?.usd;
  const change24hPercent = priceJson?.bitcoin?.usd_24h_change;
  if (typeof usd !== 'number') {
    throw new Error('Unexpected CoinGecko response shape');
  }

  let difficultyT = 0;
  if (difficultyRes.ok) {
    const difficultyRaw = Number((await difficultyRes.text()).trim());
    if (Number.isFinite(difficultyRaw)) {
      difficultyT = difficultyRaw / 1_000_000_000_000;
    }
  }

  const data: BtcMarketData = {
    usd,
    change24hPercent: typeof change24hPercent === 'number' ? Number(change24hPercent.toFixed(2)) : 0,
    difficultyT: Number(difficultyT.toFixed(2)),
    updatedAt: new Date().toISOString()
  };

  cache = data;
  cacheTime = now;
  return data;
}
