"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import {
  realtimeManager,
  type RealtimeNotification,
  type RealtimePost,
  type RealtimeLike,
  type RealtimeComment,
} from "@/lib/realtime"

export function useRealtimeNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const handleNewNotification = useCallback((notification: RealtimeNotification) => {
    setNotifications((prev) => [notification, ...prev])
    setUnreadCount((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!session?.user?.id) return

    realtimeManager.setUserId(session.user.id)
    const channel = realtimeManager.subscribeToNotifications(session.user.id, handleNewNotification)

    return () => {
      realtimeManager.unsubscribe(`notifications:${session.user.id}`)
    }
  }, [session?.user?.id, handleNewNotification])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }
}

export function useRealtimePosts() {
  const [posts, setPosts] = useState<RealtimePost[]>([])

  const handlePostUpdate = useCallback((post: RealtimePost) => {
    setPosts((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === post.id)
      if (existingIndex >= 0) {
        // Update existing post
        const updated = [...prev]
        updated[existingIndex] = post
        return updated
      } else {
        // Add new post
        return [post, ...prev]
      }
    })
  }, [])

  useEffect(() => {
    const channel = realtimeManager.subscribeToPostUpdates(handlePostUpdate)

    return () => {
      realtimeManager.unsubscribe("posts:public")
    }
  }, [handlePostUpdate])

  return { posts, setPosts }
}

export function useRealtimeLikes() {
  const [likeUpdates, setLikeUpdates] = useState<{ postId: string; count: number; liked: boolean }[]>([])

  const handleLikeUpdate = useCallback((like: RealtimeLike, event: "INSERT" | "DELETE") => {
    setLikeUpdates((prev) => {
      const existing = prev.find((l) => l.postId === like.post_id)
      if (existing) {
        return prev.map((l) =>
          l.postId === like.post_id
            ? {
                ...l,
                count: event === "INSERT" ? l.count + 1 : l.count - 1,
                liked: event === "INSERT",
              }
            : l,
        )
      } else {
        return [
          ...prev,
          {
            postId: like.post_id,
            count: event === "INSERT" ? 1 : 0,
            liked: event === "INSERT",
          },
        ]
      }
    })
  }, [])

  useEffect(() => {
    const channel = realtimeManager.subscribeToLikes(handleLikeUpdate)

    return () => {
      realtimeManager.unsubscribe("likes:public")
    }
  }, [handleLikeUpdate])

  return { likeUpdates }
}

export function useRealtimeComments() {
  const [commentUpdates, setCommentUpdates] = useState<{ postId: string; comments: RealtimeComment[] }[]>([])

  const handleCommentUpdate = useCallback((comment: RealtimeComment) => {
    setCommentUpdates((prev) => {
      const existing = prev.find((c) => c.postId === comment.post_id)
      if (existing) {
        return prev.map((c) => (c.postId === comment.post_id ? { ...c, comments: [comment, ...c.comments] } : c))
      } else {
        return [
          ...prev,
          {
            postId: comment.post_id,
            comments: [comment],
          },
        ]
      }
    })
  }, [])

  useEffect(() => {
    const channel = realtimeManager.subscribeToComments(handleCommentUpdate)

    return () => {
      realtimeManager.unsubscribe("comments:public")
    }
  }, [handleCommentUpdate])

  return { commentUpdates }
}
