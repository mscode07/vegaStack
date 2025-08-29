"use client"

import { useState, useEffect } from "react" 
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { PostCard } from "./post-card"


interface PostsFeedProps {
  currentUserId?: string
}

interface Post {
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

export function PostsFeed({ currentUserId }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setError(null)
      const response = await fetch("/api/posts")
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostDeleted = () => {
    fetchPosts()
  }

  const handleRefresh = () => {
    setIsLoading(true)
    fetchPosts()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={handleRefresh} variant="outline" className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-4">
            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
            <Button onClick={handleRefresh} variant="outline" className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Posts</h2>
        <Button onClick={handleRefresh} variant="ghost" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} onPostDeleted={handlePostDeleted} />
      ))}
    </div>
  )
}
