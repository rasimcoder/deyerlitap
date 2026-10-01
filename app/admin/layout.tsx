import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold">
              Admin Panel
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin" className="hover:text-primary transition">
                Dashboard
              </Link>
              <Link href="/admin/products" className="hover:text-primary transition">
                Məhsullar
              </Link>
              <Link href="/admin/orders" className="hover:text-primary transition">
                Sifarişlər
              </Link>
              <Link href="/admin/categories" className="hover:text-primary transition">
                Kateqoriyalar
              </Link>
            </nav>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Sayta qayıt
          </Link>
        </div>
      </header>
      <main className="container py-8 px-4">{children}</main>
    </div>
  )
}