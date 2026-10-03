import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminMutation } from "@/lib/admin-guard"

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
  const gate = await requireAdminMutation(request)
  if (!gate.ok) return gate.response

  const { id } = await params
  const body = await request.json()

  if (!body.status || !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Yanlış status" }, { status: 400 })
  }

  const existing = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!existing) {
    return NextResponse.json({ error: "Sifariş tapılmadı" }, { status: 404 })
  }

  const oldStatus = existing.status
  const newStatus = body.status as string

  if (oldStatus === newStatus) {
    return NextResponse.json(existing)
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      if (newStatus === "cancelled" && oldStatus !== "cancelled") {
        for (const item of existing.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        }
      }

      if (oldStatus === "cancelled" && newStatus !== "cancelled") {
        for (const item of existing.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          })

          if (!product || product.stock < item.quantity) {
            throw new Error(
              `"${item.title}" üçün kifayət qədər stok yoxdur (geri aktivləşdirmək mümkün deyil)`
            )
          }

          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: newStatus },
        include: { items: true },
      })
    })

    return NextResponse.json(order)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Status yenilənmədi"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}