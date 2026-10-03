import { NextRequest, NextResponse } from "next/server"
import {
  createAdminToken,
  COOKIE_NAME,
  SESSION_MAX_AGE_SEC,
  adminCookieOptions,
} from "@/lib/admin-auth"
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getClientIp,
} from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const key = `admin-login:${ip}`

  const limit = checkRateLimit(key)
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Çox sayda uğursuz cəhd. ${limit.retryAfterSec} saniyə sonra yenidən yoxlayın.`,
        retryAfterSec: limit.retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSec),
        },
      }
    )
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Yanlış sorğu" }, { status: 400 })
  }

  const password = body.password

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    const fail = recordFailedAttempt(key)

    if (fail.locked) {
      return NextResponse.json(
        {
          error: `Hesab müvəqqəti kilidləndi. ${fail.retryAfterSec} saniyə sonra yenidən yoxlayın.`,
          retryAfterSec: fail.retryAfterSec,
        },
        {
          status: 429,
          headers: { "Retry-After": String(fail.retryAfterSec) },
        }
      )
    }

    return NextResponse.json(
      {
        error: `Şifrə yanlışdır. Qalan cəhd: ${fail.remaining}`,
        remaining: fail.remaining,
      },
      { status: 401 }
    )
  }

  // Uğurlu giriş — sayğacı sıfırla
  resetRateLimit(key)

   resetRateLimit(key)

  const token = createAdminToken()
  const response = NextResponse.json({ success: true })

  response.cookies.set(
    COOKIE_NAME,
    token,
    adminCookieOptions(SESSION_MAX_AGE_SEC)
  )

  return response
}