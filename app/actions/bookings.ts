"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createBooking(data: {
  userId: string
  providerId: string
  date: Date
  time: string
  notes?: string
}) {
  try {
    const booking = await prisma.booking.create({
      data: {
        userId: data.userId,
        providerId: data.providerId,
        date: data.date,
        time: data.time,
        notes: data.notes,
        status: "pending",
      },
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
    revalidatePath("/dashboard/user")
    revalidatePath("/dashboard/provider")

    return { success: true, booking }
  } catch (error) {
    console.error("Create booking error:", error)
    return { success: false, error: "Failed to create booking" }
  }
}

export async function getUserBookings(userId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
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

    return { success: true, bookings }
  } catch (error) {
    console.error("Get user bookings error:", error)
    return { success: false, error: "Failed to fetch bookings", bookings: [] }
  }
}

export async function getProviderBookings(providerId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        providerId: providerId,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return { success: true, bookings }
  } catch (error) {
    console.error("Get provider bookings error:", error)
    return { success: false, error: "Failed to fetch bookings", bookings: [] }
  }
}

export async function confirmBooking(bookingId: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "confirmed" },
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
    revalidatePath("/dashboard/provider")
    revalidatePath("/dashboard/user")

    return { success: true, booking }
  } catch (error) {
    console.error("Confirm booking error:", error)
    return { success: false, error: "Failed to confirm booking" }
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "cancelled" },
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
    revalidatePath("/dashboard/provider")
    revalidatePath("/dashboard/user")

    return { success: true, booking }
  } catch (error) {
    console.error("Cancel booking error:", error)
    return { success: false, error: "Failed to cancel booking" }
  }
}

export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    revalidatePath("/dashboard")
    revalidatePath("/admin/dashboard")

    return { success: true, booking }
  } catch (error) {
    console.error("Update booking status error:", error)
    return { success: false, error: "Failed to update booking" }
  }
}
