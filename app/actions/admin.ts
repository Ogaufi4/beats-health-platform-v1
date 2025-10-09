"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getAdminStats() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const [totalFacilities, totalUsers, pendingBookings, totalBookings, activeProviders, recentUsers] = await Promise.all(
    [
      prisma.facility.count(),
      prisma.user.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.booking.count(),
      prisma.user.count({ where: { role: "provider" } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ],
  )

  return {
    totalFacilities,
    totalUsers,
    pendingBookings,
    totalBookings,
    activeProviders,
    recentUsers,
  }
}

export async function getAllFacilities() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const facilities = await prisma.facility.findMany({
    include: {
      _count: {
        select: { equipment: true },
      },
    },
    orderBy: { name: "asc" },
  })

  return facilities
}

export async function createFacility(data: {
  name: string
  type: string
  district: string
  region: string
  capacity: number
  staffCount: number
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const facility = await prisma.facility.create({
    data: {
      ...data,
      status: "operational",
    },
  })

  revalidatePath("/admin/dashboard")
  return facility
}

export async function updateFacility(
  id: string,
  data: {
    name?: string
    type?: string
    district?: string
    region?: string
    capacity?: number
    staffCount?: number
    status?: string
  },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const facility = await prisma.facility.update({
    where: { id },
    data,
  })

  revalidatePath("/admin/dashboard")
  return facility
}

export async function deleteFacility(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  await prisma.facility.delete({
    where: { id },
  })

  revalidatePath("/admin/dashboard")
}

export async function getAllUsers(role?: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const users = await prisma.user.findMany({
    where: role ? { role } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return users
}

export async function getAllBookings() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      provider: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return bookings
}

export async function getSystemAnalytics() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [bookingsByStatus, bookingsByMonth, usersByRole, facilitiesByRegion] = await Promise.all([
    prisma.booking.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.booking.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: lastMonth,
        },
      },
      _count: true,
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: true,
    }),
    prisma.facility.groupBy({
      by: ["region"],
      _count: true,
    }),
  ])

  return {
    bookingsByStatus,
    bookingsByMonth,
    usersByRole,
    facilitiesByRegion,
  }
}
