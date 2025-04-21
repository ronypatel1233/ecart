"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

// Pages that don't require authentication
const PUBLIC_PATHS = [
  "/admin/login",
  "/",
  "/products"
]

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      setIsChecking(true)

      // Allow access to public paths
      if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        setIsChecking(false)
        return
      }

      // Check if path is in admin section
      const isAdminPath = pathname.startsWith("/admin")

      // If in admin section and not authenticated, redirect to login
      if (isAdminPath && (!isAuthenticated || user?.role !== "admin")) {
        router.push("/admin/login")
        return
      }

      // For other protected routes, redirect if not authenticated
      if (!isAuthenticated) {
        router.push("/admin/login")
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [isAuthenticated, user, pathname, router])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return <>{children}</>
}
