"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface LogoutButtonProps extends ButtonProps {
  showIcon?: boolean
  showConfirmDialog?: boolean
}

export function LogoutButton({ showIcon = true, showConfirmDialog = true, children, ...props }: LogoutButtonProps) {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  if (showConfirmDialog) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" {...props}>
            {showIcon && <LogOut className="h-4 w-4 mr-2" />}
            {children || "Logout"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your account and redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Button variant="outline" onClick={logout} {...props}>
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {children || "Logout"}
    </Button>
  )
}
