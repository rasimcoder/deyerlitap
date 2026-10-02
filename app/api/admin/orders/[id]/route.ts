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

  // Eyni statusdursa heç nə etmə
  if (oldStatus === newStatus) {
    return NextResponse.json(existing)
  }

  const order = await prisma.$transaction(async (tx) => {
    // Ləğv edildi → stoku geri qaytar (yalnız əvvəl ləğv edilməyibsə)
    if (newStatus === "cancelled" && oldStatus !== "cancelled") {
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      }
    }

    // Ləğvdən başqa statusa qayıtdı → stoku yenidən azalt
    // (məsələn cancelled → pending)
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
}