import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function MoHDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/signin")
  if (session.user.role !== "moh" && session.user.role !== "super_admin") redirect("/dashboard")

  // Reuse CMS dashboard route for MoH for now
  redirect("/cms/dashboard")
}

