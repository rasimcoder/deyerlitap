import Link from "next/link"
import { Phone, MapPin } from "lucide-react"
import { prisma } from "@/lib/prisma"

export async function Footer() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    take: 6,
  })

  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Haqqımızda</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Bakı və Sumqayıt üzrə ən dürüst və sərfəli Yeni, İkinci əl əşya,
              antikvar və texnika satış mərkəzi. Hər tapıntı bir dəyərdir!
            </p>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Bakı və Sumqayıta çatdırılma pulsuzdur!
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Kateqoriyalar</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-accent transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Əlaqə</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+994705282892" className="hover:text-accent transition">
                  070 528-28-92
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Bakı - Sumqayıt</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} Dəyərli Tap. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  )
}