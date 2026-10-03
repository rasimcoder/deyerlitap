type Attempt = {
  count: number
  firstAt: number
  lockedUntil: number | null
}

const store = new Map<string, Attempt>()

const WINDOW_MS = 15 * 60 * 1000 // 15 dəqiqə
const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000 // 15 dəqiqə kilid

function cleanup(key: string, now: number) {
  const row = store.get(key)
  if (!row) return

  // Kilid bitibsə sıfırla
  if (row.lockedUntil && row.lockedUntil <= now) {
    store.delete(key)
    return
  }

  // Pəncərə bitibsə sıfırla
  if (!row.lockedUntil && now - row.firstAt > WINDOW_MS) {
    store.delete(key)
  }
}

export function checkRateLimit(key: string): {
  allowed: boolean
  remaining: number
  retryAfterSec: number
} {
  const now = Date.now()
  cleanup(key, now)

  const row = store.get(key)

  if (row?.lockedUntil && row.lockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((row.lockedUntil - now) / 1000),
    }
  }

  const count = row?.count ?? 0
  return {
    allowed: count < MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - count),
    retryAfterSec: 0,
  }
}

export function recordFailedAttempt(key: string): {
  locked: boolean
  remaining: number
  retryAfterSec: number
} {
  const now = Date.now()
  cleanup(key, now)

  const row = store.get(key)

  if (!row) {
    store.set(key, { count: 1, firstAt: now, lockedUntil: null })
    return {
      locked: false,
      remaining: MAX_ATTEMPTS - 1,
      retryAfterSec: 0,
    }
  }

  row.count += 1

  if (row.count >= MAX_ATTEMPTS) {
    row.lockedUntil = now + LOCK_MS
    store.set(key, row)
    return {
      locked: true,
      remaining: 0,
      retryAfterSec: Math.ceil(LOCK_MS / 1000),
    }
  }

  store.set(key, row)
  return {
    locked: false,
    remaining: MAX_ATTEMPTS - row.count,
    retryAfterSec: 0,
  }
}

export function resetRateLimit(key: string) {
  store.delete(key)
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }
  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp
  return "unknown"
}