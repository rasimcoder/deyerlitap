import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!product) {
    return NextResponse.json({ error: "Tapılmadı" }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function PUT(request: NextRequest, { params }: Props) {
  const { id } = await params
  const body = await request.json()

  const product = await prisma.product.update({
    where: { id },
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

export async function DELETE(_req: NextRequest, { params }: Props) {
  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}