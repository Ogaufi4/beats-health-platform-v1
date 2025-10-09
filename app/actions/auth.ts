"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

interface SignUpData {
  email: string
  password: string
  name: string
  role: "doctor" | "nurse" | "pharmacist" | "facility_admin" | "moh" | "chw" | "super_admin" | "cms"
}

export async function signUp(data: SignUpData) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const [firstName, ...lastNameParts] = data.name.split(" ")
    const lastName = lastNameParts.join(" ") || firstName

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        status: "active",
        profile: {
          create: {
            firstName,
            lastName,
            phone: "",
            district: "",
          },
        },
      },
    })

    revalidatePath("/auth/signin")

    return { success: true, userId: user.id }
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}
