import { createClient } from "@supabase/supabase-js"
import { toast } from "@/hooks/use-toast"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseRealtime = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export interface RealtimeNotification {
  id: string
  recipient_id: string
  sender_id: string
  notification_type: "FOLLOW" | "LIKE" | "COMMENT"
  post_id?: string
  message?: string
  is_read: boolean
  created_at: string
  sender?: {
    username: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
  }
}

export interface RealtimePost {
  id: string
  author_id: string
  content: string
  image_url?: string
  like_count: number
  comment_count: number
  created_at: string
  author?: {
    username: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
  }
}

export interface RealtimeLike {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

export interface RealtimeComment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  author?: {
    username: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
  }
}

export interface RealtimeFollow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export function showRealtimeNotification(notification: RealtimeNotification) {
  const senderName =
    notification.sender?.firstName && notification.sender?.lastName
      ? `${notification.sender.firstName} ${notification.sender.lastName}`
      : notification.sender?.username || "Someone"

  let title = ""
  let description = ""

  switch (notification.notification_type) {
    case "FOLLOW":
      title = "New Follower"
      description = `${senderName} started following you`
      break
    case "LIKE":
      title = "New Like"
      description = `${senderName} liked your post`
      break
    case "COMMENT":
      title = "New Comment"
      description = `${senderName} commented on your post`
      break
  }

  toast({
    title,
    description,
    duration: 5000,
  })
}

export class RealtimeManager {
  private channels: Map<string, any> = new Map()
  private userId: string | null = null

  setUserId(userId: string) {
    this.userId = userId
  }

  subscribeToNotifications(userId: string, onNotification: (notification: RealtimeNotification) => void) {
    const channelName = `notifications:${userId}`

    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)
    }

    const channel = supabaseRealtime
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as RealtimeNotification
          onNotification(notification)
          showRealtimeNotification(notification)
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  subscribeToPostUpdates(onPostUpdate: (post: RealtimePost) => void) {
    const channelName = "posts:public"

    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)
    }

    const channel = supabaseRealtime
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          const post = payload.new as RealtimePost
          onPostUpdate(post)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          const post = payload.new as RealtimePost
          onPostUpdate(post)
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  subscribeToLikes(onLikeUpdate: (like: RealtimeLike, event: "INSERT" | "DELETE") => void) {
    const channelName = "likes:public"

    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)
    }

    const channel = supabaseRealtime
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "likes",
        },
        (payload) => {
          const like = payload.new as RealtimeLike
          onLikeUpdate(like, "INSERT")
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "likes",
        },
        (payload) => {
          const like = payload.old as RealtimeLike
          onLikeUpdate(like, "DELETE")
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  subscribeToComments(onCommentUpdate: (comment: RealtimeComment) => void) {
    const channelName = "comments:public"

    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)
    }

    const channel = supabaseRealtime
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
        },
        (payload) => {
          const comment = payload.new as RealtimeComment
          onCommentUpdate(comment)
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      supabaseRealtime.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel, channelName) => {
      supabaseRealtime.removeChannel(channel)
    })
    this.channels.clear()
  }
}

export const realtimeManager = new RealtimeManager()
