import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Link from "next/link"

export function VerificationPlaceholder() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        <CardDescription>This page is used to verify your email address</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-blue-100 p-3">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium">Verification Page</h3>
        <p className="text-sm text-gray-500">
          This page is meant to be accessed via the verification link sent to your email.
        </p>
        <p className="text-xs text-gray-400">
          If you're trying to verify your account, please check your email for the verification link.
        </p>
        <Button asChild className="mt-4">
          <Link href="/login">Go to Login</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
