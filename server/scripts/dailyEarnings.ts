import 'dotenv/config';
import {pool,initSchema} from '../database';
import {initFinancialSchema} from '../financialSchema';
import {runDailyEarningsJob} from '../financialEngine';
try { await initSchema();await initFinancialSchema();const credits=await runDailyEarningsJob('server-cron');console.log(new Date().toISOString()+' Daily earnings credits: '+credits); }
catch(err){console.error(err);process.exitCode=1;} finally {await pool.end();}
