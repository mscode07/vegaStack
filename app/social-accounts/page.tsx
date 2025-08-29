'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountCard } from '@/components/social-accounts/account-card'
import { Plus, Share2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface SocialAccount {
  id: string
  platform: string
  accountName: string
  isActive: boolean
  lastSync?: Date
}

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for demo
    setAccounts([
      {
        id: '1',
        platform: 'FACEBOOK',
        accountName: '@mybusiness',
        isActive: true,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: '2',
        platform: 'INSTAGRAM',
        accountName: '@mybusiness_official',
        isActive: true,
        lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: '3',
        platform: 'TWITTER',
        accountName: '@mybusiness',
        isActive: false,
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        platform: 'LINKEDIN',
        accountName: 'My Business LLC',
        isActive: true,
        lastSync: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ])
    setIsLoading(false)
  }, [])

  const handleToggleAccount = (id: string, active: boolean) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, isActive: active } : account
    ))
  }

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id))
  }

  const availablePlatforms = [
    { id: 'FACEBOOK', name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
    { id: 'INSTAGRAM', name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
    { id: 'TWITTER', name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
    { id: 'LINKEDIN', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
    { id: 'YOUTUBE', name: 'YouTube', icon: '📺', color: 'bg-red-500' },
    { id: 'TIKTOK', name: 'TikTok', icon: '🎵', color: 'bg-black' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Accounts</h1>
          <p className="text-gray-600 mt-2">
            Manage your connected social media accounts
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Connect Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Social Account</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {availablePlatforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => {
                    // Handle platform connection
                    console.log(`Connecting to ${platform.name}`)
                  }}
                >
                  <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center text-white`}>
                    {platform.icon}
                  </div>
                  <span className="text-sm">{platform.name}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connected Accounts */}
      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onToggle={handleToggleAccount}
              onDelete={handleDeleteAccount}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Share2 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No social accounts connected
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Connect your social media accounts to start publishing and managing your content.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Connect Your First Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Social Account</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {availablePlatforms.map((platform) => (
                    <Button
                      key={platform.id}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center text-white`}>
                        {platform.icon}
                      </div>
                      <span className="text-sm">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Account Statistics */}
      {accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{accounts.length}</div>
              <p className="text-sm text-gray-600">
                {accounts.filter(a => a.isActive).length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">24.5K</div>
              <p className="text-sm text-green-600">+5.2% this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Avg. Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">8.5%</div>
              <p className="text-sm text-green-600">+1.2% this month</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}