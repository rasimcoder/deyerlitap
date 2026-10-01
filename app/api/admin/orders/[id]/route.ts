import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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