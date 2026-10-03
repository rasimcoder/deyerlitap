import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminMutation } from "@/lib/admin-guard"

type Props = {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const gate = await requireAdminMutation(request)
  if (!gate.ok) return gate.response

  const { id } = await params

  const count = await prisma.product.count({
    where: { categoryId: id },
  })

  if (count > 0) {
    return NextResponse.json(
      {
        error: `Bu kateqoriyada ${count} məhsul var. Əvvəlcə məhsulları silin və ya başqa kateqoriyaya köçürün.`,
      },
      { status: 400 }
    )
  }

  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ success: true })
}