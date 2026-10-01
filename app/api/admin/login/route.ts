import { NextRequest, NextResponse } from "next/server"
import { createAdminToken, COOKIE_NAME } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Şifrə yanlışdır" }, { status: 401 })
  }

  const token = createAdminToken()

  const response = NextResponse.json({ success: true })

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  })

  return response
}