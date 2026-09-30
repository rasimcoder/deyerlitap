"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { Product } from "@/types/product"
import { useWishlistStore } from "@/store/wishlist"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  product: Product
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export function WishlistButton({ product, className, size = "icon" }: Props) {
  const { toggleItem, isInWishlist } = useWishlistStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const active = mounted ? isInWishlist(product.id) : false

  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(product)
      }}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition",
          active ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </Button>
  )
}