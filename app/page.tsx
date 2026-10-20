import CatalogHome from '@/components/CatalogHome';
import { getStore, getNavCategories } from '@/lib/store';
export const dynamic='force-dynamic';
export default async function Home(){const store=await getStore();return <CatalogHome initialProducts={store.products.filter(product=>product.active)} categories={(store.categories||[]).filter(category=>category.active).sort((a,b)=>a.order-b.order)} navCategories={getNavCategories(store)} settings={store.settings}/>}
