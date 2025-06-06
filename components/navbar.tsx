"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import { User } from "lucide-react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()

  // Check if we're on a public profile page
  const isPublicProfilePage = pathname?.startsWith("/view/")

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/kaatch-logo.svg" alt="Kaatch" width={120} height={30} className="h-8 w-auto" priority />
        </Link>

        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{user?.name || "Profile"}</span>
              </Link>
              <LogoutButton showConfirmDialog={false} />
            </>
          ) : (
            // Only show sign-in button if not on a public profile page
            !isPublicProfilePage && (
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
