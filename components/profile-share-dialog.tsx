"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Facebook, Linkedin, Mail, Share2, Twitter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileShareDialogProps {
  profileName: string
  profileSlug: string
}

export function ProfileShareDialog({ profileName, profileSlug }: ProfileShareDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const profileUrl =
    typeof window !== "undefined" ? `${window.location.origin}/profile/${profileSlug}` : `/profile/${profileSlug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to clipboard",
    })
  }

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=Check out ${profileName}'s HR Profile&body=I thought you might be interested in ${profileName}'s HR profile: ${profileUrl}`,
    )
    setOpen(false)
  }

  const shareViaLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`)
    setOpen(false)
  }

  const shareViaTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Check out ${profileName}'s HR profile&url=${encodeURIComponent(profileUrl)}`,
    )
    setOpen(false)
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share profile</DialogTitle>
          <DialogDescription>Share {profileName}'s profile with others via these platforms.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={profileUrl} readOnly className="w-full" />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center gap-4 py-4">
          <Button variant="outline" size="icon" onClick={shareViaEmail}>
            <Mail className="h-4 w-4" />
            <span className="sr-only">Share via email</span>
          </Button>
          <Button variant="outline" size="icon" onClick={shareViaLinkedIn}>
            <Linkedin className="h-4 w-4" />
            <span className="sr-only">Share on LinkedIn</span>
          </Button>
          <Button variant="outline" size="icon" onClick={shareViaTwitter}>
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Share on Twitter</span>
          </Button>
          <Button variant="outline" size="icon" onClick={shareViaFacebook}>
            <Facebook className="h-4 w-4" />
            <span className="sr-only">Share on Facebook</span>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogTrigger asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
