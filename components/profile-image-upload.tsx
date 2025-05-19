"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, X, Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getProfilePictureUploadUrl, uploadProfilePicture, confirmProfilePictureUpload } from "@/lib/api"
import { ImageCropModal } from "@/components/image-crop-modal"

interface ProfileImageUploadProps {
  initialImage?: string | null
  name: string
  onImageChange: (imageUrl: string | null) => void
  className?: string
}

export function ProfileImageUpload({ initialImage, name, onImageChange, className = "" }: ProfileImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null)
  const [isHovering, setIsHovering] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { token, updateUser } = useAuth()

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Create a temporary URL for the image to display in the crop modal
    const imageUrl = URL.createObjectURL(file)
    setTempImageUrl(imageUrl)
    setSelectedFile(file)
    setCropModalOpen(true)
  }

  // Handle crop completion
  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setCropModalOpen(false)

    if (!token) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to upload a profile picture",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      // Convert the cropped blob to a file
      const fileName = selectedFile?.name || "profile-picture.jpg"
      const contentType = "image/jpeg" // We're converting to JPEG in the crop function
      const croppedFile = new File([croppedImageBlob], fileName, { type: contentType })

      // Create a temporary URL for the cropped image to display while uploading
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob)
      setImage(croppedImageUrl)

      // Get file extension from file name
      const fileExtension = "jpg" // Always jpg since we're converting to JPEG

      // Step 1: Get a signed URL for upload
      const { signedUrl, filePath, publicUrl } = await getProfilePictureUploadUrl(token, contentType, fileExtension)

      // Step 2: Upload the file to the signed URL
      await uploadProfilePicture(signedUrl, croppedFile, contentType)

      // Step 3: Confirm the upload
      const updatedUser = await confirmProfilePictureUpload(token, filePath, contentType)

      // Update the image in the component state
      const profilePictureUrl = updatedUser.profilePicture?.publicUrl || publicUrl
      setImage(profilePictureUrl)
      onImageChange(profilePictureUrl)

      // Update the user context with the updated user data
      updateUser(updatedUser)

      // Clean up the temporary cropped image URL
      URL.revokeObjectURL(croppedImageUrl)

      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated",
      })
    } catch (error) {
      console.error("Failed to upload profile picture:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload profile picture",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Clean up the temporary URL
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl)
        setTempImageUrl(null)
      }
    }
  }

  const handleRemoveImage = async () => {
    if (!token) return

    try {
      setIsUploading(true)

      // Update the profile with null profile picture
      const updatedUser = await confirmProfilePictureUpload(token, "", "")

      // Update the image in the component state
      setImage(null)
      onImageChange(null)

      // Update the user context with the updated user data
      updateUser(updatedUser)

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast({
        title: "Image removed",
        description: "Your profile picture has been removed",
      })
    } catch (error) {
      console.error("Failed to remove profile picture:", error)
      toast({
        title: "Remove failed",
        description: error instanceof Error ? error.message : "Failed to remove profile picture",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  // Generate initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative cursor-pointer group ${isUploading ? "opacity-70" : ""}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={triggerFileInput}
      >
        <Avatar className="h-24 w-24">
          <AvatarImage src={image || ""} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl">{initials}</AvatarFallback>
        </Avatar>

        {isUploading ? (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        ) : (
          <div
            className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {image && !isUploading && (
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
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        aria-label="Upload profile picture"
        disabled={isUploading}
      />

      <div className="mt-2 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center gap-1 text-muted-foreground"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-3 w-3" />
              {image ? "Change photo" : "Upload photo"}
            </>
          )}
        </Button>
      </div>

      {/* Image Crop Modal */}
      {tempImageUrl && (
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false)
            if (tempImageUrl) {
              URL.revokeObjectURL(tempImageUrl)
              setTempImageUrl(null)
            }
          }}
          imageSrc={tempImageUrl}
          onCropComplete={handleCropComplete}
          aspectRatio={1} // 1:1 aspect ratio for profile pictures
        />
      )}
    </div>
  )
}
