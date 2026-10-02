import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdminAuthenticated } from "@/lib/admin-auth"

const SOLD_STATUSES = ["confirmed", "shipped", "delivered"]

function getDateRange(range: string, from?: string | null, to?: string | null) {
  const now = new Date()
  const startOfDay = (d: Date) => {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    return x
  }
  const endOfDay = (d: Date) => {
    const x = new Date(d)
    x.setHours(23, 59, 59, 999)
    return x
  }

  switch (range) {
    case "today":
      return { gte: startOfDay(now), lte: endOfDay(now) }
    case "week": {
      const gte = startOfDay(now)
      gte.setDate(gte.getDate() - 6)
      return { gte, lte: endOfDay(now) }
    }
    case "month": {
      const gte = new Date(now.getFullYear(), now.getMonth(), 1)
      return { gte, lte: endOfDay(now) }
    }
    case "year": {
      const gte = new Date(now.getFullYear(), 0, 1)
      return { gte, lte: endOfDay(now) }
    }
    case "last_month": {
      const gte = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lte = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
      return { gte, lte }
    }
    case "last_year": {
      const y = now.getFullYear() - 1
      return {
        gte: new Date(y, 0, 1),
        lte: new Date(y, 11, 31, 23, 59, 59, 999),
      }
    }
    case "custom": {
      if (from && to) {
        return { gte: startOfDay(new Date(from)), lte: endOfDay(new Date(to)) }
      }
      return null
    }
    case "all":
    default:
      return null
  }
}

function formatDay(d: Date) {
  return d.toISOString().slice(0, 10)
}

function formatMonth(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const range = searchParams.get("range") || "month"
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const dateFilter = getDateRange(range, from, to)

  const orderWhere = {
    status: { in: SOLD_STATUSES },
    ...(dateFilter ? { createdAt: dateFilter } : {}),
  }

  const [soldOrders, pendingOrders, activeProducts, outOfStock, allSoldForYears] =
    await Promise.all([
      prisma.order.findMany({
        where: orderWhere,
        select: {
          id: true,
          total: true,
          createdAt: true,
          items: {
            select: {
              price: true,
              costPrice: true,
              quantity: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 0 } } }),
      prisma.order.findMany({
        where: { status: { in: SOLD_STATUSES } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ])

  const revenue = soldOrders.reduce((sum, o) => sum + o.total, 0)
  const ordersCount = soldOrders.length
  const averageOrder = ordersCount > 0 ? revenue / ordersCount : 0

  // Xalis qazanc
  let profit = 0
  for (const o of soldOrders) {
    for (const item of o.items) {
      profit += (item.price - (item.costPrice ?? 0)) * item.quantity
    }
  }

  const margin =
    revenue > 0 ? Math.round((profit / revenue) * 1000) / 10 : 0

  // salesOverTime
  const useDaily = ["today", "week", "month", "last_month"].includes(range)
  const bucketMap = new Map<string, { revenue: number; orders: number }>()

  for (const o of soldOrders) {
    const key = useDaily ? formatDay(o.createdAt) : formatMonth(o.createdAt)
    const prev = bucketMap.get(key) || { revenue: 0, orders: 0 }
    prev.revenue += o.total
    prev.orders += 1
    bucketMap.set(key, prev)
  }

  const salesOverTime = Array.from(bucketMap.entries()).map(([label, v]) => ({
    label,
    revenue: Math.round(v.revenue * 100) / 100,
    orders: v.orders,
  }))

  // salesByYear
  const yearMap = new Map<string, { revenue: number; orders: number }>()
  for (const o of allSoldForYears) {
    const y = String(o.createdAt.getFullYear())
    const prev = yearMap.get(y) || { revenue: 0, orders: 0 }
    prev.revenue += o.total
    prev.orders += 1
    yearMap.set(y, prev)
  }

  const salesByYear = Array.from(yearMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, v]) => ({
      year,
      revenue: Math.round(v.revenue * 100) / 100,
      orders: v.orders,
    }))

  return NextResponse.json({
    kpis: {
      revenue: Math.round(revenue * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      margin,
      ordersCount,
      averageOrder: Math.round(averageOrder * 100) / 100,
      pendingOrders,
      activeProducts,
      outOfStock,
    },
    salesOverTime,
    salesByYear,
    range,
  })
}