export interface SocialPlatform {
  id: string
  name: string
  icon: string
  color: string
  maxLength: number
  supportsImages: boolean
  supportsVideos: boolean
  supportsScheduling: boolean
}

export const socialPlatforms: Record<string, SocialPlatform> = {
  FACEBOOK: {
    id: 'FACEBOOK',
    name: 'Facebook',
    icon: '📘',
    color: 'bg-blue-600',
    maxLength: 63206,
    supportsImages: true,
    supportsVideos: true,
    supportsScheduling: true,
  },
  INSTAGRAM: {
    id: 'INSTAGRAM',
    name: 'Instagram',
    icon: '📷',
    color: 'bg-pink-500',
    maxLength: 2200,
    supportsImages: true,
    supportsVideos: true,
    supportsScheduling: true,
  },
  TWITTER: {
    id: 'TWITTER',
    name: 'Twitter',
    icon: '🐦',
    color: 'bg-sky-500',
    maxLength: 280,
    supportsImages: true,
    supportsVideos: true,
    supportsScheduling: true,
  },
  LINKEDIN: {
    id: 'LINKEDIN',
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-700',
    maxLength: 3000,
    supportsImages: true,
    supportsVideos: true,
    supportsScheduling: true,
  },
  YOUTUBE: {
    id: 'YOUTUBE',
    name: 'YouTube',
    icon: '📺',
    color: 'bg-red-500',
    maxLength: 5000,
    supportsImages: true,
    supportsVideos: true,
    supportsScheduling: true,
  },
  TIKTOK: {
    id: 'TIKTOK',
    name: 'TikTok',
    icon: '🎵',
    color: 'bg-black',
    maxLength: 2200,
    supportsImages: false,
    supportsVideos: true,
    supportsScheduling: false,
  },
}

export const getPlatformConfig = (platformId: string): SocialPlatform | null => {
  return socialPlatforms[platformId] || null
}

export const getAllPlatforms = (): SocialPlatform[] => {
  return Object.values(socialPlatforms)
}