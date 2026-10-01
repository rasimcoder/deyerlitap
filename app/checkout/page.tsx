"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "Bakı",
    address: "",
    note: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold">Səbətiniz boşdur</h1>
        <p className="mt-2 text-muted-foreground">
          Sifariş vermək üçün əvvəlcə məhsul əlavə edin.
        </p>
        <Link href="/" className="mt-6">
          <Button>Alış-verişə başla</Button>
        </Link>
      </div>
    )
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Zəhmət olmasa bütün məcburi xanaları doldurun.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          total: totalPrice(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Xəta baş verdi")
        setIsSubmitting(false)
        return
      }

      clearCart()
      router.push(`/order-success?id=${data.id}`)
    } catch {
      setError("Şəbəkə xətası. Yenidən cəhd edin.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Sifarişi rəsmiləşdir</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Çatdırılma məlumatları</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Ad Soyad *
                </label>
                <Input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Adınız və soyadınız"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Telefon *
                </label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="070 123-45-67"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Şəhər</label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Bakı">Bakı</option>
                <option value="Sumqayıt">Sumqayıt</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Ünvan *
              </label>
              <Input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Küçə, ev, mənzil"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Qeyd (istəyə bağlı)
              </label>
              <Input
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Əlavə qeydiniz..."
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Göndərilir..." : "Sifarişi təsdiqlə"}
          </Button>
        </form>

        <div className="h-fit rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Sifariş xülasəsi</h2>
          <Separator className="my-4" />

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground line-clamp-1 pr-2">
                  {item.title} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  {item.price * item.quantity} ₼
                </span>
              </div>
            ))}
          </div>

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
        </div>
      </div>
    </div>
  )
}