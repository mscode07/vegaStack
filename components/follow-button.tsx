"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck } from "lucide-react"

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  currentUserId?: string
}

export function FollowButton({ userId, isFollowing: initialIsFollowing, currentUserId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  if (!currentUserId || currentUserId === userId) {
    return null
  }

  const handleFollow = async () => {
    setIsLoading(true)
    try {
      const method = isFollowing ? "DELETE" : "POST"
      const response = await fetch(`/api/users/${userId}/follow`, { method })

      if (response.ok) {
        setIsFollowing(!isFollowing)
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleFollow} disabled={isLoading} className="gap-2" variant={isFollowing ? "outline" : "default"}>
      {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </Button>
  )
}
