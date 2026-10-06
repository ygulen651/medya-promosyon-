import "server-only";
import { firebaseDb } from "@/lib/firebase-admin";

export type Product = { id:string; name:string; type:string; color:string; old:string; price:string; min:number; badge:string; category:string; active:boolean; featured:boolean; createdAt:string; imageUrl?:string; imageUrls?:string[]; videoUrl?:string; description?:string; features?:string[]; freeDesign?:boolean };
export type Inquiry = { id:string; name:string; phone:string; email:string; category:string; message:string; status:"new"|"contacted"|"closed"; createdAt:string };
export type SiteSettings = { businessName:string; phone:string; email:string; whatsapp:string; heroTitle:string; heroAccent:string; heroDescription:string; announcement:string };
export type Store = { products:Product[]; inquiries:Inquiry[]; settings:SiteSettings };

const seedProducts:Product[]=[
 {id:"MP-1042",name:"Çelik Termos 500 ml",type:"bottle",color:"#233e38",old:"348,00 ₺",price:"289,00 ₺",min:25,badge:"Lazer baskı ücretsiz",category:"Termos",active:true,featured:true,createdAt:new Date().toISOString()},
 {id:"MP-2081",name:"Ham Bez Çanta 35×40 cm",type:"bag",color:"#d8bd91",old:"68,00 ₺",price:"54,50 ₺",min:50,badge:"Çok satan",category:"Çanta",active:true,featured:true,createdAt:new Date().toISOString()},
 {id:"MP-3310",name:"Tarihsiz Premium Defter",type:"notebook",color:"#bd6546",old:"174,00 ₺",price:"149,00 ₺",min:25,badge:"Yeni",category:"Defter",active:true,featured:true,createdAt:new Date().toISOString()},
 {id:"MP-4125",name:"Reflektörlü İş Yeleği",type:"vest",color:"#ef6b31",old:"310,00 ₺",price:"265,00 ₺",min:10,badge:"Logo baskılı",category:"İş Elbisesi",active:true,featured:true,createdAt:new Date().toISOString()},
 {id:"MP-5074",name:"Kurumsal Polo Yaka Tişört",type:"shirt",color:"#193a53",old:"429,00 ₺",price:"389,00 ₺",min:25,badge:"Nakış seçeneği",category:"Tekstil",active:true,featured:false,createdAt:new Date().toISOString()},
 {id:"MP-6092",name:"Spiralli Kurumsal Bloknot",type:"print",color:"#2d6657",old:"92,00 ₺",price:"76,00 ₺",min:50,badge:"Hızlı üretim",category:"Matbaa",active:true,featured:false,createdAt:new Date().toISOString()},
 {id:"MP-7038",name:"Cam Matara 600 ml",type:"bottle",color:"#6d8982",old:"249,00 ₺",price:"219,00 ₺",min:25,badge:"Çevre dostu",category:"Su Şişesi",active:true,featured:false,createdAt:new Date().toISOString()},
 {id:"MP-8144",name:"Fuar ve Evrak Çantası",type:"bag",color:"#314962",old:"198,00 ₺",price:"169,00 ₺",min:50,badge:"Fuar ürünü",category:"Çanta",active:true,featured:false,createdAt:new Date().toISOString()}
];
const initial:Store={products:seedProducts,inquiries:[],settings:{businessName:"Meday",phone:"0212 000 00 00",email:"merhaba@meday.com",whatsapp:"902120000000",heroTitle:"Şirketiniz için ihtiyacınız olan",heroAccent:"kurumsal ürünler",heroDescription:"Marka değerinizi yükseltecek, özenle seçilmiş yüzlerce ürünü keşfedin.",announcement:"Ücretsiz tasarım desteği • Türkiye geneli teslimat"}};
const storeRef=firebaseDb.collection("meday").doc("site");
export async function getStore():Promise<Store>{const snapshot=await storeRef.get();if(!snapshot.exists){await storeRef.set(initial);return structuredClone(initial)}const data=snapshot.data() as Store;if(!data.products?.length){data.products=seedProducts;await storeRef.set(data)}return data}
export async function updateStore(update:(store:Store)=>Store|void){return firebaseDb.runTransaction(async transaction=>{const snapshot=await transaction.get(storeRef);const current=(snapshot.exists?snapshot.data():initial) as Store;const draft=structuredClone(current);const result=update(draft)||draft;transaction.set(storeRef,result);return result})}
