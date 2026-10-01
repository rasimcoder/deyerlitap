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

    const order = await prisma.order.create({
      data: {
        fullName,
        phone,
        city: city || "Bakı",
        address,
        note: note || null,
        total: Number(total),
        status: "pending",
        items: {
          create: items.map((item: {
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
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ id: order.id, success: true })
  } catch (error) {
    console.error("Order error:", error)
    return NextResponse.json(
      { error: "Sifariş yaradılarkən xəta baş verdi" },
      { status: 500 }
    )
  }
}