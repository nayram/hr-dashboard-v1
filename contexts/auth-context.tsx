"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getUserDetails } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  lastName: string
  email: string
  phoneNumber: string
  bio: string
  // Add other user properties as needed
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check for token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      setToken(storedToken)
      fetchUserDetails(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  // Fetch user details with token
  const fetchUserDetails = async (authToken: string) => {
    setIsLoading(true)
    try {
      const userData = await getUserDetails(authToken)
      setUser(userData)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch user details:", error)
      logout()
      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      })
    }
  }

  // Login function
  const login = async (authToken: string) => {
    setToken(authToken)
    localStorage.setItem("auth_token", authToken)
    await fetchUserDetails(authToken)
    router.push("/profile")
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
    setIsLoading(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
