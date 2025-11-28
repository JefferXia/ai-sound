'use client'

import { useMemo, useRef, useState } from 'react'
import { Palette, Pin, Trash2, Copy, Download, X, Sparkles, Plus } from 'lucide-react'

import { OFFICE_COLORS } from '@/components/promptkeeper/constants'
import { NoteColor, PromptNote } from '@/types/promptKeeper'

interface PromptKeeperNoteEditorProps {
  onCreate: (title: string, content: string, color: NoteColor, tags: string[]) => void
  onRefine?: (content: string) => Promise<string>
}

export const PromptKeeperNoteEditor = ({ onCreate, onRefine }: PromptKeeperNoteEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isRefining, setIsRefining] = useState(false)

  const availableColors = useMemo(
    () => OFFICE_COLORS.filter((c) => c.value !== NoteColor.Default),
    [],
  )

  const resetEditor = () => {
    setTitle('')
    setContent('')
    setTags([])
    setTagInput('')
  }

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      setIsExpanded(false)
      return
    }

    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)].value
    onCreate(title.trim(), content.trim(), randomColor, tags)
    resetEditor()
    setIsExpanded(false)
  }

  const handleAddTag = (value: string) => {
    const normalized = value.trim()
    if (!normalized) return
    if (tags.includes(normalized)) return
    setTags((prev) => [...prev, normalized])
    setTagInput('')
  }

  const handleRefine = async () => {
    if (!onRefine || !content || isRefining) return
    setIsRefining(true)
    try {
      const refined = await onRefine(content)
      if (refined) {
        setContent(refined)
      }
    } catch (error) {
      console.error('PromptKeeper: refine failed', error)
    } finally {
      setIsRefining(false)
    }
  }

  if (!isExpanded) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-8">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full bg-white shadow-sm border border-gray-200 rounded-lg p-4 flex items-center text-gray-600 font-medium cursor-text transition-shadow hover:shadow-md text-left"
        >
          <Plus className="mr-3 h-4 w-4" />
          <span>快速记录新的提示词...</span>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative">
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-4 space-y-3">
        <input
          type="text"
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-lg font-semibold placeholder-gray-500 outline-none"
        />
        <textarea
          placeholder="输入你的提示词..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[120px] resize-none text-sm text-gray-800 placeholder-gray-500 outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-xs px-2 py-1 rounded-full flex items-center">
              #{tag}
              <button
                type="button"
                onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="回车添加标签..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddTag(tagInput)
              }
            }}
            className="text-xs outline-none bg-transparent placeholder-gray-400 min-w-[120px]"
          />
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <button
            onClick={handleRefine}
            disabled={!onRefine || !content || isRefining}
            className="flex items-center text-xs font-medium text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded transition-colors disabled:opacity-40"
          >
            <Sparkles size={14} className={`mr-1.5 ${isRefining ? 'animate-spin' : ''}`} />
            {isRefining ? '优化中...' : 'AI 优化'}
          </button>
          <button
            onClick={handleSave}
            className="text-sm font-semibold text-gray-700 hover:bg-gray-100 px-6 py-2 rounded transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

interface PromptKeeperNoteCardProps {
  note: PromptNote
  onUpdate: (note: PromptNote) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const exportMarkdown = (note: PromptNote) => {
  if (typeof window === 'undefined') return
  const content = `# ${note.title || '未命名'}\n\n${note.content}\n\n---\nTags: ${note.tags.join(', ')}`
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, `${note.title || 'prompt'}.md`)
}

const exportWord = (note: PromptNote) => {
  if (typeof window === 'undefined') return
  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset="utf-8" /><title>${note.title}</title></head>
      <body>
        <h1>${note.title}</h1>
        <p style="white-space: pre-wrap;">${note.content}</p>
        <p><i>Tags: ${note.tags.join(', ')}</i></p>
      </body>
    </html>`
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
  downloadBlob(blob, `${note.title || 'prompt'}.doc`)
}

export const PromptKeeperNoteCard = ({ note, onUpdate, onDelete, onPin }: PromptKeeperNoteCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const handleColorChange = (color: NoteColor) => {
    onUpdate({ ...note, color })
    setShowColorPicker(false)
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(note.content)
      .then(() => {
        // noop, rely on UX
      })
      .catch((error) => console.error('PromptKeeper: copy failed', error))
  }

  const handleTitleBlur = () => {
    if (!titleRef.current) return
    onUpdate({ ...note, title: titleRef.current.textContent || '' })
  }

  const handleBodyBlur = () => {
    if (!bodyRef.current) return
    onUpdate({ ...note, content: bodyRef.current.textContent || '' })
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowColorPicker(false)
        setShowExportMenu(false)
      }}
      className={`relative group rounded-xl border border-gray-200 p-4 transition-shadow duration-200 ${note.color} ${
        isHovered ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          ref={titleRef}
          className="font-medium text-gray-900 text-lg outline-none cursor-text"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleBlur}
        >
          {note.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPin(note.id)
          }}
          className={`p-2 rounded-full hover:bg-black/5 transition-colors ${
            note.isPinned ? 'text-gray-900' : 'text-gray-400 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Pin size={16} className={note.isPinned ? 'fill-current' : ''} />
        </button>
      </div>

      <div
        ref={bodyRef}
        className="text-gray-700 whitespace-pre-wrap min-h-[60px] mb-4 outline-none cursor-text text-sm leading-relaxed"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBodyBlur}
      >
        {note.content}
      </div>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map((tag) => (
            <span key={tag} className="bg-black/5 text-xs px-2 py-1 rounded-full text-gray-600">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className={`flex items-center justify-between mt-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center space-x-1">
          <div className="relative">
            <button
              onClick={() => setShowColorPicker((prev) => !prev)}
              className="p-2 rounded-full hover:bg-black/10 text-gray-600"
              title="更换颜色"
            >
              <Palette size={16} />
            </button>
            {showColorPicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 flex gap-1 border border-gray-200 z-20">
                {OFFICE_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleColorChange(c.value)}
                    className={`w-6 h-6 rounded-full border ${c.border} ${c.value} hover:scale-110 transition-transform`}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="p-2 rounded-full hover:bg-black/10 text-gray-600"
              title="导出"
            >
              <Download size={16} />
            </button>
            {showExportMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white shadow-xl rounded-lg py-2 w-40 border border-gray-200 z-20 flex flex-col">
                <button
                  onClick={() => {
                    exportMarkdown(note)
                    setShowExportMenu(false)
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Markdown
                </button>
                <button
                  onClick={() => {
                    exportWord(note)
                    setShowExportMenu(false)
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Word (.doc)
                </button>
              </div>
            )}
          </div>

          <button onClick={handleCopy} className="p-2 rounded-full hover:bg-black/10 text-gray-600" title="复制内容">
            <Copy size={16} />
          </button>

          <button onClick={() => onDelete(note.id)} className="p-2 rounded-full hover:bg-black/10 text-gray-600" title="删除">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

