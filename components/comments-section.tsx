"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    id: string
    username: string
    first_name?: string
    last_name?: string
    avatar_url?: string
  }
}

interface CommentsSectionProps {
  postId: string
  currentUserId?: string
  onCommentAdded?: () => void
}

export function CommentsSection({ postId, currentUserId, onCommentAdded }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`)
        if (response.ok) {
          const data = await response.json()
          setComments(data.comments || [])
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUserId || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments((prev) => [...prev, data.comment])
        setNewComment("")
        onCommentAdded?.()
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
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
    <div className="mt-4 pt-4 border-t space-y-4">
      {/* Add Comment Form */}
      {currentUserId && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            maxLength={200}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{newComment.length}/200</span>
            <Button type="submit" size="sm" disabled={!newComment.trim() || isSubmitting} className="gap-2">
              <Send className="h-3 w-3" />
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link href={`/profile/${comment.author.username}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar_url || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback className="text-xs">
                    {comment.author.first_name?.[0] || comment.author.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${comment.author.username}`} className="hover:underline">
                    <span className="font-semibold text-sm">
                      {comment.author.first_name && comment.author.last_name
                        ? `${comment.author.first_name} ${comment.author.last_name}`
                        : comment.author.username}
                    </span>
                  </Link>
                  <Link href={`/profile/${comment.author.username}`} className="text-muted-foreground hover:underline">
                    <span className="text-xs">@{comment.author.username}</span>
                  </Link>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="text-muted-foreground text-xs">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
