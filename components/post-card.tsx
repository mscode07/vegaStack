"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Share, MoreHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"
import { CommentsSection } from "@/components/comments-section"

interface PostCardProps {
  post: {
    id: string
    content: string
    imageUrl?: string
    likeCount: number
    commentCount: number
    createdAt: string
    author: {
      id: string
      username: string
      firstName?: string
      lastName?: string
      avatarUrl?: string
    }
  }
  currentUserId?: string
  onPostDeleted?: () => void
}

export function PostCard({ post, currentUserId, onPostDeleted }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [commentCount, setCommentCount] = useState(post.commentCount)
  const [showComments, setShowComments] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const isOwnPost = currentUserId === post.author.id

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!currentUserId) return

      try {
        const response = await fetch(`/api/posts/${post.id}/like`)
        if (response.ok) {
          const data = await response.json()
          setIsLiked(data.isLiked)
        }
      } catch (error) {
        console.error("Error checking like status:", error)
      }
    }

    checkLikeStatus()
  }, [post.id, currentUserId])

  const handleLike = async () => {
    if (!currentUserId || isLiking) return

    setIsLiking(true)
    try {
      const method = isLiked ? "DELETE" : "POST"
      const response = await fetch(`/api/posts/${post.id}/like`, { method })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      onPostDeleted?.()
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCommentAdded = () => {
    setCommentCount((prev) => prev + 1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffInMinutes < 1 ? "now" : `${diffInMinutes}m`
    } else if (diffInHours < 24) {
      return `${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d`
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatarUrl || "/placeholder.svg?height=40&width=40"} />
              <AvatarFallback>{post.author.firstName?.[0] || post.author.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${post.author.username}`} className="hover:underline">
                  <span className="font-semibold">
                    {post.author.firstName && post.author.lastName
                      ? `${post.author.firstName} ${post.author.lastName}`
                      : post.author.username}
                  </span>
                </Link>
                <Link href={`/profile/${post.author.username?.toLowerCase() || ""}`} className="text-muted-foreground hover:underline">
                  @{post.author.username}
                </Link>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground text-sm">{formatDate(post.createdAt)}</span>
              </div>

              {isOwnPost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-sm leading-relaxed">{post.content}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt="Post image"
                className="rounded-lg max-w-full h-auto border"
              />
            )}

            <div className="flex items-center gap-6 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 p-0 ${
                  isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
                }`}
                onClick={handleLike}
                disabled={!currentUserId || isLiking}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{likeCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-blue-500 p-0"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{commentCount}</span>
              </Button>

              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-green-500 p-0">
                <Share className="h-4 w-4" />
              </Button>
            </div>

            {showComments && (
              <CommentsSection postId={post.id} currentUserId={currentUserId} onCommentAdded={handleCommentAdded} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
