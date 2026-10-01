import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { fullName, phone, city, address, note, items, total } = body

    if (!fullName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Məcburi xanalar doldurulmayıb" },
        { status: 400 }
      )
    }

    const order = await prisma.$transaction(async (tx) => {
  // Stok yoxla və azalt
  for (const item of items) {
    const product = await tx.product.findUnique({
      where: { id: item.id },
    })

    if (!product || product.stock < item.quantity) {
      throw new Error(`"${item.title}" üçün kifayət qədər stok yoxdur`)
    }

    await tx.product.update({
      where: { id: item.id },
      data: { stock: { decrement: item.quantity } },
    })
  }

  return tx.order.create({
    data: {
      fullName,
      phone,
      city: city || "Bakı",
      address,
      note: note || null,
      total: Number(total),
      status: "pending",
      items: {
        create: items.map(
          (item: {
            id: string
            title: string
            price: number
            quantity: number
            image: string
          }) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })
        ),
      },
    },
    include: { items: true },
  })
})

    return NextResponse.json({ id: order.id, success: true })
  } catch (error) {
  console.error("Order error:", error)
  const message =
    error instanceof Error ? error.message : "Sifariş yaradılarkən xəta baş verdi"
  return NextResponse.json({ error: message }, { status: 400 })
}
}