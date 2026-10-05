import CatalogHome from '@/components/CatalogHome';
import { getStore } from '@/lib/store';
export const dynamic='force-dynamic';
export default async function Home(){const store=await getStore();return <CatalogHome initialProducts={store.products.filter(product=>product.active)} settings={store.settings}/>}
