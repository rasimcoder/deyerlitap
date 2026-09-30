"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">Səbətiniz boşdur</h1>
        <p className="mt-2 text-muted-foreground">
          Hələ heç bir məhsul əlavə etməmisiniz.
        </p>
        <Link href="/" className="mt-6">
          <Button>Alış-verişə başla</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Səbət</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Səbəti təmizlə
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Məhsullar */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border bg-card p-4"
            >
              <Link
                href={`/product/${item.id}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/product/${item.id}`}
                  className="font-medium line-clamp-2 hover:text-primary transition"
                >
                  {item.title}
                </Link>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {item.price * item.quantity} ₼
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Xülasə */}
        <div className="h-fit rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Sifariş xülasəsi</h2>
          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Məhsullar</span>
              <span>{totalPrice()} ₼</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Çatdırılma</span>
              <span className="text-green-600">Pulsuz</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-lg font-bold">
            <span>Cəmi</span>
            <span>{totalPrice()} ₼</span>
          </div>

          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full" size="lg">
              Sifarişi rəsmiləşdir
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}