"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useCartStore } from "@/store/cart"
import Link from "next/link"
import { Search, ShoppingCart, Heart, Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const totalItemsFromStore = useCartStore((state) => state.totalItems())
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState<NavCategory[]>([])

useEffect(() => {
  setMounted(true)
}, [])

const totalItems = mounted ? totalItemsFromStore : 0

type NavCategory = {
  id: string
  name: string
  slug: string
}



useEffect(() => {
  fetch("/api/categories")
    .then((r) => r.json())
    .then(setCategories)
    .catch(() => setCategories([]))
}, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Dəyərli Tap</span>
        </Link>

        {/* Axtarış - Desktop */}
<div className="hidden flex-1 max-w-md mx-6 md:flex">
  <form
    onSubmit={(e) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    }}
    className="relative w-full"
  >
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Məhsul axtar..."
      className="w-full pl-10 bg-background text-foreground"
    />
  </form>
</div>

        {/* Sağ tərəf ikonları */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/80"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

 {/* Wishlist */}
<Link href="/wishlist" className="hidden sm:flex">
  <Button
    variant="ghost"
    size="icon"
    className="text-primary-foreground hover:bg-primary/80"
  >
    <Heart className="h-5 w-5" />
  </Button>
</Link>

     {/* Cart */}
<Link href="/cart" className="relative">
  <Button
    variant="ghost"
    size="icon"
    className="text-primary-foreground hover:bg-primary/80"
  >
    <ShoppingCart className="h-5 w-5" />
    {totalItems > 0 && (
  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
    {totalItems}
  </span>
)}
  </Button>
</Link>

   {/* Mobile menu */}
<Sheet>
  <SheetTrigger className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-primary-foreground hover:bg-primary/80 transition-colors">
    <Menu className="h-5 w-5" />
  </SheetTrigger>

  <SheetContent side="left" className="w-72">
  <nav className="flex flex-col gap-4 mt-8">
    <Link href="/" className="text-lg font-medium hover:text-accent transition">
      Ana səhifə
    </Link>
    <Link
      href="/categories"
      className="text-lg font-medium hover:text-accent transition"
    >
      Bütün kateqoriyalar
    </Link>

    {categories.length > 0 && (
      <div className="border-t pt-4 space-y-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          Kateqoriyalar
        </p>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="block text-base hover:text-accent transition"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    )}

    <div className="border-t pt-4 space-y-3">
      <Link
        href="/wishlist"
        className="block text-lg font-medium hover:text-accent transition"
      >
        Bəyəndiklərim
      </Link>
      <Link
        href="/cart"
        className="block text-lg font-medium hover:text-accent transition"
      >
        Səbət
      </Link>
    </div>
  </nav>
</SheetContent>
</Sheet>
        </div>
      </div>

     {/* Kateqoriya zolağı - Desktop */}
{categories.length > 0 && (
  <div className="hidden border-t border-primary-foreground/10 bg-primary/95 md:block">
    <div className="container mx-auto flex items-center gap-6 overflow-x-auto px-4 py-2 text-sm">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          className="whitespace-nowrap hover:text-accent transition"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  </div>
)}
    </header>
  )
}