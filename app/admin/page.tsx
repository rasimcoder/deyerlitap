"use client"
import {
  SalesTrendChart,
  SalesByYearChart,
  CategoryPieChart,
  TopProductsTable,
} from "@/components/admin/sales-charts"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


type Kpis = {
  revenue: number
  profit: number
  margin: number
  ordersCount: number
  averageOrder: number
  pendingOrders: number
  activeProducts: number
  outOfStock: number
}

const RANGE_OPTIONS = [
  { value: "today", label: "Bu gün" },
  { value: "week", label: "Bu həftə" },
  { value: "month", label: "Bu ay" },
  { value: "year", label: "Bu il" },
  { value: "last_month", label: "Keçən ay" },
  { value: "last_year", label: "Keçən il" },
  { value: "all", label: "Bütün vaxt" },
]

export default function AdminPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checking, setChecking] = useState(true)

  const [range, setRange] = useState("month")
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [loadingKpis, setLoadingKpis] = useState(false)

  const [salesOverTime, setSalesOverTime] = useState<
    { label: string; revenue: number; orders: number }[]
  >([])
  const [salesByYear, setSalesByYear] = useState<
    { year: string; revenue: number; orders: number }[]
  >([])

  const [topCategories, setTopCategories] = useState<
    { name: string; revenue: number; quantity: number }[]
  >([])
  const [topProducts, setTopProducts] = useState<
    { title: string; revenue: number; quantity: number }[]
  >([])


  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => {
        if (r.ok) setIsLoggedIn(true)
      })
      .finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return

    setLoadingKpis(true)
    fetch(`/api/admin/analytics?range=${range}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.kpis) setKpis(data.kpis)
      if (data.salesOverTime) setSalesOverTime(data.salesOverTime)
      if (data.salesByYear) setSalesByYear(data.salesByYear)
      if (data.topCategories) setTopCategories(data.topCategories)
      if (data.topProducts) setTopProducts(data.topProducts)
      })
      .finally(() => setLoadingKpis(false))
  }, [isLoggedIn, range])

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
    setKpis(null)
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Çıxış
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {loadingKpis || !kpis ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border bg-muted/50"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard
            title="Gəlir"
            value={`${kpis.revenue.toLocaleString("az-AZ")} ₼`}
            hint="Təsdiqlənmiş satışlar"
          />
          <KpiCard
            title="Xalis qazanc"
            value={`${kpis.profit.toLocaleString("az-AZ")} ₼`}
            hint={`Marja: ${kpis.margin}%`}
            accent={kpis.profit < 0}
          />
          <KpiCard
            title="Sifariş sayı"
            value={String(kpis.ordersCount)}
            hint="Seçilmiş dövrdə"
          />
          <KpiCard
            title="Orta sifariş"
            value={`${kpis.averageOrder.toLocaleString("az-AZ")} ₼`}
            hint="Gəlir ÷ sifariş"
          />
          <KpiCard
            title="Gözləyən sifariş"
            value={String(kpis.pendingOrders)}
            hint="Status: pending"
            accent={kpis.pendingOrders > 0}
          />
          <KpiCard
            title="Aktiv məhsul"
            value={String(kpis.activeProducts)}
            hint="Saytda görünən"
          />
          <KpiCard
            title="Stok bitib"
            value={String(kpis.outOfStock)}
            hint="stock = 0"
            accent={kpis.outOfStock > 0}
          />
        </div>
      )}

      {/* Charts */}
      {!loadingKpis && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesTrendChart
            data={salesOverTime}
            title="Seçilmiş dövr – satış trendi"
          />
          <SalesByYearChart
            data={salesByYear.map((y) => ({
              year: y.year,
              revenue: y.revenue,
              orders: y.orders,
            }))}
          />
          {!loadingKpis && (
            <div className="grid gap-6 lg:grid-cols-2">
              <CategoryPieChart data={topCategories} />
              <TopProductsTable data={topProducts} />
            </div>
          )}
        </div>
      )}
      {/* Qısa keçidlər */}
      <div className="grid gap-4 sm:grid-cols-3">
        <button
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border bg-card p-6 text-left transition hover:shadow-md"
        >
          <h2 className="font-semibold">Məhsullar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Əlavə et, redaktə et, sil
          </p>
        </button>
        <button
          onClick={() => router.push("/admin/orders")}
          className="rounded-xl border bg-card p-6 text-left transition hover:shadow-md"
        >
          <h2 className="font-semibold">Sifarişlər</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Status dəyiş, bax
          </p>
        </button>
        <button
          onClick={() => router.push("/admin/categories")}
          className="rounded-xl border bg-card p-6 text-left transition hover:shadow-md"
        >
          <h2 className="font-semibold">Kateqoriyalar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kateqoriya idarə et
          </p>
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Qeyd: Gəlir yalnız <strong>təsdiqlənmiş / göndərilmiş / çatdırılmış</strong> sifarişlərdən
        hesablanır. Ləğv edilənlər daxil deyil.
      </p>
    </div>
  )
}

function KpiCard({
  title,
  value,
  hint,
  accent,
}: {
  title: string
  value: string
  hint: string
  accent?: boolean
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p
        className={`mt-2 text-2xl font-bold ${accent ? "text-destructive" : "text-foreground"
          }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}