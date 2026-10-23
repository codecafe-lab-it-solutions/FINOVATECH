import 'dotenv/config';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { after, test } from 'node:test';
import { pool } from '../server/database';
import { createUser } from '../server/db';
import { createPlan, deletePlan, listPlans } from '../server/adminData';
import { getProfile, updateProfile, addTransaction } from '../server/investors';
import { reconcileDailyInterest, submitPayout, submitUsdPayout, settlePayout } from '../server/financialEngine';
import { createOtpForUser } from '../server/passwordReset';
import { createDepositRequest } from '../server/deposits';
import { listEarnings, listMonthlyStatements, getReferralStats } from '../server/investorExtras';
import { platformDay, addDays, maturityDay } from '../server/planPolicy';

const stamp = crypto.randomUUID().slice(0,8), users:string[]=[], plans:string[]=[];
let schedulerIsolation: Awaited<ReturnType<typeof pool.getConnection>> | undefined;
const today = platformDay(), price = 100000;
const market = async () => ({usd:price,change24hPercent:0,difficultyT:0,updatedAt:new Date().toISOString()});
const terms = {name:`Full QA ${stamp}`,tagline:'Disposable system audit',minInvestmentUsd:100,maxInvestmentUsd:100000,durationMonths:12,managementFeePercent:6.5,dailyReturnPercent:0.5,payoutRequestDays:15,minimumThresholdPercent:2,withdrawalEntryFeePercent:1.25,payoutFrequency:'Monthly' as const,status:'Active' as const};
const req = async (method:string,path:string,body?:object,token?:string) => {
  const r=await fetch('http://localhost:8787'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});
  return {status:r.status,body:await r.json() as any};
};
async function fixture(overrides:Record<string,any>={}) {
  const plan=await createPlan({...terms,name:`${terms.name} ${plans.length}`,...overrides});plans.push(plan.id);
  const u=await createUser({username:`finova_test_full_${stamp}_${users.length}`,password:'FullAudit123!',name:'Disposable full system audit',role:'investor'});users.push(u.id);
  await updateProfile(u.id,{plan:plan.name,kycStatus:'Verified',accountStatus:'Active',kycApprovedAt:addDays(today,-60)+'T00:00:00Z',totalInvestmentUsd:10000,totalBtcAllocated:0.02,currentPortfolioValueUsd:2000,payoutNetwork:'BTC'});
  return {u,plan};
}
after(async()=>{try{for(const id of users)await pool.query("DELETE FROM users WHERE id=? AND username LIKE 'finova_test_full_%'",[id]);for(const id of plans)await pool.query('DELETE FROM investment_plans WHERE id=? AND name LIKE ?',[id,`%${stamp}%`]);}finally{if(schedulerIsolation){await schedulerIsolation.query("SELECT RELEASE_LOCK('finova_daily_earnings_job')");schedulerIsolation.release();}await pool.end();}});

