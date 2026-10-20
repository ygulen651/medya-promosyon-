export type NavCategory = { id:string; name:string; slug:string; imageUrl:string; count:number };

const trMap:Record<string,string>={ç:"c",ğ:"g",ı:"i",i:"i",ö:"o",ş:"s",ü:"u"};
export function categorySlug(name:string){return name.toLocaleLowerCase("tr").replace(/[çğıiöşü]/g,char=>trMap[char]||char).replace(/&/g," ve ").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
export const categoryHref=(name:string)=>`/urunler?kategori=${categorySlug(name)}`;
export function parsePrice(value:string){const number=Number(String(value||"").replace(/[^\d,]/g,"").replace(",","."));return Number.isFinite(number)?number:0}
