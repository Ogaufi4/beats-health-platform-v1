import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getMyBookings } from "@/app/actions/bookings"
import { getProfile } from "@/app/actions/profile"
import { UserDashboardClient } from "@/components/dashboard/user-dashboard-client"

export default async function UserDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "user") {
    redirect("/dashboard/provider")
  }

  const bookings = await getMyBookings()
  const profile = await getProfile()

  return <UserDashboardClient bookings={bookings} profile={profile} session={session} />
}
