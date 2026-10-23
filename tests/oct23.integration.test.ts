import 'dotenv/config';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import crypto from 'node:crypto';
import fs from 'node:fs';
import {pool,initSchema} from '../server/database';
import {initFinancialSchema} from '../server/financialSchema';
import {createUser} from '../server/db';
import {createPlan} from '../server/adminData';
import {getProfile,updateProfile} from '../server/investors';
import {addDays,platformDay,maximumWithdrawal,payoutObligation} from '../server/planPolicy';
import {reconcileDailyInterest,submitUsdPayout,settlePayout,runDailyEarningsJob} from '../server/financialEngine';
import {getPlatformSettings,savePlatformSettings} from '../server/platformSettings';
const users:string[]=[],plans:string[]=[],entries:string[]=[],wallets:string[]=[],machines:string[]=[];
const tag=crypto.randomUUID().slice(0,8),password='AuditOctober23!';
const api=async(method:string,path:string,body?:any,token?:string)=>{const response=await fetch('http://localhost:8787'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});return{status:response.status,body:await response.json() as any};};
test('October 23 requested changes: real database/API acceptance',async t=>{
 let original=await getPlatformSettings();
 try{
 await initSchema();await initFinancialSchema();
 const admin=await api('POST','/api/auth/login',{username:'Admin',password:'Admin'});assert.equal(admin.status,200);const adminToken=admin.body.token;
 const fixtures:any[]=[];
 for(const rate of [.5,1,1.25]){
  const plan=await createPlan({name:'Oct23 '+tag+' '+rate,tagline:'Disposable acceptance fixture',minInvestmentUsd:1,maxInvestmentUsd:100000,durationMonths:12,managementFeePercent:0,dailyReturnPercent:rate,payoutRequestDays:7,minimumThresholdPercent:0,withdrawalEntryFeePercent:0,payoutFrequency:'Daily',status:'Active',directReferralPercent:5});plans.push(plan.id);
  const user=await createUser({username:'oct23_'+tag+'_'+fixtures.length,password,name:'October 23 test investor '+fixtures.length,role:'investor'});users.push(user.id);
  const join=addDays(platformDay(),-4);
  await updateProfile(user.id,{plan:plan.name,kycStatus:'Verified',accountStatus:'Active',kycApprovedAt:join+'T00:00:00Z',totalInvestmentUsd:10000});
  const login=await api('POST','/api/auth/login',{username:user.username,password});assert.equal(login.status,200);fixtures.push({user,plan,rate,join,token:login.body.token});
 }
 await t.test('three investors receive exactly four daily USD credits at India midnight, never before',async()=>{
  for(const f of fixtures){
   const midnight=(n:number)=>new Date(addDays(f.join,n-1)+'T18:30:00Z');
   assert.equal(platformDay(midnight(1)) ,addDays(f.join,1));
   assert.equal(await reconcileDailyInterest({investorUserId:f.user.id,now:midnight(0)}),0);
   for(let day=1;day<=4;day++)assert.equal(await reconcileDailyInterest({investorUserId:f.user.id,now:midnight(day)}),1);
   assert.equal(await reconcileDailyInterest({investorUserId:f.user.id,now:midnight(4)}),0);
   assert.equal((await getProfile(f.user.id))!.usdWalletBalance,10000*f.rate/100*4);
   const [rows]=await pool.query<any[]>('SELECT COUNT(*) n,SUM(amount_usd) usd,SUM(amount_btc) btc FROM daily_interest_credits WHERE investor_user_id=?',[f.user.id]);
   assert.equal(rows[0].n,4);assert.equal(Number(rows[0].usd),10000*f.rate/100*4);assert.equal(Number(rows[0].btc),0);
  }
 });
 await t.test('payout obligation retains 30 days of earnings, with exact-boundary settlement and no duplicate debit',async()=>{
  assert.equal(payoutObligation(10000,.5),1500);assert.equal(maximumWithdrawal(10000,2000,.5),500);assert.equal(maximumWithdrawal(10000,1499,.5),0);
  const f=fixtures[0];await pool.query('UPDATE investor_profiles SET usd_wallet_balance=2000,kyc_approved_at=? WHERE user_id=?',[addDays(platformDay(),-8)+' 00:00:00',f.user.id]);
  const request=(amountUsd:number)=>submitUsdPayout({investorUserId:f.user.id,amountUsd,destination:'Test USD bank destination'});
  await assert.rejects(request(500.01),/30-day/);const id=await request(500);
  await Promise.all([settlePayout(id,'Completed','QA'),settlePayout(id,'Completed','QA')]);assert.equal((await getProfile(f.user.id))!.usdWalletBalance,1500);
  await settlePayout(id,'Rejected','QA reversal');assert.equal((await getProfile(f.user.id))!.usdWalletBalance,2000);
 });
 await t.test('company wallets can be created, fully edited, restricted and deleted; invalid balance rejected',async()=>{
  const created=await api('POST','/api/admin/wallets',{walletName:'QA wallet '+tag,currency:'BTC',balance:1,type:'Treasury'},adminToken);assert.equal(created.status,201);const id=created.body.wallet.id;wallets.push(id);
  assert.equal((await api('PUT','/api/admin/wallets/'+id,{walletName:'Renamed '+tag,address:'QA only',status:'Restricted',requiresMultisig:true},adminToken)).status,200);
  const list=await api('GET','/api/admin/wallets',undefined,adminToken);const row=list.body.wallets.find((w:any)=>w.id===id);assert.equal(row.status,'Restricted');assert.equal(row.address,'QA only');
  assert.equal((await api('PUT','/api/admin/wallets/'+id,{balance:-1},adminToken)).status,400);
  assert.equal((await api('DELETE','/api/admin/wallets/'+id,undefined,fixtures[0].token)).status,403);
  assert.equal((await api('DELETE','/api/admin/wallets/'+id,undefined,adminToken)).status,200);
 });
 await t.test('text and image ticket reaches admin, admin replies with image, other investors are denied',async()=>{
  const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
  const f=fixtures[0];const created=await api('POST','/api/investor/tickets',{subject:'QA image '+tag,category:'Technical issue',message:'Screenshot of my issue',imageData:image},f.token);assert.equal(created.status,201);const id=created.body.ticket.id;
  const inbox=await api('GET','/api/admin/tickets',undefined,adminToken);assert.equal(inbox.body.tickets.find((x:any)=>x.id===id).messages[0].imageData,image);
  assert.equal((await api('POST','/api/investor/tickets/'+id+'/messages',{message:'Not my ticket'},fixtures[1].token)).status,403);
  const reply=await api('POST','/api/admin/tickets/'+id+'/messages',{message:'Admin screenshot response',imageData:image},adminToken);assert.equal(reply.status,201);
  const own=await api('GET','/api/investor/tickets',undefined,f.token);assert.equal(own.body.tickets.find((x:any)=>x.id===id).messages.length,2);
  const others=await api('GET','/api/investor/tickets',undefined,fixtures[1].token);assert.ok(!others.body.tickets.some((x:any)=>x.id===id));
  assert.equal((await api('POST','/api/investor/tickets',{subject:'Unsafe',message:'x',imageData:'data:image/svg+xml;base64,abcd'},f.token)).status,400);
 });
 await t.test('machine readings drive online count, hashrate and uptime without counting offline hashrate',async()=>{
  const before=(await api('GET','/api/operating-metrics',undefined,adminToken)).body.metrics;
  for(const [status,hashrateTh,uptimePercent] of [['Online',100,99],['Offline',500,50]] as const){const r=await api('POST','/api/admin/machines',{model:'QA machine '+tag,status,hashrateTh,uptimePercent,powerDrawWatts:3000},adminToken);assert.equal(r.status,201);machines.push(r.body.machine.id);}
  const after=(await api('GET','/api/operating-metrics',undefined,fixtures[0].token)).body.metrics;
  assert.equal(after.totalMiners-before.totalMiners,2);assert.equal(after.minersOnline-before.minersOnline,1);assert.ok(Math.abs(after.miningHashratePH-before.miningHashratePH-.1)<1e-10);
  assert.ok(Math.abs(after.miningUptimePercent-(before.miningUptimePercent*before.totalMiners+149)/(before.totalMiners+2))<.001);
  assert.equal((await api('POST','/api/admin/machines',{model:'Invalid '+tag,uptimePercent:101},adminToken)).status,400);
 });
 await t.test('real operating records drive revenue, OPEX, net revenue and BTC production',async()=>{
  const before=(await api('GET','/api/operating-metrics',undefined,adminToken)).body.metrics;
  for(const [kind,amount] of [['Revenue USD',100],['OPEX USD',40],['Production BTC',.001]] as const){const r=await api('POST','/api/admin/operating-entries',{kind,amount,entryDay:platformDay(),note:'Disposable QA reference '+tag},adminToken);assert.equal(r.status,201);entries.push(r.body.id);}
  const after=(await api('GET','/api/operating-metrics',undefined,fixtures[0].token)).body.metrics;
  assert.equal(after.monthlyRevenueUsd-before.monthlyRevenueUsd,100);assert.equal(after.monthlyCostUsd-before.monthlyCostUsd,40);assert.equal(after.netProfitUsd-before.netProfitUsd,60);assert.ok(Math.abs(after.totalBtcMined-before.totalBtcMined-.001)<1e-10);
  assert.equal((await api('POST','/api/admin/operating-entries',{kind:'OPEX USD',amount:2,entryDay:platformDay(),note:'x'},fixtures[0].token)).status,403);
 });
 await t.test('settings persist, validate and enforce maintenance and daily-earnings switches; job status is recorded',async()=>{
  assert.equal((await api('PUT','/api/admin/platform-settings',{electricityTariffPerKwh:.08,autoCalculateDaily:false},adminToken)).status,200);
  assert.equal((await api('GET','/api/admin/platform-settings',undefined,adminToken)).body.settings.electricityTariffPerKwh,.08);
  assert.equal(await runDailyEarningsJob('acceptance-test',{investorUserId:fixtures[0].user.id}),0);
  const history=(await api('GET','/api/admin/platform-settings',undefined,adminToken)).body;assert.equal(history.timezone,'Asia/Kolkata');assert.ok(history.runs.some((r:any)=>r.source==='acceptance-test'&&r.status==='Disabled'));
  assert.equal((await api('PUT','/api/admin/platform-settings',{electricityTariffPerKwh:-1},adminToken)).status,400);
  assert.equal((await api('PUT','/api/admin/platform-settings',{maintenanceMode:true},adminToken)).status,200);
  assert.equal((await api('GET','/api/investor/profile',undefined,fixtures[0].token)).status,503);
  assert.equal((await api('GET','/api/admin/platform-settings',undefined,adminToken)).status,200);
  await savePlatformSettings(original);
 });
 await t.test('public content and removed menus no longer include the requested items',()=>{
  for(const p of ['src/data/companyData.ts','src/components/Footer.tsx','src/components/AboutSection.tsx','src/components/LeadershipSection.tsx','src/views/LeadershipPage.tsx'])assert.doesNotMatch(fs.readFileSync(p,'utf8'),/Rayees Ahmad Bhat|Managing Director/);
  assert.doesNotMatch(fs.readFileSync('src/components/Navbar.tsx','utf8'),/Contact Us/);assert.match(fs.readFileSync('src/components/Footer.tsx','utf8'),/2025/);
  assert.doesNotMatch(fs.readFileSync('src/components/admin/AdminSidebar.tsx','utf8'),/label: 'Contracts & Vault'/);
  assert.doesNotMatch(fs.readFileSync('src/components/admin/AdminInvestorsView.tsx','utf8'),/>Total BTC Allocated<|>Mining Share %<|>BTC Mined</);
 });
 }finally{
  await savePlatformSettings(original);
  for(const id of machines)await pool.query('DELETE FROM mining_machines WHERE id=?',[id]);
  for(const id of entries)await pool.query('DELETE FROM operating_entries WHERE id=?',[id]);
  for(const id of wallets)await pool.query('DELETE FROM company_wallets WHERE id=?',[id]);
  for(const id of users)await pool.query('DELETE FROM users WHERE id=?',[id]);
  for(const id of plans)await pool.query('DELETE FROM investment_plans WHERE id=?',[id]);
  await pool.end();
 }
});
