"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search as SearchIcon } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/product"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        setResults(data)
      } catch (error) {
        console.error(error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Axtarış</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-8 flex gap-2"
      >
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Məhsul, kateqoriya axtar..."
            className="pl-10"
            autoFocus
          />
        </div>
        <Button type="submit">Axtar</Button>
      </form>

      {loading ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">Axtarılır...</p>
        </div>
      ) : !query.trim() ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Axtarmaq istədiyiniz sözü yazın
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            “{query}” üzrə heç bir nəticə tapılmadı
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {results.length} nəticə tapıldı
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-8">Yüklənir...</div>}>
      <SearchContent />
    </Suspense>
  )
}