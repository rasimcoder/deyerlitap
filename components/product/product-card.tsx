import Image from "next/image"
import Link from "next/link"
import { WishlistButton } from "@/components/product/wishlist-button"
import { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card transition hover:shadow-lg">
      {/* Şəkil */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Endirim nişanı */}
        {discount > 0 && (
          <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground">
            -{discount}%
          </Badge>
        )}

        {/* Vəziyyət nişanı */}
        <Badge
          variant="secondary"
          className="absolute right-2 top-2"
        >
          {product.condition}
        </Badge>
      </Link>

      {/* Məlumat */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary transition">
            {product.title}
          </h3>
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {product.price} ₼
            </span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.oldPrice} ₼
              </span>
            )}
          </div>

          <WishlistButton product={product} className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}