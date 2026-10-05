"use client";
import { useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

export default function QuoteForm(){
  const [state,setState]=useState<"idle"|"loading"|"ok"|"error">("idle");
  const [error,setError]=useState("");

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const formElement=event.currentTarget;
    const formData=new FormData(formElement);
    setState("loading");
    setError("");
    try{
      const response=await fetch("/api/teklif",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(formData))});
      const result=await response.json().catch(()=>({message:"Talep gönderilemedi."}));
      if(!response.ok)throw new Error(result.message||"Talep gönderilemedi.");
      formElement.reset();
      setState("ok");
    }catch(caught){
      setError(caught instanceof Error?caught.message:"Bir hata oluştu. Lütfen tekrar deneyin.");
      setState("error");
    }
  }

  return <form className="quote-form" onSubmit={submit}>
    <div className="field-row"><label>Ad soyad<input name="name" required minLength={2} autoComplete="name"/></label><label>Telefon<input name="phone" required type="tel" autoComplete="tel" placeholder="05__ ___ __ __"/></label></div>
    <label>E-posta<input name="email" required type="email" autoComplete="email"/></label>
    <label>İlgilendiğiniz alan<select name="category" required defaultValue=""><option value="" disabled>Seçiniz</option><option>Promosyon ürünleri</option><option>Matbaa ürünleri</option><option>İş elbiseleri</option><option>Birden fazla</option></select></label>
    <label>Projenizden kısaca bahsedin<textarea name="message" rows={4} required minLength={10}/></label>
    <label className="check"><input type="checkbox" required/> <span><a href="/gizlilik" target="_blank" rel="noreferrer">Gizlilik</a> metnini okudum, iletişim için onay veriyorum.</span></label>
    <button className="button submit" disabled={state==="loading"}>{state==="loading"?<><LoaderCircle className="spin"/> Gönderiliyor</>:"Teklif talebi gönder"}</button>
    {state==="ok"&&<p className="form-status success"><CheckCircle2/> Talebiniz alındı. Bir iş günü içinde size ulaşacağız.</p>}
    {state==="error"&&<p className="form-status error" role="alert">{error}</p>}
  </form>;
}
