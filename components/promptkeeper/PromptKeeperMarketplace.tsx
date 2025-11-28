'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { CheckCircle, Copy, Eye, Lock, Move, Unlock, X } from 'lucide-react'

import { PROMPT_MARKETPLACE_CATEGORIES } from '@/components/promptkeeper/constants'

interface PromptKeeperMarketplaceProps {
  isPaidUser: boolean
  onUnlockRequest: () => void
}

export const PromptKeeperMarketplace = ({ isPaidUser, onUnlockRequest }: PromptKeeperMarketplaceProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const modalRef = useRef<HTMLDivElement>(null)
  const category = PROMPT_MARKETPLACE_CATEGORIES.find((cat) => cat.id === selectedCategory) || null

  useEffect(() => {
    setPosition({ x: 0, y: 0 })
  }, [selectedCategory])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return
      setPosition({
        x: event.clientX - dragStart.current.x,
        y: event.clientY - dragStart.current.y,
      })
    }

    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .catch((error) => console.error('PromptKeeper: copy failed', error))
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Prompt Marketplace</h2>
        <p className="text-gray-500">精选提示词合集，覆盖开发、增长、视觉创作等高频场景。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROMPT_MARKETPLACE_CATEGORIES.map((cat) => {
          const isLocked = cat.isPremium && !isPaidUser
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="h-40 bg-gray-200 relative">
                <Image src={cat.coverImage} alt={cat.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                {cat.isPremium && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center">
                    {isLocked ? <Lock size={12} className="mr-1" /> : <CheckCircle size={12} className="mr-1" />}
                    {isLocked ? 'PREMIUM' : 'UNLOCKED'}
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">{cat.description}</p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 relative border border-dashed border-gray-300 h-24 overflow-hidden">
                  <div className={`transition-all duration-300 ${isLocked ? 'blur-sm select-none' : ''}`}>
                    <p className="text-xs font-mono text-gray-600 whitespace-pre-wrap">{cat.examplePrompt.substring(0, 160)}...</p>
                  </div>
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/30 z-10">
                      <Lock className="text-gray-400" />
                    </div>
                  )}
                </div>

                {isLocked ? (
                  <button
                    onClick={onUnlockRequest}
                    className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Unlock size={18} className="mr-2" />
                    解锁 {cat.price ? `￥${cat.price}` : ''}
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Eye size={18} className="mr-2" />
                    查看完整提示词
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            ref={modalRef}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            className="bg-white rounded-xl shadow-2xl w-11/12 max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200"
          >
            <div
              className="relative h-32 cursor-move group bg-gray-900"
              onMouseDown={(event) => {
                setIsDragging(true)
                dragStart.current = {
                  x: event.clientX - position.x,
                  y: event.clientY - position.y,
                }
              }}
            >
              <Image
                src={category.coverImage}
                alt={category.name}
                fill
                className="object-cover opacity-40"
                draggable={false}
                sizes="(max-width: 768px) 100vw, 70vw"
              />
              <div className="absolute inset-0 flex items-center justify-between px-6">
                <div className="flex items-center">
                  <Move size={20} className="text-white/70 mr-3 group-hover:text-white transition-colors" />
                  <h2 className="text-2xl font-bold text-white drop-shadow-md">{category.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
              <div className="p-6 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-6">
                  <p className="text-gray-600 text-lg leading-relaxed border-b border-gray-200 pb-4">{category.description}</p>
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-xl text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Prompt 内容
                      <button
                        onClick={() => handleCopy(category.examplePrompt)}
                        className="text-gray-500 hover:text-blue-600 flex items-center text-xs font-medium"
                      >
                        <Copy size={12} className="mr-1" />
                        复制
                      </button>
                    </div>
                    <div className="p-6">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                        {category.examplePrompt}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => handleCopy(category.examplePrompt)}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors flex items-center shadow-md"
              >
                <Copy size={16} className="mr-2" />
                复制全文
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

