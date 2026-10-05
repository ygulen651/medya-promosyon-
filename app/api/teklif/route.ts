import { NextResponse } from "next/server";
import { updateStore } from "@/lib/store";
export async function POST(request:Request){try{const data=await request.json();const email=String(data.email||'');const name=String(data.name||'').trim();const phone=String(data.phone||'').replace(/\s/g,'');const message=String(data.message||'').trim();const category=String(data.category||'');if(name.length<2||!/^\S+@\S+\.\S+$/.test(email)||phone.length<10||message.length<10||!category)return NextResponse.json({message:'Eksik veya geçersiz bilgi.'},{status:400});
const key=process.env.RESEND_API_KEY;const to=process.env.QUOTE_EMAIL_TO;const from=process.env.QUOTE_EMAIL_FROM;
await updateStore(s=>{s.inquiries.unshift({id:crypto.randomUUID(),name,phone,email,category,message,status:'new',createdAt:new Date().toISOString()})});
if(key&&to&&from){const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:`Yeni teklif talebi — ${category}`,text:`Ad: ${name}\nTelefon: ${phone}\nE-posta: ${email}\nKategori: ${category}\n\n${message}`})});if(!sent.ok)return NextResponse.json({message:'Talep kaydedildi ancak e-posta iletilemedi.'},{status:502});}
else if(process.env.NODE_ENV==='production')return NextResponse.json({message:'İletişim servisi henüz yapılandırılmadı.'},{status:503});
return NextResponse.json({success:true});}catch{return NextResponse.json({message:'Geçersiz istek.'},{status:400});}}
