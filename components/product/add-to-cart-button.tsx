"use client"

import { ShoppingCart } from "lucide-react"
import { Product } from "@/types/product"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"

type Props = {
  product: Product
}

export function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <Button
      size="lg"
      className="flex-1 gap-2"
      onClick={() => addItem(product)}
    >
      <ShoppingCart className="h-5 w-5" />
      Səbətə at
    </Button>
  )
}