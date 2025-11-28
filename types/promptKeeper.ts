export enum NoteColor {
  Default = 'bg-white',
  Red = 'bg-red-100',
  Orange = 'bg-orange-100',
  Yellow = 'bg-yellow-100',
  Green = 'bg-green-100',
  Teal = 'bg-teal-100',
  Blue = 'bg-blue-100',
  Purple = 'bg-purple-100',
}

export interface PromptNote {
  id: string
  title: string
  content: string
  color: NoteColor
  isPinned: boolean
  isArchived: boolean
  tags: string[]
  createdAt: number
  updatedAt: number
}

export type ViewMode = 'notes' | 'market'

export interface PromptKeeperUserSummary {
  id: string
  phone?: string | null
  balance?: number | null
}

export interface PromptMarketplaceCategory {
  id: string
  name: string
  description: string
  coverImage: string
  examplePrompt: string
  isPremium: boolean
  price?: number
}

export interface PromptKeeperPaymentPayload {
  user_id: string
  amount: number
  reason?: string
}

export interface PromptKeeperUnlockResult {
  success: boolean
  balance?: number
  existing?: boolean
  error?: string
}

