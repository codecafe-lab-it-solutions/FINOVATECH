import React, {useState} from 'react';
import {Download, Eye, X} from 'lucide-react';
import {PlanConditions} from './PlanConditions';
import {investmentSummaryPdf} from '../../lib/investmentSummaryPdf';
import type {InvestorUser, InvestorOverviewMetrics} from '../../types';

export const InvestmentDetailsTab: React.FC<{user:InvestorUser;metrics:InvestorOverviewMetrics}> = ({user,metrics})=>{
 const [showSummary,setShowSummary]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const download=async()=>{setBusy(true);setError('');try{
  const bytes=await investmentSummaryPdf(user,metrics.totalInvestmentUsd);
  const url=URL.createObjectURL(new Blob([new Uint8Array(bytes)],{type:'application/pdf'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download=`${user.username}-investment-terms.pdf`;anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
 }catch{setError('Could not create the summary PDF. Please try again.');}finally{setBusy(false);}};
 return <div className="space-y-6">
  <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white space-y-4">
   <h2 className="text-xl font-bold">Investment Terms & Documents</h2>
   <p className="text-xs text-gray-400">Record ID: {user.agreementNumber}</p>
   <p className="text-sm text-gray-400">These are your saved investment terms. The downloadable summary is unsigned. A signed agreement must be supplied separately by the company.</p>
   <div className="flex flex-wrap gap-3">
    <button onClick={()=>setShowSummary(true)} className="px-4 py-3 rounded-xl bg-gray-800 flex items-center gap-2"><Eye size={16}/>View Investment Summary</button>
    <button disabled={busy} onClick={download} className="px-4 py-3 rounded-xl bg-[#F7931A] text-gray-950 font-bold flex items-center gap-2 disabled:opacity-50"><Download size={16}/>{busy?'Preparing PDF...':'Download Terms Summary PDF'}</button>
   </div>
   {error&&<p role="alert" className="text-rose-300">{error}</p>}
  </div>
  <PlanConditions user={user} investmentUsd={metrics.totalInvestmentUsd}/>
  {showSummary&&<div role="dialog" aria-modal="true" aria-label="Investment Summary" className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
   <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-4">
    <div className="flex justify-between"><h3 className="font-bold text-white">Investment Summary</h3><button aria-label="Close investment summary" onClick={()=>setShowSummary(false)}><X/></button></div>
    <p className="text-gray-300">Investor: {user.name} ({user.username})</p>
    <PlanConditions user={user} investmentUsd={metrics.totalInvestmentUsd}/>
    <p className="text-xs text-gray-400">Account record only. No electronic signature or company stamp is verified by this screen.</p>
   </div>
  </div>}
 </div>;
};
