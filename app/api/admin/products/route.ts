import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminRead } from "@/lib/admin-guard"
import { requireAdminMutation } from "@/lib/admin-guard"

export async function GET() {
  const gate = await requireAdminRead()
  if (!gate.ok) return gate.response

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const gate = await requireAdminMutation(request)
  if (!gate.ok) return gate.response
  

  const body = await request.json()

  const product = await prisma.product.create({
    data: {
      title: body.title,
      description: body.description || null,
      price: Number(body.price),
      oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
      costPrice: Number(body.costPrice ?? 0),
      image: body.image,
      images: body.images || [],
      condition: body.condition,
      isFeatured: body.isFeatured || false,
      isActive: body.isActive !== false,
      categoryId: body.categoryId,
      stock: Number(body.stock ?? 1),
    },
  })

  return NextResponse.json(product)
}