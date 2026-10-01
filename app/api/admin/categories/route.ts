import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const withCount = request.nextUrl.searchParams.get("withCount")

  const categories = await prisma.category.findMany({
    include: withCount
      ? { _count: { select: { products: true } } }
      : undefined,
    orderBy: { name: "asc" },
  })

  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (!body.name || !body.slug) {
    return NextResponse.json(
      { error: "Ad və slug məcburidir" },
      { status: 400 }
    )
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
      },
    })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json(
      { error: "Bu slug artıq mövcuddur" },
      { status: 400 }
    )
  }
}