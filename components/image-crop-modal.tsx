"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut } from "lucide-react"

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedImageBlob: Blob) => void
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

// Function to create a cropped image
const createCroppedImage = async (imageSrc: string, pixelCrop: CropArea): Promise<Blob> => {
  const image = new Image()
  image.src = imageSrc

  // Create a promise that resolves when the image is loaded
  const imageLoaded = new Promise<void>((resolve) => {
    image.onload = () => resolve()
  })

  await imageLoaded // Wait for the image to load

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("No 2d context")
  }

  // Set canvas size to the cropped size
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }
        resolve(blob)
      },
      "image/jpeg",
      0.95,
    )
  })
}

export function ImageCropModal({ isOpen, onClose, imageSrc, onCropComplete }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null)

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location)
  }, [])

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom)
  }, [])

  const onCropAreaChange = useCallback((croppedArea: any, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels) return

    try {
      const croppedImage = await createCroppedImage(imageSrc, croppedAreaPixels)
      onCropComplete(croppedImage)
    } catch (e) {
      console.error("Error creating cropped image:", e)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="relative h-64 w-full overflow-hidden rounded-md">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaChange}
            cropShape="round"
          />
        </div>

        <div className="flex items-center space-x-2 pt-4">
          <ZoomOut className="h-4 w-4" />
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(value) => setZoom(value[0])}
            className="flex-1"
          />
          <ZoomIn className="h-4 w-4" />
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApplyCrop}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
