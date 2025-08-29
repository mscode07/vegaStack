"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onImageRemove: () => void
  selectedImage?: File | null
  previewUrl?: string
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  selectedImage,
  previewUrl,
  disabled = false,
  className = "",
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      onImageSelect(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const files = e.target.files
    if (files && files[0]) {
      onImageSelect(files[0])
    }
  }

  const openFileDialog = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  if (selectedImage || previewUrl) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative rounded-lg overflow-hidden border">
          <Image
            src={previewUrl || URL.createObjectURL(selectedImage!)}
            alt="Selected image"
            width={400}
            height={300}
            className="w-full h-auto max-h-64 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onImageRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-full bg-muted">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 2MB</p>
          </div>
        </div>
      </div>
    </div>
  )
}
