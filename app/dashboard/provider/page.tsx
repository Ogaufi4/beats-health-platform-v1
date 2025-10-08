import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getMyBookings } from "@/app/actions/bookings"
import { getProfile } from "@/app/actions/profile"
import { ProviderDashboardClient } from "@/components/dashboard/provider-dashboard-client"

export default async function ProviderDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "provider") {
    redirect("/dashboard/user")
  }

  const bookings = await getMyBookings()
  const profile = await getProfile()

  return <ProviderDashboardClient bookings={bookings} profile={profile} session={session} />
}
