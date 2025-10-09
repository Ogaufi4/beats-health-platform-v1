"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createBooking(data: {
  providerId: string
  date: Date
  time: string
  notes?: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      providerId: data.providerId,
      date: data.date,
      time: data.time,
      notes: data.notes,
      status: "pending",
    },
    include: {
      provider: {
        include: {
          profile: true,
        },
      },
    },
  })

  revalidatePath("/dashboard")
  return booking
}

export async function createStaffBookingForPatient(data: {
  patientUserId: string
  providerId: string
  date: Date
  time: string
  notes?: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Only staff can book on behalf of patients
  const staff = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!staff || !["doctor", "nurse", "pharmacist", "facility_admin"].includes(staff.role)) {
    throw new Error("Forbidden")
  }

  const booking = await prisma.booking.create({
    data: {
      userId: data.patientUserId,
      providerId: data.providerId,
      date: data.date,
      time: data.time,
      notes: data.notes,
      status: "pending",
    },
    include: {
      user: { include: { profile: true } },
      provider: { include: { profile: true } },
    },
  })

  revalidatePath("/dashboard")
  return booking
}

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "declined" | "cancelled") {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  })

  if (!booking) {
    throw new Error("Booking not found")
  }

  // Check if user is the provider or client
  if (booking.providerId !== session.user.id && booking.userId !== session.user.id) {
    throw new Error("Unauthorized")
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      provider: {
        include: {
          profile: true,
        },
      },
    },
  })

  revalidatePath("/dashboard")
  return updatedBooking
}

export async function confirmBooking(bookingId: string) {
  return updateBookingStatus(bookingId, "confirmed")
}

export async function cancelBooking(bookingId: string) {
  return updateBookingStatus(bookingId, "cancelled")
}

export async function getMyBookings() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role === "doctor" || user?.role === "nurse" || user?.role === "pharmacist") {
    return await prisma.booking.findMany({
      where: { providerId: session.user.id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    })
  } else {
    return await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    })
  }
}

export async function getProviderBookings(providerId?: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const targetProviderId = providerId || session.user.id

  // Verify user has permission to view these bookings
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const isAdmin = user?.role === "admin" || user?.role === "moh_official"
  const isOwnBookings = targetProviderId === session.user.id

  if (!isAdmin && !isOwnBookings) {
    throw new Error("Forbidden")
  }

  return await prisma.booking.findMany({
    where: { providerId: targetProviderId },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      provider: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })
}

export async function getAllBookings() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  // Only admins can view all bookings
  if (user?.role !== "admin" && user?.role !== "moh_official") {
    throw new Error("Forbidden")
  }

  return await prisma.booking.findMany({
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      provider: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  })
}
