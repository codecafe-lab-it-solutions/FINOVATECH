import 'dotenv/config';
import fs from 'node:fs';
import { mailSender, verifyMailConnection } from '../server/mailer';
const timer=setTimeout(()=>{
  const result={smtpVerified:false,sender:mailSender,error:'SMTP verification exceeded 20 seconds; no email was sent.'};
  fs.writeFileSync('docs/qa-smtp-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));process.exit(1);
},20000);
try{
  const result={smtpVerified:await verifyMailConnection(),sender:mailSender,emailSent:false};
  fs.writeFileSync('docs/qa-smtp-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));clearTimeout(timer);process.exit(0);
}catch(error){
  const result={smtpVerified:false,sender:mailSender,error:error instanceof Error?error.message:String(error),emailSent:false};
  fs.writeFileSync('docs/qa-smtp-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));clearTimeout(timer);process.exit(1);
}
