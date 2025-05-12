"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { setUsername } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface UsernameCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (username: string) => void
  redirectPath?: string
}

export function UsernameCreationModal({ isOpen, onClose, onSuccess, redirectPath }: UsernameCreationModalProps) {
  const [username, setUsernameValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)
  const { toast } = useToast()
  const { token, updateUser } = useAuth()

  // Username validation
  const validateUsername = (value: string) => {
    // Username should be alphanumeric, can include underscores and hyphens
    // Length between 3-20 characters
    const regex = /^[a-zA-Z0-9_-]{3,20}$/
    const isValidUsername = regex.test(value)
    setIsValid(isValidUsername)

    if (value.length < 3) {
      setError("Username must be at least 3 characters")
    } else if (value.length > 20) {
      setError("Username must be less than 20 characters")
    } else if (!isValidUsername) {
      setError("Username can only contain letters, numbers, underscores and hyphens")
    } else {
      setError(null)
    }

    return isValidUsername
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsernameValue(value)
    validateUsername(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateUsername(username)) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error("You must be logged in to set a username")
      }

      const response = await setUsername(token, username)

      // Update the user context with the new username
      updateUser({ username: response.username })

      toast({
        title: "Username created",
        description: `Your username has been set to ${response.username}`,
      })

      onSuccess(response.username)
    } catch (error) {
      console.error("Failed to set username:", error)
      setError(error instanceof Error ? error.message : "Failed to set username. Please try again.")

      toast({
        title: "Failed to set username",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a username</DialogTitle>
          <DialogDescription>
            You need to create a username before you can {redirectPath?.includes("view") ? "view" : "share"} your
            profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="your_username"
                  className={`pr-10 ${error ? "border-red-500" : isValid && username ? "border-green-500" : ""}`}
                  autoComplete="off"
                />
                {isValid && username && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {error && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <p className="text-xs text-gray-500">
                Your username will be used in your profile URL and cannot be changed easily.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Username"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
