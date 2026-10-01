import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Kateqoriyalar</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group rounded-xl border bg-card p-6 transition hover:shadow-md hover:border-primary/30"
          >
            <h2 className="text-lg font-semibold group-hover:text-primary transition">
              {category.name}
            </h2>
            {category.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              {category._count.products} məhsul
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}