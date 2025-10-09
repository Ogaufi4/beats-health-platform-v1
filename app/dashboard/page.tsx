import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const role = session.user.role

  // Redirect based on user role
  switch (role) {
    case "super_admin":
    case "moh":
      redirect("/admin/dashboard")
    case "doctor":
      redirect("/doctor/dashboard")
    case "nurse":
      redirect("/nurse/dashboard")
    case "pharmacist":
      redirect("/pharmacist/dashboard")
    case "facility_admin":
      redirect("/facility/dashboard")
    case "cms":
      redirect("/cms/dashboard")
    case "chw":
      redirect("/dashboard/user")
    default:
      redirect("/dashboard/user")
  }
}
