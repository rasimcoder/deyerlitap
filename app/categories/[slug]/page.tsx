import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { ProductCard } from "@/components/product/product-card"
import type { Metadata } from "next"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    return { title: "Kateqoriya tapılmadı" }
  }

  return {
    title: category.name,
    description: category.description,
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  // Mock filter məntiqi
  const filtered = products.filter((p) => {
    if (slug === "yeni") return p.condition === "Yeni"
    if (slug === "isinmis") return p.condition === "İşlənmiş"
    if (slug === "elektronika") return p.category === "Elektronika"
    if (slug === "mebel") return p.category === "Mebel"
    if (slug === "ev-ve-bag") return p.category === "Ev və Bağ"
    if (slug === "sexsi-esya") return p.category === "Şəxsi Əşyalar"
    if (slug === "diger") return true
    return p.category.toLowerCase().includes(category.name.toLowerCase().slice(0, 4))
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
        <p className="mt-2 text-muted-foreground">{category.description}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} məhsul tapıldı
        </p>
      </div>

      {filtered.length === 0 ? (
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
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}