"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useWishlistStore } from "@/store/wishlist"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore()

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">Bəyəndikləriniz boşdur</h1>
        <p className="mt-2 text-muted-foreground">
          Bəyəndiyiniz məhsullar burada görünəcək.
        </p>
        <Link href="/" className="mt-6">
          <Button>Məhsullara bax</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Bəyəndiklərim ({items.length})
        </h1>
        <Button variant="ghost" size="sm" onClick={clearWishlist}>
          Hamısını sil
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}