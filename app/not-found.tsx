import Link from 'next/link';import { ArrowLeft } from 'lucide-react';
export default function NotFound(){return <main className="not-found"><p>404</p><h1>Aradığınız sayfa<br/><em>üretimde kalmış olabilir.</em></h1><span>Bağlantı değişmiş ya da sayfa kaldırılmış olabilir.</span><Link className="button" href="/"><ArrowLeft/> Ana sayfaya dön</Link></main>}
