import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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