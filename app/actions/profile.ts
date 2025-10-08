"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(data: {
  name: string
  gender?: string
  age?: number
  location?: string
  profilePicture?: string
  specialization?: string
  hourlyRate?: number
  availableTimes?: any
  bio?: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: data,
    create: {
      ...data,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/profile")
  return profile
}

export async function getProfile(userId?: string) {
  const session = await getServerSession(authOptions)

  const targetUserId = userId || session?.user?.id

  if (!targetUserId) {
    throw new Error("User ID required")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: targetUserId },
    include: {
      user: {
        select: {
          email: true,
          role: true,
        },
      },
    },
  })

  return profile
}

export async function getAllProviders() {
  const providers = await prisma.user.findMany({
    where: {
      role: "provider",
    },
    include: {
      profile: true,
    },
  })

  return providers
}
