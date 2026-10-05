import "server-only";
import { cookies } from "next/headers";
import { firebaseAdminAuth } from "@/lib/firebase-admin";

export const ADMIN_COOKIE="meday_admin_session";
export const sessionMaxAge=60*60*8;

export async function isAdmin(){
  const token=(await cookies()).get(ADMIN_COOKIE)?.value;
  if(!token)return false;
  try{const decoded=await firebaseAdminAuth.verifySessionCookie(token,true);return decoded.admin===true}catch{return false}
}

export async function createFirebaseSession(idToken:string){
  const decoded=await firebaseAdminAuth.verifyIdToken(idToken,true);
  if(decoded.admin!==true)throw new Error("ADMIN_REQUIRED");
  return firebaseAdminAuth.createSessionCookie(idToken,{expiresIn:sessionMaxAge*1000});
}
