import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileNav } from "@/components/layout/mobile-nav"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Dəyərli Tap – Yeni və İkinci Əl Əşyalar",
    template: "%s | Dəyərli Tap",
  },
  description:
    "Bakı və Sumqayıtda yeni və seçilmiş ikinci əl əşyaların satış mərkəzi. Antikvar, elektronika, mebel və digər nadir tapıntılar.",
  keywords: [
    "ikinci əl",
    "yeni əşya",
    "antikvar",
    "Bakı",
    "Sumqayıt",
    "mebel",
    "elektronika",
    "Dəyərli Tap",
  ],
  authors: [{ name: "Dəyərli Tap" }],
  openGraph: {
    type: "website",
    locale: "az_AZ",
    siteName: "Dəyərli Tap",
    title: "Dəyərli Tap – Yeni və İkinci Əl Əşyalar",
    description:
      "Bakı və Sumqayıtda yeni və seçilmiş ikinci əl əşyaların satış mərkəzi.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}