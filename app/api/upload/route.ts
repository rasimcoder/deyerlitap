import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { isAdminAuthenticated } from "@/lib/admin-auth"

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return false

  const allowed = new Set<string>([
    request.nextUrl.origin,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ])

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin)
    } catch {
      // ignore
    }
  }

  if (process.env.VERCEL_URL) {
    allowed.add(`https://${process.env.VERCEL_URL}`)
  }

  return allowed.has(origin)
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Fayl tapılmadı" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Yalnız şəkil yükləyə bilərsiniz" },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Şəkil maksimum 5MB ola bilər" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "deyerlitap",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    })

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Yükləmə zamanı xəta baş verdi" },
      { status: 500 }
    )
  }
}