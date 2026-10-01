"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

type OrderItem = {
  title: string
  price: number
  quantity: number
}

type Order = {
  id: string
  fullName: string
  phone: string
  city: string
  address: string
  note: string | null
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

const statusOptions = [
  { value: "pending", label: "Gözləyir" },
  { value: "confirmed", label: "Təsdiqləndi" },
  { value: "shipped", label: "Göndərildi" },
  { value: "delivered", label: "Çatdırıldı" },
  { value: "cancelled", label: "Ləğv edildi" },
]

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    load()
  }

  if (loading) return <p>Yüklənir...</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Sifarişlər</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{order.fullName}</p>
                <p className="text-sm text-muted-foreground">{order.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {order.city}, {order.address}
                </p>
                {order.note && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Qeyd: {order.note}
                  </p>
                )}
              </div>

              <div className="text-right space-y-2">
                <Badge className={statusColor[order.status] || ""}>
                  {statusOptions.find((s) => s.value === order.status)?.label ||
                    order.status}
                </Badge>
                <p className="text-lg font-bold">{order.total} ₼</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("az-AZ")}
                </p>

                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="mt-2 flex h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 border-t pt-3 space-y-1">
              {order.items.map((item, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  {item.title} × {item.quantity} — {item.price * item.quantity} ₼
                </p>
              ))}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            Hələ sifariş yoxdur.
          </p>
        )}
      </div>
    </div>
  )
}