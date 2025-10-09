"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function signUp(data: {
  email: string
  password: string
  name: string
  role: "patient" | "doctor" | "nurse" | "pharmacist" | "facility_admin" | "moh" | "chw" | "super_admin" | "cms"
  phone?: string
  facilityId?: string
  languagePref?: "en" | "tn"
  professionalId?: string
  documentUrls?: any
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
      status: "pending_verification",
      phone: data.phone,
      facilityId: data.facilityId,
      languagePref: (data.languagePref as any) ?? "en",
      professionalId: data.professionalId,
      documentUrls: data.documentUrls as any,
      profile: {
        create: {
          firstName: data.name,
        },
      },
    },
    include: {
      profile: true,
    },
  })

  return user
}
