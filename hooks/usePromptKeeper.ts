'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  NoteColor,
  PromptKeeperPaymentPayload,
  PromptKeeperUnlockResult,
  PromptKeeperUserSummary,
  PromptNote,
  ViewMode,
} from '@/types/promptKeeper'

const LOCAL_STORAGE_KEY = 'promptkeeper_data'
const PAID_USER_KEY = 'promptkeeper_is_paid'
const PROMPT_KEEPER_UNLOCK_AMOUNT = 100
const PROMPT_KEEPER_UNLOCK_REASON = 'PromptKeeper Premium'

const isBrowser = () => typeof window !== 'undefined'

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `pk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const usePromptKeeper = () => {
  const [notes, setNotes] = useState<PromptNote[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('notes')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPaidUser, setIsPaidUser] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<PromptKeeperUserSummary | null>(null)
  const [isFetchingUser, setIsFetchingUser] = useState(false)

  // Bootstrap from localStorage once on mount
  useEffect(() => {
    if (!isBrowser()) return

    try {
      const savedNotes = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
    } catch (error) {
      console.error('PromptKeeper: failed to parse cached notes', error)
    }

    const paidStatus = window.localStorage.getItem(PAID_USER_KEY)
    if (paidStatus === 'true') {
      setIsPaidUser(true)
    }
  }, [])

  // Persist notes locally for fast UX
  useEffect(() => {
    if (!isBrowser()) return
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  // Fetch current authenticated user to hydrate payment defaults
  useEffect(() => {
    if (!isBrowser()) return

    let cancelled = false

    const loadSession = async () => {
      setIsFetchingUser(true)
      try {
        const response = await fetch('/api/session', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        const data = await response.json()
        if (!cancelled && data?.success && data?.user?.id) {
          const summary: PromptKeeperUserSummary = {
            id: data.user.id,
            phone: data.user.phone ?? null,
            balance: data.user.balance ?? null,
          }
          setCurrentUser(summary)
          if (typeof summary.balance === 'number') {
            setBalance(summary.balance)
          }
        }
      } catch (error) {
        console.error('PromptKeeper: failed to fetch session', error)
      } finally {
        if (!cancelled) {
          setIsFetchingUser(false)
        }
      }
    }

    loadSession()

    return () => {
      cancelled = true
    }
  }, [])

  const handleCreateNote = useCallback(
    (title: string, content: string, color: NoteColor, tags: string[]) => {
      const now = Date.now()
      const newNote: PromptNote = {
        id: generateId(),
        title,
        content,
        color,
        isPinned: false,
        isArchived: false,
        tags,
        createdAt: now,
        updatedAt: now,
      }

      setNotes((prev) => [newNote, ...prev])
    },
    [],
  )

  const handleUpdateNote = useCallback((updatedNote: PromptNote) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? { ...updatedNote, updatedAt: Date.now() } : note)),
    )
  }, [])

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }, [])

  const handlePinNote = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() } : note,
      ),
    )
  }, [])

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes
    }
    const lowered = searchQuery.toLowerCase()
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowered) ||
        note.content.toLowerCase().includes(lowered) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowered)),
    )
  }, [notes, searchQuery])

  const pinnedNotes = useMemo(() => filteredNotes.filter((note) => note.isPinned), [filteredNotes])
  const otherNotes = useMemo(() => filteredNotes.filter((note) => !note.isPinned), [filteredNotes])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const openPaywall = useCallback(() => {
    setPaymentError(null)
    setShowPayModal(true)
  }, [])

  const closePaywall = useCallback(() => {
    setShowPayModal(false)
  }, [])

  const handleUnlockWithPoints = useCallback(
    async (payload: Partial<PromptKeeperPaymentPayload> = {}): Promise<PromptKeeperUnlockResult> => {
      setIsProcessingPurchase(true)
      setPaymentError(null)

      try {
        const userId = payload.user_id ?? currentUser?.id

        if (!userId) {
          const errorMessage = '请先登录后再解锁'
          setPaymentError(errorMessage)
          return {
            success: false,
            error: errorMessage,
          }
        }

        const requestBody: PromptKeeperPaymentPayload = {
          user_id: userId,
          amount: payload.amount ?? PROMPT_KEEPER_UNLOCK_AMOUNT,
          reason: payload.reason ?? PROMPT_KEEPER_UNLOCK_REASON,
        }

        const response = await fetch('/api/add-extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        const data = await response.json()

        if (!response.ok || !data?.success) {
          const errorMessage = data?.error || '扣除积分失败'
          setPaymentError(errorMessage)
          throw new Error(errorMessage)
        }

        const nextBalance = typeof data.balance === 'number' ? data.balance : Number(data.balance ?? NaN)
        if (Number.isFinite(nextBalance)) {
          setBalance(nextBalance)
        }
        setCurrentUser((prev) =>
          prev ? { ...prev, balance: Number.isFinite(nextBalance) ? nextBalance : prev.balance } : prev,
        )

        setIsPaidUser(true)
        if (isBrowser()) {
          window.localStorage.setItem(PAID_USER_KEY, 'true')
        }
        setShowPayModal(false)

        return {
          success: true,
          balance: Number.isFinite(nextBalance) ? nextBalance : undefined,
          existing: data.existing,
        }
      } catch (error) {
        console.error('PromptKeeper: unlock failed', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : '扣除积分失败',
        }
      } finally {
        setIsProcessingPurchase(false)
      }
    },
    [currentUser],
  )

  return {
    notes,
    pinnedNotes,
    otherNotes,
    filteredNotes,
    viewMode,
    setViewMode,
    isSidebarOpen,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    isPaidUser,
    showPayModal,
    openPaywall,
    closePaywall,
    isProcessingPurchase,
    paymentError,
    balance,
    currentUser,
    isFetchingUser,
    unlockCost: PROMPT_KEEPER_UNLOCK_AMOUNT,
    unlockReason: PROMPT_KEEPER_UNLOCK_REASON,
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    handlePinNote,
    handleUnlockWithPoints,
    setNotes,
  }
}

