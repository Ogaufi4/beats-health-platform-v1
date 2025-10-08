import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAllProviders } from "@/app/actions/profile"
import { ProvidersClient } from "@/components/providers/providers-client"

export default async function ProvidersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const providers = await getAllProviders()

  return <ProvidersClient providers={providers} />
}
