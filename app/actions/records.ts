"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createMedicalRecord(data: {
  patientUserId: string
  type: string
  summary?: string
  payload?: any
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const staff = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!staff || !["doctor", "nurse", "pharmacist", "facility_admin"].includes(staff.role)) {
    throw new Error("Forbidden")
  }

  return prisma.medicalRecord.create({
    data: {
      patientUserId: data.patientUserId,
      createdById: session.user.id,
      type: data.type,
      summary: data.summary,
      data: data.payload,
    },
  })
}

export async function listMedicalRecords(patientUserId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")
  // Staff can view; optionally restrict by facility or role
  return prisma.medicalRecord.findMany({
    where: { patientUserId },
    orderBy: { createdAt: "desc" },
  })
}
