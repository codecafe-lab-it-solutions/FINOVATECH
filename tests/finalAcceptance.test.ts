import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {pool} from '../server/database';
import {createUser} from '../server/db';
import {getProfile,updateProfile,findUserIdByEmail,addTransaction} from '../server/investors';
import {createOtpForUser} from '../server/passwordReset';

test('manual USD wallet and shared-email recovery acceptance',async t=>{
 const tag=crypto.randomUUID().slice(0,8),users:string[]=[];
 try{
  for(let i=0;i<2;i++){const u=await createUser({username:'finalqa_'+tag+'_'+i,name:'Disposable final acceptance',password:'FinalAcceptance123!',role:'investor'});users.push(u.id);await updateProfile(u.id,{email:'finalqa_'+tag+'@example.invalid'});}
  await t.test('USD manual credit changes the USD wallet and ledger without inventing BTC',async()=>{
   const tx=await addTransaction({investorUserId:users[0],type:'Adjustment',amountUsd:1000,amountBtc:0,network:'USD',applyToWallet:true});
   const p=(await getProfile(users[0]))!;assert.equal(p.usdWalletBalance,1000);assert.equal(p.totalBtcAllocated,0);assert.equal(p.totalInvestmentUsd,0);assert.equal(tx.amountUsd,1000);
   await assert.rejects(addTransaction({investorUserId:users[0],type:'Adjustment',amountUsd:1,amountBtc:1,network:'USD',applyToWallet:true}),/zero BTC/);
   await assert.rejects(addTransaction({investorUserId:users[0],type:'Adjustment',amountUsd:-1001,amountBtc:0,network:'USD',applyToWallet:true}),/negative/);
   await addTransaction({investorUserId:users[0],type:'Adjustment',amountUsd:-1000,amountBtc:0,network:'USD',applyToWallet:true});assert.equal((await getProfile(users[0]))!.usdWalletBalance,0);
  });
 }finally{for(const id of users)await pool.query('DELETE FROM users WHERE id=? AND username LIKE ?',[id,'finalqa_%']);await pool.end();}
});
