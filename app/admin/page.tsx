"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => {
        if (r.ok) setIsLoggedIn(true)
      })
      .finally(() => setChecking(false))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Şifrə yanlışdır")
      return
    }

    setIsLoggedIn(true)
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    setIsLoggedIn(false)
  }

  if (checking) {
    return <p className="text-center text-muted-foreground">Yoxlanılır...</p>
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-sm">
        <h1 className="mb-6 text-2xl font-bold text-center">Admin Giriş</h1>
        <form onSubmit={handleLogin} className="space-y-4 rounded-xl border bg-card p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Şifrə</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin şifrəsi"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Daxil ol
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Çıxış
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border bg-card p-6 text-left hover:shadow-md transition"
        >
          <h2 className="font-semibold">Məhsullar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Məhsul əlavə et, redaktə et, sil
          </p>
        </button>
        <button
          onClick={() => router.push("/admin/orders")}
          className="rounded-xl border bg-card p-6 text-left hover:shadow-md transition"
        >
          <h2 className="font-semibold">Sifarişlər</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gələn sifarişlərə bax
          </p>
        </button>
        <button
          onClick={() => router.push("/admin/categories")}
          className="rounded-xl border bg-card p-6 text-left hover:shadow-md transition"
        >
          <h2 className="font-semibold">Kateqoriyalar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kateqoriyaları idarə et
          </p>
        </button>
      </div>
    </div>
  )
}