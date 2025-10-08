"use client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HomePage } from "./home-page"

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (session) {
    // Redirect authenticated users to their dashboard
    if (session.user.role === "provider") {
      redirect("/dashboard/provider")
    }
    redirect("/dashboard/user")
  }

  return <HomePage />
}
