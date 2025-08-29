'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Calendar, Image, Send, Clock } from 'lucide-react'

const postSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  scheduledAt: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
})

type PostFormData = z.infer<typeof postSchema>

const platforms = [
  { id: 'FACEBOOK', name: 'Facebook', icon: '📘' },
  { id: 'INSTAGRAM', name: 'Instagram', icon: '📷' },
  { id: 'TWITTER', name: 'Twitter', icon: '🐦' },
  { id: 'LINKEDIN', name: 'LinkedIn', icon: '💼' },
  { id: 'YOUTUBE', name: 'YouTube', icon: '📺' },
  { id: 'TIKTOK', name: 'TikTok', icon: '🎵' },
]

export function PostComposer() {
  const [isScheduled, setIsScheduled] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      platforms: [],
      mediaUrls: [],
    },
  })

  const onSubmit = async (data: PostFormData) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          platforms: selectedPlatforms,
          scheduledAt: isScheduled ? data.scheduledAt : null,
        }),
      })

      if (response.ok) {
        form.reset()
        setSelectedPlatforms([])
        setIsScheduled(false)
        // Show success toast
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms([...selectedPlatforms, platformId])
    } else {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5" />
          <span>Create New Post</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{field.value?.length || 0}/2000 characters</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            
            <div className="space-y-2">
              <Label>Media</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Button type="button" variant="outline" size="sm">
                    Upload Images/Videos
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF, MP4 up to 10MB
                </p>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <Label>Platforms</Label>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={(checked) => 
                        handlePlatformChange(platform.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={platform.id} className="flex items-center space-x-2 cursor-pointer">
                      <span>{platform.icon}</span>
                      <span>{platform.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
 
             

             
            {isScheduled && (
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                {isScheduled ? 'Schedule Post' : 'Publish Now'}
              </Button>
              <Button type="button" variant="outline">
                Save Draft
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}