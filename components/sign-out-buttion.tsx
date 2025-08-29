"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
      variant="outline"
      size="sm"
      className="gap-2 bg-transparent"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  )
}
