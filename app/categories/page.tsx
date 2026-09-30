import Link from "next/link"
import { categories } from "@/data/categories"
import { products } from "@/data/products"

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Kateqoriyalar</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = products.filter((p) => {
            // Sadə uyğunlaşdırma (mock data üçün)
            if (category.slug === "yeni") return p.condition === "Yeni"
            if (category.slug === "isinmis") return p.condition === "İşlənmiş"
            return p.category.toLowerCase().includes(
              category.name.toLowerCase().slice(0, 4)
            )
          }).length

          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group rounded-xl border bg-card p-6 transition hover:shadow-md hover:border-primary/30"
            >
              <h2 className="text-lg font-semibold group-hover:text-primary transition">
                {category.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.description}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                {count} məhsul
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}