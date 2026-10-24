import test from 'node:test';
import assert from 'node:assert/strict';
import {parseAdminAmount} from '../src/lib/adminAmount';

test('admin amounts accept plain and formatted USD without losing the balance',()=>{
 for(const value of [10000,'10000','10,000','$10,000.00',' 10,000.00 ']) assert.equal(parseAdminAmount(value,'Investment'),10000);
 assert.equal(parseAdminAmount('0','Investment'),0);
 assert.equal(parseAdminAmount('10,000.25','Portfolio'),10000.25);
});
test('invalid admin amounts are rejected instead of saved as zero',()=>{
 for(const value of ['',undefined,null,'abc','10,00','-100','Infinity','1e4']) assert.throws(()=>parseAdminAmount(value,'Investment'),/Investment/);
});
