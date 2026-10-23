import {PDFDocument, StandardFonts, rgb} from 'pdf-lib';
import type {InvestorUser} from '../types';

export async function investmentSummaryPdf(user: InvestorUser, principal: number): Promise<Uint8Array> {
 const pdf=await PDFDocument.create(),font=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 const page=pdf.addPage([595,842]),terms=user.planTerms,usd=(n:number)=>'USD '+n.toFixed(2);
 const lines=[['Investor',user.name],['Username',user.username],['Record ID',user.agreementNumber],['Plan',terms?.name||user.plan||'Not assigned'],['Principal',usd(principal)],['Joining date',user.joiningDate||'Awaiting approval'],['Daily return',terms?terms.dailyReturnPercent+'%':'Not assigned'],['Daily earnings',terms?usd(principal*terms.dailyReturnPercent/100):'Not assigned'],['30-day payout obligation',terms?usd(Math.round(principal*terms.dailyReturnPercent*30)/100):'Not assigned'],['Payout interval',terms?Math.max(7,terms.payoutRequestDays)+' days':'Not assigned'],['Duration',terms?terms.durationMonths+' months from joining date':'Not assigned'],['Management fee',terms?terms.managementFeePercent+'% (recorded term)':'Not assigned'],['Entry / withdrawal fee',terms?terms.withdrawalEntryFeePercent+'% (information only; no deduction)':'Not assigned'],['Earnings timezone',user.platformTimezone||'Asia/Kolkata']];
 page.drawText('FINOVATECK',{x:44,y:790,size:20,font:bold,color:rgb(.08,.13,.22)});
 page.drawText('Investment Terms Summary',{x:44,y:763,size:15,font:bold});
 page.drawText('Account record - unsigned summary',{x:44,y:742,size:10,font});
 let y=703;
 for(const [label,value] of lines){page.drawText(label,{x:44,y,size:10,font:bold});y-=17;let remaining=value.replace(/[^\x20-\x7e\xa0-\xff]/g,'?');while(remaining.length){let end=remaining.length;while(font.widthOfTextAtSize(remaining.slice(0,end),10)>505)end--;page.drawText(remaining.slice(0,end),{x:44,y,size:10,font});remaining=remaining.slice(end);y-=15;}y-=8;}
 page.drawText('Withdrawals require available funds, email verification and admin review.',{x:44,y:76,size:9,font});
 page.drawText('This summary is not a signed or stamped agreement and does not prove payment.',{x:44,y:60,size:9,font});
 pdf.setTitle('FINOVATECK Investment Terms Summary');return pdf.save();
}
