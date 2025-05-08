"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, X, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileImageUploadProps {
  initialImage?: string | null
  name: string
  onImageChange: (imageUrl: string | null) => void
  className?: string
}

export function ProfileImageUpload({ initialImage, name, onImageChange, className = "" }: ProfileImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, GIF, or WebP)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setImage(imageUrl)
      onImageChange(imageUrl)
      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
    onImageChange(null)
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast({
      title: "Image removed",
      description: "Your profile picture has been removed",
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Generate initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={triggerFileInput}
      >
        <Avatar className="h-24 w-24">
          <AvatarImage src={image || ""} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl">{initials}</AvatarFallback>
        </Avatar>

        <div
          className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>

      {image && (
        <Button
          variant="outline"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border-gray-200"
          onClick={(e) => {
            e.stopPropagation()
            handleRemoveImage()
          }}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove image</span>
        </Button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        aria-label="Upload profile picture"
      />

      <div className="mt-2 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center gap-1 text-muted-foreground"
          onClick={triggerFileInput}
        >
          <Upload className="h-3 w-3" />
          {image ? "Change photo" : "Upload photo"}
        </Button>
      </div>
    </div>
  )
}
