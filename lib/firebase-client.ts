"use client";
import { getApp,getApps,initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const config={apiKey:"AIzaSyByXZ5eTipkpaWap8BBuIfvzkw-DrA6zuQ",authDomain:"medyapromosyn.firebaseapp.com",projectId:"medyapromosyn",storageBucket:"medyapromosyn.firebasestorage.app",messagingSenderId:"69476319865",appId:"1:69476319865:web:e1b9927c802e7c0f3e0aa8",measurementId:"G-70RFXTYPHD"};
export const firebaseApp=getApps().length?getApp():initializeApp(config);
export const firebaseAuth=getAuth(firebaseApp);
