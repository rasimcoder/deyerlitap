import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProductNotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold">Məhsul tapılmadı</h1>
      <p className="mt-4 text-muted-foreground">
        Axtardığınız məhsul mövcud deyil və ya silinib.
      </p>

      <Link href="/" className="mt-8">
        <Button>Ana səhifəyə qayıt</Button>
      </Link>
    </div>
  )
}