"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Send } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { STORAGE_BUCKETS } from "@/lib/storage"


interface PostCreationFormProps {
  user: {
    id: string
    email?: string | null
  }
  profile: {
    username: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
  }
  onPostCreated?: () => void
}

export function PostCreationForm({ user, profile, onPostCreated }: PostCreationFormProps) {
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setShowImageUpload(false)
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("bucket", STORAGE_BUCKETS.POSTS)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to upload image")
    }

    const { url } = await response.json()
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Getting here")
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      let imageUrl = null      
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage)
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          imageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create post")
      }

      setContent("")
      setSelectedImage(null)
      setShowImageUpload(false)
      onPostCreated?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.avatarUrl || "/placeholder.svg?height=40&width=40"} />
            <AvatarFallback>{profile.firstName?.[0] || user.email?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">
              {profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.username}
            </p>
            <p className="text-xs text-muted-foreground">@{profile.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            maxLength={280}
            className="resize-none border-0 p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
          />

          {showImageUpload && (
            <ImageUpload
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              selectedImage={selectedImage}
              disabled={isLoading}
            />
          )}

          {selectedImage && !showImageUpload && (
            <ImageUpload
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              selectedImage={selectedImage}
              disabled={isLoading}
            />
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isLoading}
              >
                <ImageIcon className="h-4 w-4" />
                Photo
              </Button>
              <span className="text-xs text-muted-foreground">{content.length}/280</span>
            </div>

            <Button type="submit" disabled={!content.trim() || isLoading} className="gap-2">
              <Send className="h-4 w-4" />
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
