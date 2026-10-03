import { NextResponse } from "next/server"
import { COOKIE_NAME, adminCookieOptions } from "@/lib/admin-auth"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, "", adminCookieOptions(0))
  return response
}