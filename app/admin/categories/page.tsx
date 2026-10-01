"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  _count?: { products: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", slug: "", description: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
  fetch("/api/admin/me").then((r) => {
    if (!r.ok) {
      window.location.href = "/admin"
    }
  })
}, [])

  const load = async () => {
    const res = await fetch("/api/admin/categories?withCount=1")
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setForm({ name: "", slug: "", description: "" })
      setShowForm(false)
      load()
    } else {
      const data = await res.json()
      alert(data.error || "Xəta baş verdi")
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kateqoriyanı silmək istəyirsiniz? Məhsulları olan kateqoriyanı silmək olmaz.")) return

    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    if (res.ok) {
      load()
    } else {
      const data = await res.json()
      alert(data.error || "Silinmədi")
    }
  }

  // Avtomatik slug
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/ə/g, "e")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setForm({ ...form, name, slug })
  }

  if (loading) return <p>Yüklənir...</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kateqoriyalar</h1>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Yeni kateqoriya
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 space-y-3 rounded-xl border bg-card p-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium">Ad *</label>
            <Input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Slug *</label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
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
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saxlanılır..." : "Əlavə et"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Ləğv et
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-xl border bg-card p-4"
          >
            <div>
              <h3 className="font-medium">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">
                /{cat.slug}
                {cat._count && ` • ${cat._count.products} məhsul`}
              </p>
              {cat.description && (
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive"
              onClick={() => handleDelete(cat.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            Hələ kateqoriya yoxdur.
          </p>
        )}
      </div>
    </div>
  )
}