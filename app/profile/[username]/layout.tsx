import type React from "react"
export default function PublicProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No authentication check - public access
  return <>{children}</>
}
