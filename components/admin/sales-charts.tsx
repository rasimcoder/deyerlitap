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