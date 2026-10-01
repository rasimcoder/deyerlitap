"use client"
import { ImageUpload } from "@/components/admin/image-upload"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Category = {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    oldPrice: "",
    image: "",
    condition: "İşlənmiş",
    categoryId: "",
    isFeatured: false,
    isActive: true,
  })

  useEffect(() => {
  fetch("/api/admin/me").then((r) => {
    if (!r.ok) {
      window.location.href = "/admin"
    }
  })
}, [])

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push("/admin/products")
    } else {
      alert("Xəta baş verdi")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground">
          ← Geri
        </Link>
        <h1 className="text-2xl font-bold">Yeni məhsul</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Başlıq *</label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Təsvir</label>
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Qiymət *</label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Köhnə qiymət</label>
            <Input
              type="number"
              value={form.oldPrice}
              onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Şəkil URL *</label>
         <ImageUpload
  value={form.image}
  onChange={(url) => setForm({ ...form, image: url })}
/>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Vəziyyət</label>
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="Yeni">Yeni</option>
              <option value="İşlənmiş">İşlənmiş</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Kateqoriya *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              required
            >
              <option value="">Seçin</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            />
            Seçilmiş
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Aktiv
          </label>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saxlanılır..." : "Məhsulu əlavə et"}
        </Button>
      </form>
    </div>
  )
}