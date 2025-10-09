import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function assertAdmin(role?: string) {
  return role === "facility_admin" || role === "moh" || role === "super_admin"
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!assertAdmin(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { userId, action, reason } = body as {
    userId: string
    action: "approve" | "reject"
    reason?: string
  }

  if (!userId || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id: userId } })
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const newStatus = action === "approve" ? "active" : "rejected"

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  })

  // TODO: enqueue SMS notification and write audit log

  return NextResponse.json({ ok: true, user: updated })
}

