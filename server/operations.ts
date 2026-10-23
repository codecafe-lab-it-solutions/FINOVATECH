import crypto from 'node:crypto';
import {pool} from './database';
import {getPlatformSettings} from './platformSettings';
import {platformDay} from './planPolicy';
export async function operatingMetrics() {
 const month=platformDay().slice(0,7);
 const [[investors],[payouts],[machines],[production],[money],[credits]]=await Promise.all([
  pool.query<any[]>("SELECT COUNT(*) totalInvestors,COALESCE(SUM(account_status='Active'),0) activeInvestors,COALESCE(SUM(total_investment_usd),0) totalInvestmentUsd,COALESCE(SUM(total_btc_allocated),0) totalBtcAllocated FROM investor_profiles"),
  pool.query<any[]>("SELECT COALESCE(SUM(CASE WHEN status='Completed' AND currency='BTC' THEN amount_btc ELSE 0 END),0) totalBtcPaidOut, COALESCE(SUM(CASE WHEN status IN ('Requested','Processing') AND currency='BTC' THEN amount_btc ELSE 0 END),0) pendingPayoutBtc, COALESCE(SUM(CASE WHEN status='Completed' AND currency='USD' THEN amount_usd ELSE 0 END),0) totalUsdPaidOut,COALESCE(SUM(CASE WHEN status IN ('Requested','Processing') AND currency='USD' THEN amount_usd ELSE 0 END),0) pendingPayoutUsd FROM payouts"),
  pool.query<any[]>("SELECT COUNT(*) totalMiners,COALESCE(SUM(status='Online'),0) minersOnline,COALESCE(SUM(CASE WHEN status='Online' THEN hashrate_th ELSE 0 END),0)/1000 miningHashratePH,COALESCE(AVG(uptime_percent),0) miningUptimePercent,COALESCE(SUM(CASE WHEN status='Online' THEN power_draw_watts ELSE 0 END),0) powerWatts,MAX(updated_at) telemetryUpdatedAt FROM mining_machines"),
  pool.query<any[]>("SELECT COALESCE(SUM(amount),0) totalBtcMined,COUNT(*) productionRecords FROM operating_entries WHERE kind='Production BTC'"),
  pool.query<any[]>("SELECT COALESCE(SUM(CASE WHEN kind='Revenue USD' THEN amount ELSE 0 END),0) monthlyRevenueUsd,COALESCE(SUM(CASE WHEN kind='OPEX USD' THEN amount ELSE 0 END),0) monthlyCostUsd,SUM(kind='Revenue USD') revenueRecords,SUM(kind='OPEX USD') costRecords FROM operating_entries WHERE DATE_FORMAT(entry_day,'%Y-%m')=?",[month]),
  pool.query<any[]>("SELECT COALESCE(SUM(amount_usd),0) investorEarningsUsd FROM wallet_transactions WHERE type='Daily Interest' AND status='Completed'")]);
 const raw={...investors[0],...payouts[0],...machines[0],...production[0],...money[0],...credits[0]};const result:any={};
 for(const [key,value] of Object.entries(raw))result[key]=key==='telemetryUpdatedAt'?value:Number(value||0);
 result.netProfitUsd=result.monthlyRevenueUsd-result.monthlyCostUsd;
 result.reportingMonth=month;result.fetchedAt=new Date().toISOString();
 result.estimatedMonthlyPowerCostUsd=Math.round(result.powerWatts/1000*24*30*(await getPlatformSettings()).electricityTariffPerKwh*100)/100;
 return result;
}
export async function listOperatingEntries(){const [rows]=await pool.query<any[]>('SELECT * FROM operating_entries ORDER BY entry_day DESC,created_at DESC LIMIT 200');return rows.map(r=>({...r,amount:Number(r.amount)}));}
export async function createOperatingEntry(input:any,adminId:string){
 if(!['Production BTC','Revenue USD','OPEX USD'].includes(input.kind))throw new Error('Select a valid entry type.');
 if(typeof input.amount!=='number'||!Number.isFinite(input.amount)||input.amount<=0)throw new Error('Amount must be positive.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(input.entryDay)||new Date(input.entryDay+'T00:00:00Z').toISOString().slice(0,10)!==input.entryDay||input.entryDay>platformDay())throw new Error('Enter a valid, non-future reporting date.');
 if(typeof input.note!=='string'||!input.note.trim()||input.note.length>500)throw new Error('Enter a source reference or invoice note (up to 500 characters).');
 if(input.kind!=='Production BTC'&&Math.abs(input.amount*100-Math.round(input.amount*100))>0.000001)throw new Error('USD amounts support two decimal places.');
 const id=crypto.randomUUID();await pool.query('INSERT INTO operating_entries(id,kind,amount,entry_day,note,created_by,created_at) VALUES(?,?,?,?,?,?,UTC_TIMESTAMP())',[id,input.kind,input.amount,input.entryDay,input.note.trim(),adminId]);return id;
}
