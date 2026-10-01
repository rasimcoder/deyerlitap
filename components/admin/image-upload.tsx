"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError("")
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Xəta baş verdi")
        return
      }

      onChange(data.url)
    } catch {
      setError("Şəbəkə xətası")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Şəkil *</label>

      {value ? (
        <div className="relative w-full max-w-xs aspect-square overflow-hidden rounded-xl border">
          <Image
            src={value}
            alt="Məhsul şəkli"
            fill
            className="object-cover"
            sizes="320px"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex w-full max-w-xs aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition hover:border-primary/50 hover:bg-muted/50",
            uploading && "opacity-60"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Yüklənir...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Şəkil seç / burax
              </span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG • max 5MB
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />

      {/* Alternativ: URL ilə də əlavə etmək olar */}
      <div className="max-w-xs">
        <p className="mb-1.5 text-xs text-muted-foreground">
          və ya şəkil URL-i yapışdır:
        </p>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}