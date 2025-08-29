import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, MessageCircle, User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"

import { PostsFeed } from "@/components/posts-feed"
import { NotificationBell } from "@/components/notification-bell"
import { PostCreationForm } from "@/components/post-creation-form"
import { SignOutButton } from "@/components/sign-out-buttion"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const profile = await prisma.userTable.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatarUrl: true,
      email: true,
    },
  })

  if (!profile) {
    redirect("/auth/login")
  }

  const [postsCount, followersCount, followingCount] = await Promise.all([
    prisma.postTable.count({
      where: { authorId: session.user.id, isActive: true },
    }),
    prisma.followTable.count({
      where: { followingId: session.user.id },
    }),
    prisma.followTable.count({
      where: { followerId: session.user.id },
    }),
  ])

  if (!profile.username || !profile.firstName) {
    redirect("/profile/setup")
  }

  return (
    <div className="min-h-screen bg-background">
      
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-primary">SocialConnect</h1>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
              <NotificationBell />
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Messages
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href={`/profile/${profile.username}`}>
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/profile/edit">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
             
            <SignOutButton />
          </div>
        </div>
      </header>

       
      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-3">
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatarUrl || "/placeholder.svg?height=64&width=64"} />
                    <AvatarFallback>
                      {profile.firstName?.[0] || profile.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {profile.firstName && profile.lastName
                        ? `${profile.firstName} ${profile.lastName}`
                        : profile.username}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {profile.bio && (
                  <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>
                )}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{postsCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{followingCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{followersCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

           
          <div className="md:col-span-2 space-y-6">
            <PostCreationForm user={session.user} profile={profile} />
            <PostsFeed currentUserId={session.user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
