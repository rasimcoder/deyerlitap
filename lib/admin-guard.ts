import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

/**
 * Admin mutasiyaları üçün:
 * 1) Authentication
 * 2) Origin / Referer yoxlaması (CSRF-ə qarşı)
 * 3) JSON Content-Type (POST/PUT/PATCH)
 */
export async function requireAdminMutation(request: NextRequest): Promise<
  | { ok: true }
  | { ok: false; response: NextResponse }
> {
  // 1. Auth
  if (!(await isAdminAuthenticated())) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  // 2. Yalnız dəyişən metodlar üçün origin yoxla
  const method = request.method.toUpperCase()
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    if (!isAllowedOrigin(request)) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Invalid origin" },
          { status: 403 }
        ),
      }
    }
  }

  // 3. Body olan metodlarda JSON tələb et
  if (["POST", "PUT", "PATCH"].includes(method)) {
    const contentType = request.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Content-Type application/json olmalıdır" },
          { status: 415 }
        ),
      }
    }
  }

  return { ok: true }
}

/** Yalnız oxuma (GET) — auth kifayətdir */
export async function requireAdminRead(): Promise<
  | { ok: true }
  | { ok: false; response: NextResponse }
> {
  if (!(await isAdminAuthenticated())) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }
  return { ok: true }
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")

  const allowed = getAllowedOrigins(request)

  if (origin) {
    return allowed.some((a) => origin === a)
  }

  // Bəzi brauzerlər same-site-də Origin göndərməyə bilər — Referer yoxla
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin
      return allowed.some((a) => refOrigin === a)
    } catch {
      return false
    }
  }

  // Origin və Referer yoxdursa (şübhəli) — rədd et
  return false
}

function getAllowedOrigins(request: NextRequest): string[] {
  const list = new Set<string>()

  // Cari host (localhost və production)
  try {
    list.add(request.nextUrl.origin)
  } catch {
    // ignore
  }

  // Env-dən əlavə (Vercel production URL və domain)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (siteUrl) {
    try {
      list.add(new URL(siteUrl).origin)
    } catch {
      // ignore
    }
  }

  // Vercel system
  if (process.env.VERCEL_URL) {
    list.add(`https://${process.env.VERCEL_URL}`)
  }

  // Lokal development
  list.add("http://localhost:3000")
  list.add("http://127.0.0.1:3000")

  return Array.from(list)
}