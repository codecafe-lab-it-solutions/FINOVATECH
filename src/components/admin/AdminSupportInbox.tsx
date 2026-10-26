import React,{useEffect,useState} from 'react';
import {ApiTicket,fetchAdminTickets,addAdminTicketMessage,updateAdminTicketStatus} from '../../lib/api';
import {SupportHelpdeskTab} from '../investor/SupportHelpdeskTab';
export function AdminSupportInbox({authToken}:{authToken:string}){
 const [tickets,setTickets]=useState<ApiTicket[]>([]),[error,setError]=useState('');
 const load=async()=>{try{setTickets((await fetchAdminTickets(authToken)).tickets);setError('');}catch(e){setError(e instanceof Error?e.message:'Could not load tickets.');}};
 useEffect(()=>{void load();const timer=setInterval(()=>void load(),15000);return()=>clearInterval(timer);},[authToken]);
 return <section className="space-y-4"><h2 className="text-xl text-white font-bold">Investor Support Inbox</h2><button className="text-gold-200" onClick={()=>void load()}>Refresh tickets</button>{error&&<p role="alert" className="text-rose-300">{error}</p>}<div className="flex flex-wrap gap-3">{tickets.map(t=><label key={t.id} className="text-xs text-fg-body">{t.investorName}: {t.subject}<select aria-label={'Status for '+t.subject} className="p-2 bg-ink-850 ml-2" value={t.status} onChange={async e=>{try{await updateAdminTicketStatus(authToken,t.id,e.target.value as ApiTicket['status']);await load();}catch(err){setError(err instanceof Error?err.message:'Update failed.');}}}><option>Open</option><option>In Progress</option><option>Resolved</option></select></label>)}</div><SupportHelpdeskTab tickets={tickets} adminMode onAddTicket={async()=>{}} onAddMessage={async(id,message,image)=>{await addAdminTicketMessage(authToken,id,message,image);await load();}}/></section>;
}
