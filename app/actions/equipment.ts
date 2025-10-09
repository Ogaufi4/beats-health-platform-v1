"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function listEquipment(facilityId?: string) {
  const where = facilityId ? { facilityId } : {}
  return prisma.equipment.findMany({ where, orderBy: { name: "asc" } })
}

export async function bookEquipment(params: {
  patientUserId: string
  providerId: string
  equipmentId: string
  date: Date
  time: string
  notes?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const staff = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!staff || !["doctor", "nurse", "pharmacist", "facility_admin"].includes(staff.role)) {
    throw new Error("Forbidden")
  }

  // Optionally: check if equipment is available (simple example)
  const overlapping = await prisma.booking.findFirst({
    where: { equipmentId: params.equipmentId, date: params.date, time: params.time },
  })
  if (overlapping) throw new Error("Equipment not available at selected time")

  return prisma.booking.create({
    data: {
      userId: params.patientUserId,
      providerId: params.providerId,
      equipmentId: params.equipmentId,
      date: params.date,
      time: params.time,
      notes: params.notes,
      status: "pending",
    },
  })
}