test('full admin/investor boundary and lifecycle audit',async t=>{
  // The running localhost API must not reconcile deliberately historical
  // fixtures halfway through a fixed-balance assertion. Direct scoped
  // reconciliation remains exercised below; timer tests live in a separate suite.
  schedulerIsolation=await pool.getConnection();
  const [isolationRows]=await schedulerIsolation.query<any[]>("SELECT GET_LOCK('finova_daily_earnings_job',10) acquired");
  assert.equal(Number(isolationRows[0].acquired),1);
  const admin=await req('POST','/api/auth/login',{username:'Admin',password:'Admin'});assert.equal(admin.status,200);const adminToken=admin.body.token;
  const {u,plan}=await fixture();
  const login=await req('POST','/api/auth/login',{username:u.username,password:'FullAudit123!'});assert.equal(login.status,200);const token=login.body.token;
  await t.test('withdrawal OTP endpoint clearly rejects an investor without an email address',async()=>{
    const r=await req('POST','/api/investor/payouts/request-otp',{},token);assert.equal(r.status,400);assert.match(r.body.error,/Add an email address/);
  });
  await t.test('registration API validates inputs and rejects duplicate usernames without sending welcome mail',async()=>{
    for(const body of [{username:'a',name:'QA',password:'12345',email:'qa@example.invalid'},{username:'valid-qa',name:'QA',password:'123',email:'qa@example.invalid'},{username:'valid-qa',name:'QA',password:'12345',email:'invalid'}])assert.equal((await req('POST','/api/auth/register',body)).status,400);
    assert.equal((await req('POST','/api/auth/register',{username:u.username,name:'QA duplicate',password:'12345',email:'qa@example.invalid'})).status,409);
  });
  await t.test('admin and investor read endpoints return live data without server errors',async()=>{
    for(const path of ['/api/admin/investors','/api/admin/plans','/api/admin/payouts','/api/admin/transactions','/api/admin/deposit-requests','/api/admin/documents','/api/admin/wallets','/api/admin/tickets','/api/admin/machines'])assert.equal((await req('GET',path,undefined,adminToken)).status,200,path);
    for(const path of ['/api/investor/profile','/api/investor/transactions','/api/investor/payouts','/api/investor/earnings','/api/investor/statements','/api/investor/notifications','/api/investor/sessions','/api/investor/tickets','/api/investor/referrals','/api/investor/machines','/api/investor/documents','/api/withdrawal-settings'])assert.equal((await req('GET',path,undefined,token)).status,200,path);
  });
  await t.test('admin mutation endpoints reject investor and anonymous callers',async()=>{
    for(const [method,path,body] of [['PUT',`/api/admin/investors/${u.id}`,{totalBtcAllocated:999}],['POST',`/api/admin/investors/${u.id}/transactions`,{type:'Deposit',amountBtc:1,amountUsd:100}],['PATCH','/api/admin/payouts/missing',{status:'Completed'}],['PUT','/api/admin/withdrawal-settings',{withdrawalsEnabled:false}]] as const){assert.equal((await req(method,path,body,token)).status,403,path);assert.equal((await req(method,path,body)).status,401,path);}
  });
  await t.test('investor profile cannot self-approve KYC, edit principal, IDs, dates or plan',async()=>{
    const before=(await getProfile(u.id))!;
    const r=await req('PATCH','/api/investor/profile',{kycStatus:'Pending',kycApprovedAt:'2020-01-01',totalInvestmentUsd:999999,totalBtcAllocated:999,plan:'unauthorized',agreementNumber:'overwrite',investorId:'FINOVA1',phone:'QA phone'},token);assert.equal(r.status,200);
    const after=(await getProfile(u.id))!;for(const key of ['kycStatus','kycApprovedAt','totalInvestmentUsd','totalBtcAllocated','plan','agreementNumber','investorId'] as const)assert.equal(after[key],before[key],key);assert.equal(after.phone,'QA phone');
  });
  await t.test('admin validates negative balances, future approval and malformed lock dates',async()=>{
    for(const body of [{totalBtcAllocated:-1},{totalInvestmentUsd:-1},{nextWithdrawalDate:'not-a-date'}])assert.equal((await req('PUT',`/api/admin/investors/${u.id}`,body,adminToken)).status,400);
  });
  await t.test('all four plan percentages/day fields reject invalid updates and preserve existing values',async()=>{
    for(const body of [{dailyReturnPercent:101},{minimumThresholdPercent:-1},{withdrawalEntryFeePercent:101},{payoutRequestDays:0},{payoutRequestDays:1.5},{durationMonths:0},{minInvestmentUsd:200000},{payoutFrequency:'Bad'},{status:'Bad'}])assert.equal((await req('PUT',`/api/admin/plans/${plan.id}`,body,adminToken)).status,400,JSON.stringify(body));
    const saved=(await listPlans()).find(p=>p.id===plan.id)!;assert.equal(saved.dailyReturnPercent,.5);assert.equal(saved.payoutRequestDays,15);
  });
  await t.test('funded investment cannot be silently reassigned to different agreed terms',async()=>{
    const other=await createPlan({...terms,name:`${terms.name} replacement`});plans.push(other.id);
    assert.equal((await req('PUT',`/api/admin/investors/${u.id}`,{plan:other.name},adminToken)).status,400);
    assert.equal((await getProfile(u.id))?.planId,plan.id);
  });
  await t.test('referral hierarchy uses referred investors own KYC joining date, never account registration',async()=>{
    const parent=(await getProfile(u.id))!;
    const child=await createUser({username:`finova_test_full_${stamp}_referral`,password:'FullAudit123!',name:'Disposable referral child',role:'investor',referredByCode:parent.referralCode});users.push(child.id);
    await pool.query('UPDATE users SET created_at=? WHERE id=?',[addDays(today,-20)+' 00:00:00',child.id]);
    let stats=await getReferralStats(u.id);assert.equal(stats.referredUsers.find(r=>r.username===child.username)?.joinedDate,'Awaiting KYC approval');
    await updateProfile(child.id,{kycStatus:'Verified',accountStatus:'Active'});stats=await getReferralStats(u.id);assert.equal(stats.referredUsers.find(r=>r.username===child.username)?.joinedDate,today);
    assert.equal((await getProfile(child.id))?.registrationDate,addDays(today,-20));
  });
  const request=(id:string,amount=.005)=>submitPayout({investorUserId:id,amountBtc:amount,destinationWallet:'bc1q000000000000000000000000000000000000000',network:'BTC'},price);
  await t.test('exact $500 maximum from $2000 wallet/$10000 principal/0.5% daily monthly obligation succeeds without entry fee',async()=>{
    const original=(await req('GET','/api/withdrawal-settings',undefined,adminToken)).body.settings;
    try {
      await req('PUT','/api/admin/withdrawal-settings',{maxWithdrawalUsd:2000},adminToken);
      const id=await request(u.id);await settlePayout(id,'Completed','QA exact threshold');const p=(await getProfile(u.id))!;assert.equal(p.totalBtcAllocated,.015);assert.equal(p.currentPortfolioValueUsd,1500);await settlePayout(id,'Rejected','QA restore');assert.equal((await getProfile(u.id))?.totalBtcAllocated,.02);
    } finally { await req('PUT','/api/admin/withdrawal-settings',{maxWithdrawalUsd:original.maxWithdrawalUsd},adminToken); }
  });
  await t.test('zero, negative, over-precision amounts and missing destinations are rejected by HTTP',async()=>{
    for(const body of [{amountBtc:0},{amountBtc:-1},{amountBtc:.000000001},{amountBtc:'1'},{amountBtc:.001,destinationWallet:''},{amountBtc:.001,destinationWallet:'abc'},{amountBtc:.001,currency:'EUR'}]){
      const r=await req('POST','/api/investor/payouts',{destinationWallet:'test-wallet',otp:'123456',...body},token);assert.equal(r.status,400,JSON.stringify(body));
    }
  });
  await t.test('pending, unassigned and undated KYC states cannot withdraw or receive interest',async()=>{
    for(const state of ['pending','unassigned','undated','review']){
      const member=await fixture();
      if(state==='pending')await updateProfile(member.u.id,{kycStatus:'Pending'});
      if(state==='unassigned')await pool.query('UPDATE investor_profiles SET plan_terms=NULL,plan_id=NULL WHERE user_id=?',[member.u.id]);
      if(state==='undated')await pool.query('UPDATE investor_profiles SET kyc_approved_at=NULL WHERE user_id=?',[member.u.id]);
      if(state==='review')await updateProfile(member.u.id,{accountStatus:'Under Review'});
      await assert.rejects(request(member.u.id,.001),/verified KYC|assigned investment plan/);
      assert.equal(await reconcileDailyInterest({investorUserId:member.u.id,getMarket:market}),0,state);
    }
  });
  for(const days of [5,7,15,30,45])await t.test(`first and subsequent withdrawal boundary: plan ${days} days, effective ${Math.max(7,days)} days`,async()=>{
    const member=await fixture({payoutRequestDays:days,dailyReturnPercent:0});const gap=Math.max(7,days);
    await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[addDays(today,-gap+1)+' 00:00:00',member.u.id]);await assert.rejects(request(member.u.id,.0001),/Next eligible/);
    await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[addDays(today,-gap)+' 00:00:00',member.u.id]);const id=await request(member.u.id,.0001);await assert.rejects(request(member.u.id,.0001),/Next eligible/);
    await settlePayout(id,'Rejected','QA rejected still establishes request date');
    await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[addDays(today,-2*gap)+' 00:00:00',member.u.id]);
    await pool.query('UPDATE payouts SET requested_at=? WHERE id=?',[addDays(today,-gap+1)+' 00:00:00',id]);await assert.rejects(request(member.u.id,.0001),/Next eligible/);
    await pool.query('UPDATE payouts SET requested_at=? WHERE id=?',[addDays(today,-gap)+' 00:00:00',id]);assert.ok(await request(member.u.id,.0001));
  });
  await t.test('manual future lock blocks and clearing it restores plan-based eligibility',async()=>{
    const member=await fixture();await updateProfile(member.u.id,{nextWithdrawalDate:addDays(today,3)});await assert.rejects(request(member.u.id,.001),/Next eligible/);await updateProfile(member.u.id,{nextWithdrawalDate:null});assert.ok(await request(member.u.id,.001));
  });
  await t.test('global disable and max USD limit enforce server policy; original settings restored',async()=>{
    const original=(await req('GET','/api/withdrawal-settings',undefined,adminToken)).body.settings;const member=await fixture();
    try{
      assert.equal((await req('PUT','/api/admin/withdrawal-settings',{withdrawalsEnabled:false},adminToken)).status,200);await assert.rejects(request(member.u.id,.001),/disabled/);
      await req('PUT','/api/admin/withdrawal-settings',{withdrawalsEnabled:true,maxWithdrawalUsd:50},adminToken);await assert.rejects(request(member.u.id,.00051),/transaction limit/);assert.ok(await request(member.u.id,.0005));
    }finally{assert.equal((await req('PUT','/api/admin/withdrawal-settings',{withdrawalsEnabled:original.withdrawalsEnabled,maxWithdrawalUsd:original.maxWithdrawalUsd},adminToken)).status,200);}
  });
  await t.test('other investments requests do not affect current investment eligibility',async()=>{
    const member=await fixture();await pool.query("INSERT INTO payouts(id,investor_user_id,investment_id,amount_btc,amount_usd,destination_wallet,status,requested_at) VALUES(?,?,?,1,100000,'test-wallet','Requested',UTC_TIMESTAMP())",[crypto.randomUUID(),member.u.id,crypto.randomUUID()]);const id=await request(member.u.id,.0001);await settlePayout(id,'Completed','QA separate investment');assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.0199);
  });
  await t.test('pending requests reserve wallet funds and completion honors competing reservations',async()=>{
    const member=await fixture();const profile=(await getProfile(member.u.id))!;
    const reserved=crypto.randomUUID();await pool.query("INSERT INTO payouts(id,investor_user_id,investment_id,amount_btc,amount_usd,destination_wallet,status,requested_at) VALUES(?,?,?,.004,400,'test-wallet','Processing',?)",[reserved,member.u.id,profile.investmentId,addDays(today,-20)+' 00:00:00']);
    await assert.rejects(request(member.u.id,.00101),/Maximum eligible/);const id=await request(member.u.id,.001);await settlePayout(id,'Completed','QA reserved');assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.019);
  });
  await t.test('daily interest stops at maturity, and reruns after maturity do not add more credits',async()=>{
    const member=await fixture({durationMonths:1});const join=addDays(today,-60),maturity=maturityDay(join,1);
    await pool.query('UPDATE investment_capital_history SET effective_day=? WHERE investor_user_id=?',[join,member.u.id]);
    const count=await reconcileDailyInterest({investorUserId:member.u.id,getMarket:market});const days=Math.round((Date.parse(maturity)-Date.parse(join))/86400000);assert.equal(count,days);
    assert.equal(await reconcileDailyInterest({investorUserId:member.u.id,getMarket:market,now:new Date(addDays(today,10)+'T12:00:00Z')}),0);
    const [r]=await pool.query<any[]>('SELECT MAX(eligible_day) AS last,SUM(amount_usd) AS usd FROM daily_interest_credits WHERE investor_user_id=?',[member.u.id]);assert.equal(r[0].last,addDays(maturity,-1));assert.equal(Number(r[0].usd),days*50);
  });
  await t.test('missing principal history is not guessed or backfilled with current principal',async()=>{
    const member=await fixture();await pool.query('DELETE FROM investment_capital_history WHERE investor_user_id=?',[member.u.id]);assert.equal(await reconcileDailyInterest({investorUserId:member.u.id,getMarket:market}),0);assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.02);
  });
  await t.test('eligible USD earnings credit during BTC provider outages without requesting a quote',async()=>{
    const member=await fixture();const join=addDays(today,-1);await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[join+' 00:00:00',member.u.id]);await pool.query('UPDATE investment_capital_history SET effective_day=? WHERE investor_user_id=?',[join,member.u.id]);
    let calls=0; const getMarket=async()=>{calls++;throw Error('BTC provider unavailable');};
    assert.equal(await reconcileDailyInterest({investorUserId:member.u.id,getMarket}),1);assert.equal(await reconcileDailyInterest({investorUserId:member.u.id,getMarket}),0);assert.equal(calls,0);assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.02);assert.equal((await getProfile(member.u.id))?.usdWalletBalance,50);
  });
  await t.test('different daily rates credit exact dollar earnings without BTC conversion',async()=>{
    for(const rate of [.5,1,1.25,2.75]){
      const member=await fixture({dailyReturnPercent:rate});const join=addDays(today,-1);await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[join+' 00:00:00',member.u.id]);await pool.query('UPDATE investment_capital_history SET effective_day=? WHERE investor_user_id=?',[join,member.u.id]);
      assert.equal(await reconcileDailyInterest({investorUserId:member.u.id,getMarket:async()=>({...await market(),usd:83000})}),1);const [r]=await pool.query<any[]>('SELECT amount_usd,amount_btc,btc_price_usd,currency FROM daily_interest_credits WHERE investor_user_id=?',[member.u.id]);assert.equal(Number(r[0].amount_usd),10000*rate/100);assert.equal(Number(r[0].amount_btc),0);assert.equal(r[0].currency,'USD');assert.equal(Number(r[0].btc_price_usd),0);assert.equal((await getProfile(member.u.id))?.usdWalletBalance,10000*rate/100);
    }
  });
  await t.test('admin transaction credit and investor ledger agree; mining credit does not increase principal',async()=>{
    const member=await fixture();const before=(await getProfile(member.u.id))!;
    const result=await req('POST',`/api/admin/investors/${member.u.id}/transactions`,{type:'Mining Credit',amountBtc:.001,amountUsd:100,note:'Disposable QA credit',network:'BTC'},adminToken);assert.equal(result.status,201);
    const p=(await getProfile(member.u.id))!;assert.equal(p.totalInvestmentUsd,before.totalInvestmentUsd);assert.equal(p.totalBtcAllocated,.021);assert.equal(p.btcMined,.001);
  });
  await t.test('deposit approval credits BTC/principal once; concurrent duplicate review cannot duplicate funds',async()=>{
    const member=await fixture();
    const deposit=await createDepositRequest({investorUserId:member.u.id,amountUsd:100,depositAddress:'QA simulated deposit address',network:'TRC20',proofFilename:'QA-simulated-no-real-payment.png'});
    const approve=()=>req('PATCH',`/api/admin/deposit-requests/${deposit.id}`,{status:'Approved',adminNote:'SIMULATED local audit only; no payment'},adminToken);
    const results=await Promise.all([approve(),approve()]);assert.equal(results.filter(r=>r.status===200).length,1,JSON.stringify(results));
    const p=(await getProfile(member.u.id))!;assert.equal(p.totalInvestmentUsd,10100);assert.ok(p.totalBtcAllocated>.02);
    const [ledger]=await pool.query<any[]>("SELECT COUNT(*) AS n,SUM(amount_usd) AS usd FROM wallet_transactions WHERE investor_user_id=? AND type='Deposit'",[member.u.id]);assert.equal(ledger[0].n,1);assert.equal(Number(ledger[0].usd),100);
    assert.equal((await approve()).status,400);
  });
  await t.test('deposit rejection leaves principal and BTC unchanged and is visible to owner only',async()=>{
    const member=await fixture();const deposit=await createDepositRequest({investorUserId:member.u.id,amountUsd:100,depositAddress:'QA only',network:'TRC20',proofFilename:'QA-only.png'});
    const rejected=await req('PATCH',`/api/admin/deposit-requests/${deposit.id}`,{status:'Rejected',adminNote:'QA rejected proof'},adminToken);assert.equal(rejected.status,200);
    assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.02);assert.equal((await getProfile(member.u.id))?.totalInvestmentUsd,10000);
    assert.equal((await req('GET',`/api/deposit-proof/${deposit.id}`,undefined,token)).status,403);
  });
  await t.test('zero-return plan and missing principal never fabricate daily earnings',async()=>{
    const member=await fixture({dailyReturnPercent:0});assert.equal(await reconcileDailyInterest({investorUserId:member.u.id,getMarket:market}),0);assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.02);
    await updateProfile(member.u.id,{totalInvestmentUsd:0});assert.equal(await reconcileDailyInterest({investorUserId:member.u.id,getMarket:market}),0);
  });
  await t.test('parallel reconciliation attempts never duplicate eligible daily credits',async()=>{
    const member=await fixture();const join=addDays(today,-2);await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[join+' 00:00:00',member.u.id]);await pool.query('UPDATE investment_capital_history SET effective_day=? WHERE investor_user_id=?',[join,member.u.id]);
    const counts=await Promise.all([reconcileDailyInterest({investorUserId:member.u.id,getMarket:market}),reconcileDailyInterest({investorUserId:member.u.id,getMarket:market})]);assert.equal(counts.reduce((a,b)=>a+b,0),2);assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.02);assert.equal((await getProfile(member.u.id))?.usdWalletBalance,100);
  });
  await t.test('daily USD interest agrees across wallet, earnings log and monthly statement totals',async()=>{
    const member=await fixture();const join=addDays(today,-2);await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[join+' 00:00:00',member.u.id]);await pool.query('UPDATE investment_capital_history SET effective_day=? WHERE investor_user_id=?',[join,member.u.id]);
    assert.equal(await reconcileDailyInterest({investorUserId:member.u.id,getMarket:market}),2);
    const earnings=await listEarnings(member.u.id), statements=await listMonthlyStatements(member.u.id);assert.equal(earnings.reduce((s,e)=>s+e.amountUsd,0),100);assert.equal(statements.reduce((s,e)=>s+e.miningCreditsUsd,0),100);assert.equal(statements.reduce((s,e)=>s+e.miningCreditsBtc,0),0);assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.02);assert.equal((await getProfile(member.u.id))?.usdWalletBalance,100);
  });
  await t.test('existing BTC credits stay BTC and are not recredited when new days earn USD',async()=>{
    const member=await fixture();const profile=(await getProfile(member.u.id))!;const join=addDays(today,-2);
    await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[join+' 00:00:00',member.u.id]);await pool.query('UPDATE investment_capital_history SET effective_day=? WHERE investor_user_id=?',[join,member.u.id]);
    const id=crypto.randomUUID();await pool.query("INSERT INTO daily_interest_credits(id,investor_user_id,investment_id,eligible_day,amount_usd,amount_btc,btc_price_usd,created_at,currency) VALUES(?,?,?,?,50,.0005,100000,UTC_TIMESTAMP(),'BTC')",[id,member.u.id,profile.investmentId,join]);
    assert.equal(await reconcileDailyInterest({investorUserId:member.u.id}),1);assert.equal(await reconcileDailyInterest({investorUserId:member.u.id}),0);
    const [rows]=await pool.query<any[]>('SELECT currency,amount_btc,btc_price_usd FROM daily_interest_credits WHERE id=?',[id]);assert.equal(rows[0].currency,'BTC');assert.equal(Number(rows[0].amount_btc),.0005);assert.equal(Number(rows[0].btc_price_usd),100000);
    const after=(await getProfile(member.u.id))!;assert.equal(after.totalBtcAllocated,.02);assert.equal(after.usdWalletBalance,50);
  });
  await t.test('USD earnings to withdrawal to admin settlement/reversal preserve threshold and never debit BTC',async()=>{
    const member=await fixture();await pool.query('UPDATE investor_profiles SET usd_wallet_balance=1500 WHERE user_id=?',[member.u.id]);await pool.query('UPDATE investment_capital_history SET effective_day=? WHERE investor_user_id=?',[addDays(today,-3),member.u.id]);
    assert.equal(await reconcileDailyInterest({investorUserId:member.u.id}),3);assert.equal((await getProfile(member.u.id))?.usdWalletBalance,1650);
    const withdraw=(amountUsd:number)=>submitUsdPayout({investorUserId:member.u.id,amountUsd,destination:'QA dollar payment account'});
    await assert.rejects(withdraw(1651),/available USD|global USD transaction limit/);await assert.rejects(withdraw(150.01),/30-day/);await assert.rejects(withdraw(1.001),/two decimal/);
    const signed=await req('POST','/api/auth/login',{username:member.u.username,password:'FullAudit123!'});const memberToken=signed.body.token;
    const otp=await createOtpForUser(member.u.id,'withdrawal');const result=await req('POST','/api/investor/payouts',{currency:'USD',amountUsd:150,destinationWallet:'QA dollar payment account',otp},memberToken);assert.equal(result.status,201,result.body.error);assert.equal(result.body.payout.currency,'USD');assert.equal(result.body.payout.amountBtc,0);assert.equal(result.body.payout.amountUsd,150);
    for(let n=0;n<2;n++)assert.equal((await req('PATCH',`/api/admin/payouts/${result.body.payout.id}`,{status:'Completed'},adminToken)).status,200);
    assert.equal((await getProfile(member.u.id))?.usdWalletBalance,1500);assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.02);
    for(let n=0;n<2;n++)await req('PATCH',`/api/admin/payouts/${result.body.payout.id}`,{status:'Rejected'},adminToken);
    assert.equal((await getProfile(member.u.id))?.usdWalletBalance,1650);assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.02);
  });
  await t.test('USD withdrawals enforce first and subsequent 7/15/30/45-day boundaries',async()=>{
    for(const interval of [5,7,15,30,45]){
      const member=await fixture({payoutRequestDays:interval,dailyReturnPercent:0});const gap=Math.max(7,interval);await pool.query('UPDATE investor_profiles SET usd_wallet_balance=1000,kyc_approved_at=? WHERE user_id=?',[addDays(today,-gap+1)+' 00:00:00',member.u.id]);
      const withdraw=()=>submitUsdPayout({investorUserId:member.u.id,amountUsd:1,destination:'QA dollar payment account'});await assert.rejects(withdraw(),/Next eligible/);
      await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[addDays(today,-gap)+' 00:00:00',member.u.id]);const id=await withdraw();await assert.rejects(withdraw(),/Next eligible/);
      await settlePayout(id,'Rejected','QA interval');await pool.query('UPDATE investor_profiles SET kyc_approved_at=? WHERE user_id=?',[addDays(today,-2*gap)+' 00:00:00',member.u.id]);await pool.query('UPDATE payouts SET requested_at=? WHERE id=?',[addDays(today,-gap+1)+' 00:00:00',id]);await assert.rejects(withdraw(),/Next eligible/);
      await pool.query('UPDATE payouts SET requested_at=? WHERE id=?',[addDays(today,-gap)+' 00:00:00',id]);assert.ok(await withdraw());
    }
  });
  await t.test('BTC request HTTP/OTP/admin lifecycle records correct currency and debits once',async()=>{
    const member=await fixture();const signed=await req('POST','/api/auth/login',{username:member.u.username,password:'FullAudit123!'});const memberToken=signed.body.token;
    const quote=await req('GET','/api/market/btc-price');assert.equal(quote.status,200,'Live provider must be available for this HTTP test');
    const wrongPurpose=await createOtpForUser(member.u.id,'password-reset');const body={amountBtc:.001,destinationWallet:'bc1q000000000000000000000000000000000000000',network:'BTC'};
    assert.equal((await req('POST','/api/investor/payouts',{...body,otp:wrongPurpose},memberToken)).status,400);
    const otp=await createOtpForUser(member.u.id,'withdrawal');const created=await req('POST','/api/investor/payouts',{...body,otp},memberToken);assert.equal(created.status,201,created.body.error);const id=created.body.payout.id;assert.equal(created.body.payout.currency,'BTC');assert.equal(created.body.payout.network,'BTC');assert.equal(created.body.payout.amountBtc,.001);
    for(const status of ['Processing','Completed','Completed'])assert.equal((await req('PATCH',`/api/admin/payouts/${id}`,{status},adminToken)).status,200);
    const after=await req('GET','/api/investor/profile',undefined,memberToken);assert.equal(after.body.profile.totalBtcAllocated,.019);
    const payouts=await req('GET','/api/investor/payouts',undefined,memberToken);assert.equal(payouts.body.payouts.find((p:any)=>p.id===id).status,'Completed');
    assert.equal((await req('PATCH',`/api/admin/payouts/${id}`,{status:'Bad'},adminToken)).status,400);
    for(let i=0;i<2;i++)assert.equal((await req('PATCH',`/api/admin/payouts/${id}`,{status:'Rejected'},adminToken)).status,200);assert.equal((await getProfile(member.u.id))?.totalBtcAllocated,.02);
    assert.equal((await req('POST','/api/investor/payouts',{...body,otp},memberToken)).status,400);
  });
});
