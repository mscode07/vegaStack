"use client"

import type React from "react"

import { useEffect } from "react"
import { useSession } from "next-auth/react" 
import { realtimeManager } from "@/lib/realtime"

interface RealtimeProviderProps {
  children: React.ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      realtimeManager.setUserId(session.user.id)
    }

    // Cleanup on unmount
    return () => {
      realtimeManager.unsubscribeAll()
    }
  }, [session?.user?.id])

  return <>{children}</>
}
