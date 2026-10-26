import React, { useState } from 'react';
export function TicketImageInput({value,onChange}:{value:string|null;onChange:(value:string|null)=>void}) {
  const [error,setError]=useState('');
  return <div className="text-xs text-fg-muted space-y-2"><label>Attach image (PNG, JPEG, WebP; up to 2 MB)<input aria-label="Support image" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const file=e.target.files?.[0];setError('');if(!file)return;if(file.size>2*1024*1024||!['image/png','image/jpeg','image/webp'].includes(file.type)){setError('Choose a supported image up to 2 MB.');e.target.value='';return;}const reader=new FileReader();reader.onload=()=>onChange(String(reader.result));reader.readAsDataURL(file);}} className="block mt-2" /></label>{error&&<p role="alert" className="text-rose-300">{error}</p>}{value&&<div><img alt="Attachment preview" src={value} className="max-h-32 rounded"/><button type="button" onClick={()=>onChange(null)}>Remove image</button></div>}</div>;
}
