import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/product/add-to-cart-button"
import { WishlistButton } from "@/components/product/wishlist-button"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) {
    return { title: "Məhsul tapılmadı" }
  }

  return {
    title: product.title,
    description: `${product.title} – ${product.price} ₼. ${product.condition} vəziyyətdə.`,
    openGraph: {
      title: product.title,
      description: `${product.price} ₼ – ${product.condition}`,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })

  if (!product || !product.isActive) {
    notFound()
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
  })

  return (
    <div className="container py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Geri
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Şəkil */}
        <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Məlumat */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              {product.title}
            </h1>
            <WishlistButton product={product} size="icon" className="shrink-0 border" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.condition}</Badge>
            {product.category && (
              <Badge variant="outline">{product.category.name}</Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-accent text-accent-foreground">
                -{discount}% endirim
              </Badge>
            )}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {product.price} ₼
            </span>
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {product.oldPrice} ₼
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
  {product.stock > 0 ? (
    <>Stokda: <strong>{product.stock}</strong> ədəd</>
  ) : (
    <span className="text-destructive font-medium">Stokda yoxdur</span>
  )}
</p>

          <Separator className="my-6" />

          <div className="space-y-4 text-sm text-muted-foreground">
            {product.description && <p>{product.description}</p>}
            <p>
              Bu məhsul <strong>{product.condition.toLowerCase()}</strong> vəziyyətdədir.
            </p>
            <p>
              Bakı və Sumqayıta <strong>pulsuz çatdırılma</strong> mövcuddur.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={product} />
            <Button size="lg" variant="outline" className="flex-1">
              Zəng et: 070 528-28-92
            </Button>
          </div>
        </div>
      </div>

      {/* Oxşar məhsullar */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold">Oxşar məhsullar</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="group overflow-hidden rounded-xl border bg-card transition hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-medium">{item.title}</h3>
                  <p className="mt-1 font-bold text-primary">{item.price} ₼</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}