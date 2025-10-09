import { ProvidersClient } from "@/components/providers/providers-client"
import { prisma } from "@/lib/prisma"

export default async function ProvidersPage() {
  const providers = await prisma.user.findMany({
    where: {
      role: "doctor",
      status: "active",
    },
    include: {
      profile: true,
    },
  })

  return <ProvidersClient providers={JSON.parse(JSON.stringify(providers))} />
}
