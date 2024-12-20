'use client'
import Image from 'next/image'
import { readStreamableValue } from 'ai/rsc'
import { Clipboard, ClipboardCheck, Gem, Loader2, Link } from 'lucide-react'
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
import { toast } from 'sonner'
import { BetterTooltip } from '@/components/ui/tooltip'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { BestPromptName } from '@/lib/ai/prompt-template'

export function CreateText() {
  const [template, setTemplate] = useState('')
  const [link, setLink] = useState('')
  // const [systemPrompt, setSystemPrompt] = useState('')
  const [scriptPrompt, setScriptPrompt] = useState('')
  const [scriptLen, setScriptLen] = useState(0)
  const [model, setModel] = useState('gpt-4o')
  const [generation, setGeneration] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [analysising, setAnalysising] = useState(false)
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
    const res = await generate({
      // userId: userInfo.id,
      // systemPrompt,
      textMaterial: scriptPrompt,
      model,
      template
    })

    if(!res.output) {
      setLoading(false)
      toast.error(res?.error || '出错了~ 请重试')
      return
    }
    for await (const delta of readStreamableValue(res.output)) {
      setGeneration(currentGeneration => `${currentGeneration}${delta}`)
    }
    setLoading(false)
  }

  const handleCopyScript = () => {
    copyToClipboard(generation)
  }

  // useEffect(() => {
  //   if(template) {
  //     setSystemPrompt(BestPromptText[template])
  //   } else {
  //     setSystemPrompt('')
  //   }
  // }, [template])

  const handleAnalysisLink = async () => {
    setAnalysising(true)
    const analysisUrl = link.includes('douyin.com') ? '/api/analysis/douyin' : '/api/analysis/dlp';
    const response: any = await fetch(analysisUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: link
      })
    })
    const res = await response.json()
    if (!response.ok) {
      setAnalysising(false)
      toast.error(res?.error || '出错了~ 请重试')
      return
    }
    setTemplate('secondCreation')
    setScriptPrompt(`${res?.data?.content}`)
    setAnalysising(false)
  }

  return (
    <div className="p-6 pt-24">
      {/* <h1 className="text-2xl font-medium text-center">文案助手</h1> */}
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-1/2 mr-12">
          <Label className="block mb-2 font-medium text-base">选择智能助手</Label>
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
                className='data-[state=on]:bg-blue-600 data-[state=on]:text-white'
              >
                {value}
              </ToggleGroupItem>
            ))}
            </ToggleGroup>
          </div>
          <div className="mb-2 flex items-center">
            <Label className="font-medium text-base">爆款链接（可选项）</Label>
            <div className="ml-2 flex space-x-3">
              <Image src="/images/tiktok.png" width={16} height={16} alt="tiktok logo" />
              <Image src="/images/xiaohongshu.ico" width={16} height={16} alt="小红书logo" />
              <Image src="/images/bilibili.png" width={16} height={16} alt="bilibili logo" />
              {/* <Image src="/images/youtube.png" width={16} height={16} alt="youtube logo" /> */}
              <Image src="/images/instagram.png" width={16} height={16} alt="instagram logo" />
            </div>
          </div>
          <div className='w-full mb-5 flex items-center gap-1 p-1 pl-5 border-2 rounded-lg'>
            <Link />
            <Input 
              className='border-none outline-0 bg-transparent ring-0 focus-visible:ring-offset-0 focus-visible:outline-0 focus-visible:ring-0' 
              placeholder='请输入爆款短视频链接'
              onChange={e => {
                setLink(e.target.value)
              }}
            />
            <BetterTooltip content="将消耗 10 积分">
              <Button 
                className='bg-blue-600 hover:bg-blue-500 text-white rounded-lg' 
                onClick={handleAnalysisLink}
                disabled={analysising}
              >
                {analysising && <Loader2 className="mr-2 size-4 animate-spin" />}
                {analysising ? '分析中' : '分析链接'}
              </Button>
            </BetterTooltip>
          </div>
          <Label className="block mb-2 font-medium text-base">文案主题</Label>
          <div className="relative mb-5">
            <Textarea
              rows={8}
              maxLength={3000}
              placeholder='输入你的文案主题或者大纲'
              value={scriptPrompt}
              className="w-full border p-2 bg-muted rounded-lg placeholder:text-sm placeholder:leading-[22px] text-sm leading-[22px] resize-none"
              onChange={e => {
                setScriptPrompt(e.target.value)
                setScriptLen(e.target.value.length)
              }}
            />
            <div className="absolute right-3 bottom-3 text-sm text-black/80 dark:text-white/80">
              {scriptLen} / 3000
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
            <BetterTooltip content="将消耗 5 积分">
              <Button
                className="w-full text-base font-bold cursor-pointer"
                onClick={handleGenerateBtn}
                disabled={loading || !template || !scriptPrompt}
              >
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                生成
                <span className='flex items-center'>
                （<Gem className='mr-1' size={16} />5）
                </span>
              </Button>
            </BetterTooltip>
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
