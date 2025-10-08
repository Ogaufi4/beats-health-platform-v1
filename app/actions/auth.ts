"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function signUp(data: {
  email: string
  password: string
  name: string
  role: "user" | "provider"
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role,
      profile: {
        create: {
          name: data.name,
        },
      },
    },
    include: {
      profile: true,
    },
  })

  return user
}
