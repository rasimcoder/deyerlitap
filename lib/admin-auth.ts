import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "crypto"

const COOKIE_NAME = "admin_session"

function sign(value: string): string {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "fallback"
  return createHmac("sha256", secret).update(value).digest("hex")
}

export function createAdminToken(): string {
  const payload = `admin:${Date.now()}`
  return `${payload}.${sign(payload)}`
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return false

  const expected = sign(payload)
  try {
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return verifyAdminToken(token)
}

export { COOKIE_NAME }