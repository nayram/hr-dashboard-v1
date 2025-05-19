import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

// Keep this file as is - it protects the main profile page with authentication
// But the [username] route will use its own layout that doesn't require authentication
