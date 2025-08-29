import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, LinkIcon, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"
import { FollowButton } from "@/components/follow-button"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function Page({ params }: ProfilePageProps) {
  const supabase = await createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  const { data: profile, error } = await supabase
    .from("users")
    .select(`
      *,
      posts!posts_author_id_fkey(
        id,
        content,
        image_url,
        like_count,
        comment_count,
        created_at
      )
    `)
    .eq("username", params.username)
    .single()

  if (error || !profile) {
    notFound()
  }
 
  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profile.id)

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profile.id)
 
  let isFollowing = false
  if (currentUser) {
    const { data: followData } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUser.id)
      .eq("following_id", profile.id)
      .single()

    isFollowing = !!followData
  }

  const isOwnProfile = currentUser?.id === profile.id

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            SocialConnect
          </Link>
          <div className="flex items-center gap-4">
            {isOwnProfile ? (
              <Link
                href="/profile/edit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Edit Profile
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  href={`/messages/${profile.username}`}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Link>
                <FollowButton userId={profile.id} isFollowing={isFollowing} currentUserId={currentUser?.id} />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-3">
              
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="text-2xl">
                    {profile.first_name?.[0] || profile.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile.first_name && profile.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile.username}
                  </h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.bio && <p className="text-sm">{profile.bio}</p>}

                <div className="space-y-2 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {profile.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-xl font-bold">{profile.posts?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{followingCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{followersCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Posts</h2>
              <Badge variant="secondary">{profile.posts?.length || 0} posts</Badge>
            </div>

            {profile.posts && profile.posts.length > 0 ? (
              <div className="space-y-4">
                {profile.posts.map((post: any) => (
                  <Card key={post.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.avatar_url || "/placeholder.svg?height=40&width=40"} />
                          <AvatarFallback>
                            {profile.first_name?.[0] || profile.username?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {profile.first_name && profile.last_name
                                ? `${profile.first_name} ${profile.last_name}`
                                : profile.username}
                            </span>
                            <span className="text-muted-foreground">@{profile.username}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground text-sm">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{post.content}</p>
                          {post.image_url && (
                            <img
                              src={post.image_url || "/placeholder.svg"}
                              alt="Post image"
                              className="rounded-lg max-w-full h-auto"
                            />
                          )}
                          <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span>{post.like_count} likes</span>
                            <span>{post.comment_count} comments</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {isOwnProfile
                        ? "You haven't posted anything yet."
                        : `${profile.username} hasn't posted anything yet.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
