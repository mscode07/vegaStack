"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRealtimeNotifications } from "@/hooks/use-realtime"

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { unreadCount } = useRealtimeNotifications()

  return (
    <Button variant="ghost" size="sm" className={`gap-2 relative ${className}`}>
      <Bell className="h-4 w-4" />
      Notifications
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  )
}
