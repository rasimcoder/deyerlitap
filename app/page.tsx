import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product/product-card"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  const featured = products.filter((p) => p.isFeatured)

  return (
    <div className="container py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Dəyərli Tap
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Bakı və Sumqayıtda yeni və seçilmiş ikinci əl əşyaların satış mərkəzi.
          Antikvardan texnikaya qədər hər tapıntı burada bir dəyərdir!
        </p>
      </section>

      {/* Seçilmiş məhsullar */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Seçilmişlər</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Bütün məhsullar */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Bütün məhsullar</h2>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">Hələ məhsul yoxdur.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}