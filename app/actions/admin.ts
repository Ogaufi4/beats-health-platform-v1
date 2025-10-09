"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function getAdminStats() {
  try {
    const [userCount, bookingCount, facilityCount] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.user.count({ where: { role: "facility_admin" } }),
    ])

    return {
      success: true,
      stats: {
        users: userCount,
        bookings: bookingCount,
        facilities: facilityCount,
        providers: await prisma.user.count({
          where: {
            role: { in: ["doctor", "nurse", "pharmacist"] },
          },
        }),
      },
    }
  } catch (error) {
    console.error("Get admin stats error:", error)
    return { success: false, error: "Failed to fetch stats" }
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, users }
  } catch (error) {
    console.error("Get all users error:", error)
    return { success: false, error: "Failed to fetch users", users: [] }
  }
}

export async function getAllBookings() {
  try {
    const bookings = await prisma.booking.findMany({
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

    return { success: true, bookings }
  } catch (error) {
    console.error("Get all bookings error:", error)
    return { success: false, error: "Failed to fetch bookings", bookings: [] }
  }
}

export async function updateUserStatus(userId: string, status: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
    })

    revalidatePath("/admin/dashboard")

    return { success: true, user }
  } catch (error) {
    console.error("Update user status error:", error)
    return { success: false, error: "Failed to update user status" }
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Delete user error:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export async function createUser(data: {
  email: string
  password: string
  role: string
  firstName: string
  lastName: string
  phone?: string
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role as any,
        status: "active",
        phone: data.phone,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
      include: {
        profile: true,
      },
    })

    revalidatePath("/admin/dashboard")

    return { success: true, user }
  } catch (error) {
    console.error("Create user error:", error)
    return { success: false, error: "Failed to create user" }
  }
}
