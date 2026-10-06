import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { existsSync,readFileSync } from "node:fs";

function credentials(){
  if(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const localFile=`${process.cwd()}/medyapromosyn-firebase-adminsdk-fbsvc-4745869960.json`;
  if(existsSync(localFile))return JSON.parse(readFileSync(localFile,"utf8"));
  throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON tanımlanmalıdır.");
}
const app=getApps()[0]||initializeApp({credential:cert(credentials()),storageBucket:process.env.FIREBASE_STORAGE_BUCKET||"medyapromosyn.firebasestorage.app"});
export const firebaseAdminAuth=getAuth(app);
export const firebaseDb=getFirestore(app);
export const firebaseBucket=getStorage(app).bucket();
