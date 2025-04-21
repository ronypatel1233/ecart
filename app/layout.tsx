import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import AuthGuard from "@/components/AuthGuard"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopEase - Your One-Stop Shop",
  description: "E-commerce platform with a wide range of products",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <AuthGuard>
              <Navbar />
              {children}
            </AuthGuard>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
