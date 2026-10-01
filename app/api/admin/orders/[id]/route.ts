import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdminAuthenticated } from "@/lib/admin-auth"

type Props = {
  params: Promise<{ id: string }>
}

const allowedStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!(await isAdminAuthenticated())) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
  const { id } = await params
  const body = await request.json()

  if (!body.status || !allowedStatuses.includes(body.status)) {
    return NextResponse.json(
      { error: "Yanlış status" },
      { status: 400 }
    )
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: body.status },
  })

  return NextResponse.json(order)
}