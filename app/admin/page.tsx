import { redirect } from "next/navigation";import { isAdmin } from "@/lib/admin-auth";import { getStore } from "@/lib/store";import AdminDashboard from "@/components/admin/AdminDashboard";
export const metadata={title:"Yönetim Paneli",robots:{index:false,follow:false}};export const dynamic="force-dynamic";
export default async function Page(){if(!await isAdmin())redirect("/admin/login");const store=await getStore();return <AdminDashboard initial={store}/>}
