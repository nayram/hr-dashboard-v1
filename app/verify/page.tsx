"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { verifyToken } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
// Import the VerificationPlaceholder component
import { VerificationPlaceholder } from "@/components/verification-placeholder"

// Update the component to handle the case when no token is provided
export default function VerifyPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const { login } = useAuth()
  const { toast } = useToast()

  const [shouldVerify, setShouldVerify] = useState(false)

  useEffect(() => {
    if (token) {
      setShouldVerify(true)
    } else {
      setShouldVerify(false)
    }
  }, [token])

  useEffect(() => {
    const verifyUserToken = async () => {
      if (shouldVerify) {
        try {
          setVerificationStatus("loading")
          const response = await verifyToken(token)
          await login(response.token)
          setVerificationStatus("success")
          toast({
            title: "Verification Successful",
            description: "You have been successfully logged in.",
          })
        } catch (error) {
          console.error("Verification error:", error)
          setVerificationStatus("error")
          setErrorMessage(error instanceof Error ? error.message : "Failed to verify your email")
          toast({
            title: "Verification Failed",
            description: error instanceof Error ? error.message : "Failed to verify your email",
            variant: "destructive",
          })
        }
      }
    }

    verifyUserToken()
  }, [token, login, toast, shouldVerify])

  // If no token is provided, show the placeholder component
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <VerificationPlaceholder />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>Verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
          {verificationStatus === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h3 className="text-lg font-medium">Verifying your email</h3>
              <p className="text-sm text-gray-500">Please wait while we verify your email address...</p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h3 className="text-lg font-medium">Verification Successful</h3>
              <p className="text-sm text-gray-500">Your email has been verified successfully.</p>
              <Button asChild className="mt-4">
                <Link href="/profile">Go to Profile</Link>
              </Button>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <h3 className="text-lg font-medium">Verification Failed</h3>
              <p className="text-sm text-gray-500">{errorMessage}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/login">Back to Login</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
