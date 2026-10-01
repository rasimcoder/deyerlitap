"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Product = {
  id: string
  title: string
  price: number
  oldPrice: number | null
  image: string
  condition: string
  isFeatured: boolean
  isActive: boolean
  category: { name: string } | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    const res = await fetch("/api/admin/products")
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Bu məhsulu silmək istəyirsiniz?")) return

    await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    loadProducts()
  }

  if (loading) {
    return <p>Yüklənir...</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Məhsullar</h1>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Yeni məhsul
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 rounded-xl border bg-card p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{product.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {product.price} ₼
                </span>
                {product.category && <span>• {product.category.name}</span>}
                <Badge variant="secondary" className="text-xs">
                  {product.condition}
                </Badge>
                {product.isFeatured && (
                  <Badge className="text-xs">Seçilmiş</Badge>
                )}
                {!product.isActive && (
                  <Badge variant="destructive" className="text-xs">
                    Deaktiv
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/admin/products/${product.id}`}>
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Hələ məhsul yoxdur.
          </p>
        )}
      </div>
    </div>
  )
}