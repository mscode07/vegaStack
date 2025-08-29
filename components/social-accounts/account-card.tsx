'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { MoreHorizontal, Settings, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SocialAccount {
  id: string
  platform: string
  accountName: string
  isActive: boolean
  lastSync?: Date
}

interface AccountCardProps {
  account: SocialAccount
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}

export function AccountCard({ account, onToggle, onDelete }: AccountCardProps) {
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

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      FACEBOOK: 'bg-blue-500',
      INSTAGRAM: 'bg-pink-500',
      TWITTER: 'bg-sky-500',
      LINKEDIN: 'bg-blue-700',
      YOUTUBE: 'bg-red-500',
      TIKTOK: 'bg-black'
    }
    return colors[platform] || 'bg-gray-500'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${getPlatformColor(account.platform)} flex items-center justify-center text-white text-lg`}>
            {getPlatformIcon(account.platform)}
          </div>
          <div>
            <CardTitle className="text-base">{account.accountName}</CardTitle>
            <p className="text-sm text-gray-500">{account.platform}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(account.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={account.isActive ? 'default' : 'secondary'}>
              {account.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {account.lastSync && (
              <span className="text-xs text-gray-500">
                Last sync: {account.lastSync.toLocaleDateString()}
              </span>
            )}
          </div>
          <Switch
            checked={account.isActive}
            onCheckedChange={(checked) => onToggle(account.id, checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}