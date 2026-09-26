"use client"

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Dəyərli Tap</span>
        </Link>

        {/* Axtarış - Desktop */}
        <div className="hidden flex-1 max-w-md mx-6 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Məhsul axtar..."
              className="w-full pl-10 bg-background text-foreground"
            />
          </div>
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
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
      0
    </span>
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
      <Link href="/categories" className="text-lg font-medium hover:text-accent transition">
        Kateqoriyalar
      </Link>
      <Link href="/wishlist" className="text-lg font-medium hover:text-accent transition">
        Bəyəndiklərim
      </Link>
      <Link href="/cart" className="text-lg font-medium hover:text-accent transition">
        Səbət
      </Link>
    </nav>
  </SheetContent>
</Sheet>
        </div>
      </div>

      {/* Kateqoriya zolağı - Desktop */}
      <div className="hidden border-t border-primary-foreground/10 bg-primary/95 md:block">
        <div className="container mx-auto flex items-center gap-6 overflow-x-auto px-4 py-2 text-sm">
          <Link href="/categories/yeni" className="whitespace-nowrap hover:text-accent transition">Yeni</Link>
          <Link href="/categories/isinmis" className="whitespace-nowrap hover:text-accent transition">İşlənmiş</Link>
          <Link href="/categories/elektronika" className="whitespace-nowrap hover:text-accent transition">Elektronika</Link>
          <Link href="/categories/neqliyyat" className="whitespace-nowrap hover:text-accent transition">Nəqliyyat</Link>
          <Link href="/categories/ev-ve-bag" className="whitespace-nowrap hover:text-accent transition">Ev və Bağ</Link>
          <Link href="/categories/sexsi-esya" className="whitespace-nowrap hover:text-accent transition">Şəxsi Əşyalar</Link>
          <Link href="/categories/diger" className="whitespace-nowrap hover:text-accent transition">Digər</Link>
        </div>
      </div>
    </header>
  )
}