"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, Heart, ShoppingCart, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", label: "Ana", icon: Home },
  { href: "/categories", label: "Kateqoriya", icon: LayoutGrid },
  { href: "/search", label: "Axtar", icon: Search },
  { href: "/wishlist", label: "Bəyən", icon: Heart },
  { href: "/cart", label: "Səbət", icon: ShoppingCart },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs transition",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}