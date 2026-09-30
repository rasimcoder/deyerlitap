import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoryNotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold">Kateqoriya tapılmadı</h1>
      <p className="mt-4 text-muted-foreground">
        Axtardığınız kateqoriya mövcud deyil.
      </p>
      <Link href="/categories" className="mt-8">
        <Button>Kateqoriyalara qayıt</Button>
      </Link>
    </div>
  )
}