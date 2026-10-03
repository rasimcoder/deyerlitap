"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart, Pie, Cell, Legend
} from "recharts"

type Point = {
  label?: string
  year?: string
  revenue: number
  orders: number
}

function tooltipFormatter(value: unknown, name: unknown) {
  const num = typeof value === "number" ? value : Number(value) || 0
  const key = String(name)
  return [
    key === "revenue" ? `${num} ₼` : num,
    key === "revenue" ? "Gəlir" : "Sifariş",
  ] as [string | number, string]
}

export function SalesTrendChart({
  data,
  title,
}: {
  data: Point[]
  title: string
}) {
  if (!data.length) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">{title}</h3>
        <p className="py-12 text-center text-sm text-muted-foreground">
          Bu dövrdə satış yoxdur
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function SalesByYearChart({ data }: { data: Point[] }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">İllər üzrə satış</h3>
        <p className="py-12 text-center text-sm text-muted-foreground">
          Hələ təsdiqlənmiş satış yoxdur
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 font-semibold">İllər üzrə satış</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={tooltipFormatter} />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


const PIE_COLORS = [
  "#0f172a",
  "#d4a017",
  "#334155",
  "#64748b",
  "#94a3b8",
  "#f59e0b",
  "#1e293b",
  "#a16207",
]

type CategoryPoint = {
  name: string
  revenue: number
  quantity: number
}

type ProductPoint = {
  title: string
  revenue: number
  quantity: number
}

export function CategoryPieChart({ data }: { data: CategoryPoint[] }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">Kateqoriyalar üzrə satış</h3>
        <p className="py-12 text-center text-sm text-muted-foreground">
          Bu dövrdə satış yoxdur
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 font-semibold">Kateqoriyalar üzrə satış</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="revenue"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `${Number(value)} ₼`,
                "Gəlir",
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function TopProductsTable({ data }: { data: ProductPoint[] }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 font-semibold">Top məhsullar</h3>
        <p className="py-12 text-center text-sm text-muted-foreground">
          Bu dövrdə satış yoxdur
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 font-semibold">Top məhsullar</h3>
      <div className="max-h-80 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 pr-2 font-medium">#</th>
              <th className="pb-2 pr-2 font-medium">Məhsul</th>
              <th className="pb-2 pr-2 font-medium text-right">Ədəd</th>
              <th className="pb-2 font-medium text-right">Gəlir</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2.5 pr-2 text-muted-foreground">{i + 1}</td>
                <td className="py-2.5 pr-3 font-medium min-w-[140px] max-w-[280px]">
                  <span className="block break-words leading-snug" title={p.title}>
                    {p.title}
                  </span>
                </td>
                <td className="py-2.5 pr-2 text-right">{p.quantity}</td>
                <td className="py-2.5 text-right font-semibold">
                  {p.revenue.toLocaleString("az-AZ")} ₼
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}