'use client'
import { readStreamableValue } from 'ai/rsc'
import { Clipboard, ClipboardCheck, Info, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { generate } from '@/app/create/actions'
import { useGlobalContext } from "@/app/globalContext"
import { Markdown } from '@/components/custom/markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import Loading from './loading'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { BestPromptName, BestPromptText } from '@/lib/ai/prompt-template'

export function CreateText() {
  const [template, setTemplate] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [scriptPrompt, setScriptPrompt] = useState('')
  const [scriptLen, setScriptLen] = useState(0)
  const [model, setModel] = useState('gpt-4o')
  const [generation, setGeneration] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const scriptRef = useRef<any>(null)
  const { isCopied, copyToClipboard } = useCopyToClipboard({})
  const router = useRouter()
  const {
    userInfo
  } = useGlobalContext()

  const handleGenerateBtn = async () => {
    if (generation !== '') {
      // 清空上一个结果
      setGeneration('')
    }
    setLoading(true)
    const { output } = await generate({
      userId: userInfo.id,
      systemPrompt,
      textMaterial: scriptPrompt,
      model
    })

    for await (const delta of readStreamableValue(output)) {
      setGeneration(currentGeneration => `${currentGeneration}${delta}`)
    }
    setLoading(false)
  }

  const handleCopyScript = () => {
    copyToClipboard(generation)
  }

  useEffect(() => {
    if(template) {
      setSystemPrompt(BestPromptText[template])
    } else {
      setSystemPrompt('')
    }
  }, [template])

  return (
    <div className="p-6 pt-24">
      {/* <h1 className="text-2xl font-medium text-center">文案助手</h1> */}
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-1/2 mr-12">
          <Label className="block mb-2 font-medium text-base">选择模板助手</Label>
          <div className="mb-5">
            <ToggleGroup 
              className='justify-start gap-2 flex-wrap'
              variant="outline" 
              type="single"
              value={template}
              onValueChange={setTemplate}
            >
            {Object.entries(BestPromptName).map(([key, value]: [string, string]) => (
              <ToggleGroupItem 
                key={key} 
                value={key} 
                aria-label={value} 
                className='data-[state=on]:bg-main-color data-[state=on]:text-white'
              >
                {value}
              </ToggleGroupItem>
            ))}
            </ToggleGroup>
          </div>
          <Label className="block mb-2 font-medium text-base">文案主题</Label>
          <div className="relative mb-5">
            <Textarea
              rows={8}
              maxLength={1000}
              placeholder='输入你的文案主题或者大纲'
              value={scriptPrompt}
              className="w-full border p-2 bg-muted rounded-lg placeholder:text-sm placeholder:leading-[22px] text-sm leading-[22px] resize-none"
              onChange={e => {
                setScriptPrompt(e.target.value)
                setScriptLen(e.target.value.length)
              }}
            />
            <div className="absolute right-3 bottom-3 text-sm text-black/80 dark:text-white/80">
              {scriptLen} / 1000
            </div>
          </div>
          <div className="flex space-x-8">
            <div>
              <Label className="block mb-2 font-medium text-base">
                模型选择
              </Label>
              <Select onValueChange={setModel} value={model}>
                <SelectTrigger className="w-[180px] rounded-lg">
                  <SelectValue placeholder="选择大模型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">ChatGPT-4o</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              {/* <Label className="block mb-2 font-medium text-base">
              API KEY
              </Label>
              <Input
                className="w-full"
                type="text"
                placeholder="暂时免费使用"
                value={keyValue}
                onChange={e => {
                  setKeyValue(e.target.value)
                }}
              /> */}
            </div>
          </div>
          <div className="mt-10">
            <Button
              className="w-full text-base font-bold cursor-pointer"
              onClick={handleGenerateBtn}
              disabled={loading || !systemPrompt || !scriptPrompt}
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              生成
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-base">生成结果</span>
            <div
              className="flex items-center text-sm cursor-pointer"
              onClick={handleCopyScript}
            >
              {isCopied ? (
                <>
                  <ClipboardCheck size={16} className="mr-1" />
                  已复制
                </>
              ) : (
                <>
                  <Clipboard size={16} className="mr-1" />
                  复制
                </>
              )}
            </div>
          </div>
          <div className='overflow-y-scroll' style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {generation && (
            <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
              <Markdown>{generation as string}</Markdown>
            </div>
          )}
          </div>
          {loading && (
            <Loading />
          )}
        </div>
      </div>
    </div>
  )
}