"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createReferral(data: {
  patientUserId: string
  targetFacilityId?: string
  reason: string
  metadata?: any
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const staff = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!staff || !["doctor", "nurse", "pharmacist", "facility_admin"].includes(staff.role)) {
    throw new Error("Forbidden")
  }

  return prisma.referral.create({
    data: {
      createdById: session.user.id,
      patientUserId: data.patientUserId,
      targetFacilityId: data.targetFacilityId,
      reason: data.reason,
      metadata: data.metadata,
    },
  })
}

export async function listReferralsForPatient(patientUserId: string) {
  return prisma.referral.findMany({
    where: { patientUserId },
    orderBy: { createdAt: "desc" },
  })
}

