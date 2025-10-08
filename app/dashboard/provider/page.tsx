import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ProviderDashboardClient } from "@/components/dashboard/provider-dashboard-client"

export default async function ProviderDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return <ProviderDashboardClient />
}
