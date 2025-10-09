"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getAllFacilities() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  return await prisma.facility.findMany({
    include: {
      _count: {
        select: {
          staff: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function createFacility(data: {
  name: string
  type: string
  district: string
  region: string
  capacity?: number
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  const facility = await prisma.facility.create({
    data: {
      name: data.name,
      type: data.type,
      district: data.district,
      region: data.region,
      capacity: data.capacity || 0,
    },
  })

  revalidatePath("/admin/dashboard")
  return facility
}

export async function updateFacility(
  facilityId: string,
  data: {
    name?: string
    type?: string
    district?: string
    region?: string
    capacity?: number
  },
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  const facility = await prisma.facility.update({
    where: { id: facilityId },
    data,
  })

  revalidatePath("/admin/dashboard")
  return facility
}

export async function deleteFacility(facilityId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  await prisma.facility.delete({
    where: { id: facilityId },
  })

  revalidatePath("/admin/dashboard")
}

export async function getAllUsers() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  return await prisma.user.findMany({
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function updateUserRole(userId: string, role: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin") {
    throw new Error("Forbidden")
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    include: {
      profile: true,
    },
  })

  revalidatePath("/admin/dashboard")
  return updatedUser
}

export async function getSystemStats() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  const [totalUsers, totalFacilities, totalBookings, totalProviders, pendingBookings, confirmedBookings] =
    await Promise.all([
      prisma.user.count(),
      prisma.facility.count(),
      prisma.booking.count(),
      prisma.user.count({
        where: {
          role: {
            in: ["doctor", "nurse", "pharmacist"],
          },
        },
      }),
      prisma.booking.count({
        where: { status: "pending" },
      }),
      prisma.booking.count({
        where: { status: "confirmed" },
      }),
    ])

  return {
    totalUsers,
    totalFacilities,
    totalBookings,
    totalProviders,
    pendingBookings,
    confirmedBookings,
  }
}

export async function getRecentUsers(limit = 5) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  return await prisma.user.findMany({
    take: limit,
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getBookingsByStatus() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  const pending = await prisma.booking.count({ where: { status: "pending" } })
  const confirmed = await prisma.booking.count({ where: { status: "confirmed" } })
  const cancelled = await prisma.booking.count({ where: { status: "cancelled" } })
  const declined = await prisma.booking.count({ where: { status: "declined" } })

  return [
    { name: "Pending", value: pending },
    { name: "Confirmed", value: confirmed },
    { name: "Cancelled", value: cancelled },
    { name: "Declined", value: declined },
  ]
}

export async function getUsersByRole() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  const patients = await prisma.user.count({ where: { role: "patient" } })
  const doctors = await prisma.user.count({ where: { role: "doctor" } })
  const nurses = await prisma.user.count({ where: { role: "nurse" } })
  const pharmacists = await prisma.user.count({ where: { role: "pharmacist" } })
  const admins = await prisma.user.count({ where: { role: "admin" } })

  return [
    { name: "Patients", value: patients },
    { name: "Doctors", value: doctors },
    { name: "Nurses", value: nurses },
    { name: "Pharmacists", value: pharmacists },
    { name: "Admins", value: admins },
  ]
}

export async function getFacilitiesByRegion() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  const facilities = await prisma.facility.groupBy({
    by: ["region"],
    _count: {
      region: true,
    },
  })

  return facilities.map((f) => ({
    name: f.region,
    value: f._count.region,
  }))
}
