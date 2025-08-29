'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

interface Post {
  id: string
  content: string
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED'
  platforms: string[]
  createdAt: Date
  scheduledAt?: Date
}

interface RecentPostsProps {
  posts: Post[]
}

export function RecentPosts({ posts }: RecentPostsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      FACEBOOK: '📘',
      INSTAGRAM: '📷',
      TWITTER: '🐦',
      LINKEDIN: '💼',
      YOUTUBE: '📺',
      TIKTOK: '🎵'
    }
    return icons[platform] || '📱'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {post.platforms.map(p => getPlatformIcon(p)).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  {post.content.substring(0, 100)}
                  {post.content.length > 100 && '...'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(post.status)}>
                    {post.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {post.scheduledAt 
                      ? `Scheduled for ${formatDistanceToNow(post.scheduledAt, { addSuffix: true })}`
                      : formatDistanceToNow(post.createdAt, { addSuffix: true })
                    }
                  </span>
                </div>
                <div className="flex space-x-1 mt-1">
                  {post.platforms.map((platform) => (
                    <span key={platform} className="text-xs">
                      {getPlatformIcon(platform)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}