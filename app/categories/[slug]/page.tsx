import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product/product-card"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })

  if (!category) {
    return { title: "Kateqoriya tapılmadı" }
  }

  return {
    title: category.name,
    description: category.description || `${category.name} kateqoriyası`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    notFound()
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      isActive: true,
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container py-8">
      <Link
        href="/categories"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Bütün kateqoriyalar
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {products.length} məhsul tapıldı
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Bu kateqoriyada hələ məhsul yoxdur.
          </p>
          <Link href="/" className="mt-4 inline-block text-primary hover:underline">
            Ana səhifəyə qayıt
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}