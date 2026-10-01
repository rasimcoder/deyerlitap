import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const body = await request.json()

  const product = await prisma.product.create({
    data: {
      title: body.title,
      description: body.description || null,
      price: Number(body.price),
      oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
      image: body.image,
      images: body.images || [],
      condition: body.condition,
      isFeatured: body.isFeatured || false,
      isActive: body.isActive !== false,
      categoryId: body.categoryId,
    },
  })

  return NextResponse.json(product)
}