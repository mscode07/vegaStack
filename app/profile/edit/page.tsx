"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Upload, Save } from "lucide-react"
import Link from "next/link"

export default function EditProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "",
    bio: "",
    website: "",
    location: "",
    avatar_url: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      // Load existing profile data
      const { data: existingProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (existingProfile) {
        setProfile({
          username: existingProfile.username || "",
          first_name: existingProfile.first_name || "",
          last_name: existingProfile.last_name || "",
          bio: existingProfile.bio || "",
          website: existingProfile.website || "",
          location: existingProfile.location || "",
          avatar_url: existingProfile.avatar_url || "",
        })
      }
    }

    getUser()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: profile.username,
          first_name: profile.first_name,
          last_name: profile.last_name,
          bio: profile.bio,
          website: profile.website,
          location: profile.location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push(`/profile/${profile.username}`)
      }, 1500)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/profile/${profile.username}`} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Edit Profile</h1>
          </div>
          <Button form="profile-form" type="submit" disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      <main className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
            <CardDescription>Update your profile information to help others connect with you</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="text-lg">
                    {profile.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" type="button">
                  <Upload className="h-4 w-4" />
                  Change Photo
                </Button>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="johndoe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground text-right">{profile.bio.length}/160 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="New York, NY"
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-3">
                  <p className="text-sm text-green-700">Profile updated successfully! Redirecting...</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
