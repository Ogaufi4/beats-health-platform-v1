import "server-only"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Redirect based on role
  switch (session.user.role) {
    case "doctor":
      redirect("/doctor/dashboard")
    case "nurse":
      redirect("/nurse/dashboard")
    case "pharmacist":
      redirect("/pharmacist/dashboard")
    case "facility_admin":
      redirect("/facility/dashboard")
    case "moh":
      redirect("/moh/dashboard")
    case "cms":
      redirect("/cms/dashboard")
    case "chw":
      redirect("/facility/dashboard")
    default:
      redirect("/dashboard/user")
  }
}
