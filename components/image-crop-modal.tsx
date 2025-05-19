"use client"

import type React from "react"

import { useState, useRef } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedImageBlob: Blob) => void
  aspectRatio?: number
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageCropModal({ isOpen, onClose, imageSrc, onCropComplete, aspectRatio = 1 }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // When the image loads, set up the initial crop
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspectRatio))
  }

  // Reset cropping parameters
  const handleReset = () => {
    setScale(1)
    setRotate(0)
    if (imgRef.current) {
      const { width, height } = imgRef.current
      setCrop(centerAspectCrop(width, height, aspectRatio))
    }
  }

  // Generate the cropped image when the user clicks "Apply"
  const handleApplyCrop = () => {
    if (!completedCrop || !canvasRef.current || !imgRef.current) {
      return
    }

    const canvas = canvasRef.current
    const image = imgRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      return
    }

    // Calculate the size of the crop in pixels
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio || 1

    canvas.width = completedCrop.width * scaleX * pixelRatio
    canvas.height = completedCrop.height * scaleY * pixelRatio

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = "high"

    // Calculate the position and dimensions for drawing
    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY
    const cropWidth = completedCrop.width * scaleX
    const cropHeight = completedCrop.height * scaleY

    // Set the origin to the center of the canvas for rotation
    const centerX = canvas.width / (2 * pixelRatio)
    const centerY = canvas.height / (2 * pixelRatio)

    // Apply transformations
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((rotate * Math.PI) / 180)
    ctx.scale(scale, scale)
    ctx.translate(-centerX, -centerY)

    // Draw the image with the crop
    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, completedCrop.width, completedCrop.height)

    // Restore the context
    ctx.restore()

    // Convert the canvas to a blob and pass it to the parent component
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob)
        }
      },
      "image/jpeg",
      0.95, // Quality
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
          <DialogDescription>Adjust your image to get the perfect profile picture</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              circularCrop
              className="max-h-[400px] object-contain"
            >
              <img
                ref={imgRef}
                src={imageSrc || "/placeholder.svg"}
                alt="Crop preview"
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
                className="max-h-[400px] object-contain"
                crossOrigin="anonymous"
              />
            </ReactCrop>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center space-x-2">
              <ZoomOut className="h-4 w-4" />
              <Slider
                value={[scale]}
                min={0.5}
                max={3}
                step={0.01}
                onValueChange={(value) => setScale(value[0])}
                className="flex-1"
              />
              <ZoomIn className="h-4 w-4" />
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-1">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden canvas for generating the cropped image */}
        <canvas ref={canvasRef} className="hidden" />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApplyCrop}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
