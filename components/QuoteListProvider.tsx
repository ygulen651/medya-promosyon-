"use client";

import { createContext, useContext, useEffect, useState } from "react";

const storageKey = "meday-quote-list-v1";
const QuoteListContext = createContext<{list:string[];toggle:(id:string)=>void} | null>(null);

export default function QuoteListProvider({children}:{children:React.ReactNode}) {
  const [list,setList] = useState<string[]>([]);
  const [loaded,setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved:unknown = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) setList(saved.filter((id):id is string => typeof id === "string"));
    } catch { /* The list still works when browser storage is unavailable. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) {
      try { sessionStorage.setItem(storageKey,JSON.stringify(list)); } catch { /* Keep the in-memory list. */ }
    }
  }, [list,loaded]);

  function toggle(id:string) {
    setList(current => {
      const next = current.includes(id) ? current.filter(value => value !== id) : [...current,id];
      return next;
    });
  }

  return <QuoteListContext.Provider value={{list,toggle}}>{children}</QuoteListContext.Provider>;
}

export function useQuoteList() {
  const context = useContext(QuoteListContext);
  if (!context) throw new Error("QuoteListProvider is required");
  return context;
}
