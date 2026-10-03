import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "crypto"

export const COOKIE_NAME = "admin_session"

/** Session müddəti: 8 saat (saniyə) */
export const SESSION_MAX_AGE_SEC = 60 * 60 * 8

function getSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "fallback"
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex")
}

/**
 * Token formatı: admin:<issuedAtMs>:<expiresAtMs>.<signature>
 */
export function createAdminToken(): string {
  const issuedAt = Date.now()
  const expiresAt = issuedAt + SESSION_MAX_AGE_SEC * 1000
  const payload = `admin:${issuedAt}:${expiresAt}`
  return `${payload}.${sign(payload)}`
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false

  const lastDot = token.lastIndexOf(".")
  if (lastDot === -1) return false

  const payload = token.slice(0, lastDot)
  const signature = token.slice(lastDot + 1)
  if (!payload || !signature) return false

  const expected = sign(payload)

  try {
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    if (!timingSafeEqual(a, b)) return false
  } catch {
    return false
  }

  // payload: admin:issuedAt:expiresAt
  const parts = payload.split(":")
  if (parts.length !== 3 || parts[0] !== "admin") return false

  const expiresAt = Number(parts[2])
  if (!Number.isFinite(expiresAt)) return false

  // Vaxt bitibsə etibarsız
  if (Date.now() > expiresAt) return false

  return true
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return verifyAdminToken(token)
}

/** Cookie seçimləri — login və logout eyni olsun */
export function adminCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  }
}