import test from 'node:test';
import assert from 'node:assert/strict';
import {jwtSecret} from '../server/auth';
test('production refuses missing, short and placeholder session secrets',()=>{
 for(const JWT_SECRET of [undefined,'short','change-me-to-a-long-random-string','finovateck-dev-secret-change-me'])assert.throws(()=>jwtSecret({NODE_ENV:'production',JWT_SECRET}),/Production requires/);
 assert.equal(jwtSecret({NODE_ENV:'production',JWT_SECRET:'0a8e1099ee811256c45da30141c7db32d5408374'}),'0a8e1099ee811256c45da30141c7db32d5408374');
 assert.ok(jwtSecret({NODE_ENV:'development'}));
});
