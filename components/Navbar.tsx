"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { cart } = useCart()
  const { isAuthenticated, user, logout } = useAuth()

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-600">ShopEase</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/" ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"
                  }`}
                >
                  Home
                </Link>
                {isAuthenticated && user?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === "/admin/dashboard" ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
                    <User className="h-5 w-5 mr-1" />
                    <span>{user?.name || "User"}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/admin/login" className="text-gray-700 hover:text-indigo-600 font-medium">
                  Sign in
                </Link>
              )}
            </div>
          </div>
          <div className="flex md:hidden">
            <Link href="/cart" className="relative p-2 mr-2 text-gray-700 hover:text-indigo-600">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/" ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/admin/dashboard" ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="px-4">
                <div className="text-base font-medium text-gray-800">{user?.name || "User"}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="mt-3 block w-full px-4 py-2 text-base font-medium text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="px-4">
                <Link
                  href="/admin/login"
                  className="block w-full px-4 py-2 text-base font-medium text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
