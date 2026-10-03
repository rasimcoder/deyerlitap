import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminRead } from "@/lib/admin-guard"

export async function GET() {
  const gate = await requireAdminRead()
  if (!gate.ok) return gate.response

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(orders)
}