import { redirect } from "next/navigation";import { isAdmin } from "@/lib/admin-auth";import AdminLogin from "@/components/admin/AdminLogin";
export const metadata={title:"Yönetici Girişi",robots:{index:false,follow:false}};
export default async function Page(){if(await isAdmin())redirect("/admin");return <AdminLogin/>}
