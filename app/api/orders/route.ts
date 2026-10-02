import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOrderNotification } from "@/lib/email"

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

      // Sifariş yarat + hər item-ə maya dəyərini yaz
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
            create: await Promise.all(
              items.map(
                async (item: {
                  id: string
                  title: string
                  price: number
                  quantity: number
                  image: string
                }) => {
                  const product = await tx.product.findUnique({
                    where: { id: item.id },
                    select: { costPrice: true },
                  })

                  return {
                    productId: item.id,
                    title: item.title,
                    price: item.price,
                    costPrice: product?.costPrice ?? 0,
                    quantity: item.quantity,
                    image: item.image,
                  }
                }
              )
            ),
          },
        },
        include: { items: true },
      })
    })

    // Email bildirişi (xəta olsa sifarişi pozmasın)
    try {
      await sendOrderNotification({
        orderId: order.id,
        fullName: order.fullName,
        phone: order.phone,
        city: order.city,
        address: order.address,
        note: order.note,
        total: order.total,
        items: order.items.map((item) => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      })
    } catch (emailError) {
      console.error("Email göndərilmədi:", emailError)
    }

    return NextResponse.json({ id: order.id, success: true })
  } catch (error) {
    console.error("Order error:", error)
    const message =
      error instanceof Error
        ? error.message
        : "Sifariş yaradılarkən xəta baş verdi"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}