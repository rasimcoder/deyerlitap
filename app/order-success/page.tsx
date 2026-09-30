"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold sm:text-3xl">Sifarişiniz qəbul olundu!</h1>
      <p className="mt-3 text-muted-foreground max-w-md">
        Tezliklə sizinlə əlaqə saxlayacağıq. Sifariş nömrəniz:
      </p>
      {orderId && (
        <p className="mt-2 font-mono text-lg font-semibold">{orderId}</p>
      )}
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button>Ana səhifə</Button>
        </Link>
        <Link href="/cart">
          <Button variant="outline">Səbətə qayıt</Button>
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container py-8 text-center">Yüklənir...</div>}>
      <SuccessContent />
    </Suspense>
  )
}