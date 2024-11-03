'use client'

import { Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner'

import { useGlobalContext } from "@/app/globalContext"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateUUID, Regex } from '@/lib/utils'

export function AudioCreate() {
  const [title, setTitle] = useState('')
  const [textLen, setTextLen] = useState(0)
  const [textInput, setTextInput] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [activeTab, setActiveTab] = useState('TEXT')
  const [wayValue, setWayValue] = useState('SOLO')
  const [hostValue, setHostValue] = useState('')
  const [guestValue, setGuestValue] = useState('')
  const [voiceData, setVoiceData] = useState<{ [key: string]: string }>()
  const inputRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const listRef = useRef<any>(null)
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [btnText, setBtnText] = useState('生成')
  const {
    setCreateId,
    setQueryData,
    generateStatus
  } = useGlobalContext()

  const handleGenerateBtn = () => {
    if (activeTab === 'URL' && !Regex.URL.test(linkInput)) {
      return toast('请输入正确的链接')
    }

    let query = activeTab === 'URL' ? linkInput : textInput
    const id = generateUUID()
    setCreateId(id)

    const info = {
      title,
      contentFormat: activeTab,
      content: query,
      audioWorkStyle: wayValue,
      voiceConfig: wayValue === 'SOLO' ? JSON.stringify({speaker: hostValue}) : JSON.stringify({host: hostValue, guest: guestValue})
    }
    // console.log(info)
    setQueryData(info)
    router.push('/sound-list')
  }

  const handleAutoFill = () => {
    setTitle('谈谈原生家庭疗愈')
    setActiveTab('TEXT')
    setTextInput(`如何做原生家庭的心理疗愈`)
  }

  useEffect(() => {
    (async() => {
      const response:any = await fetch('/api/config/voice-map', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const { voiceMap } = await response.json()
      setVoiceData(voiceMap)
      setHostValue(Object.entries(voiceMap)[0][0])
      setGuestValue(Object.entries(voiceMap)[0][0])
    })()

  }, [])

  // 监听生成状态变化
  useEffect(() => {
    if(generateStatus === 'success') { // 成功后清空表单
      setTitle('')
      setTextInput('')
      setLoading(false)
      // listRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if(generateStatus === 'scripting' || generateStatus === 'audioing') {
      setLoading(true)
    }
    const statusMessage =
      generateStatus === 'scripting' ? '文稿生成中' :
      generateStatus === 'audioing' ? '音频生成中' :
      '生成';

    setBtnText(statusMessage)
  }, [generateStatus])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-2 px-3 w-screen">
        <h1 className='text-3xl text-center font-bold tracking-tight text-primary drop-shadow-md leading-snug'>
          一键创作有趣的对话音频
        </h1>
        <div className='flex justify-end mt-2 px-4'>
          <Button
            size="sm"
            className="rounded-full"
            onClick={handleAutoFill}
          >
            推荐话题
          </Button>
        </div>
        <div className="mt-2 mb-8 px-4 flex items-center">
          <Label htmlFor="title" className="w-10 mr-4">
            标题
          </Label>
          <Input
            className='flex-1'
            id="title"
            tabIndex={0}
            type="text"
            placeholder="请输入标题"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
            }}
          />
        </div>
        <Tabs
          defaultValue="TEXT"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid mr-4 ml-16 grid-cols-2">
            <TabsTrigger value="TEXT">文本内容</TabsTrigger>
            <TabsTrigger value="URL">链接</TabsTrigger>
          </TabsList>
          <TabsContent value="TEXT" className="px-4">
            <div className="relative mt-8 flex items-center">
              <Label className="w-10 mr-4">
                素材
              </Label>
              <Textarea
                ref={textareaRef}
                placeholder={'一句话主题或长文本内容'}
                value={textInput}
                onChange={e => {
                  adjustHeight()
                  setTextInput(e.target.value)
                  setTextLen(e.target.value.length)
                }}
                className='min-h-[160px] overflow-hidden resize-none rounded-xl text-base bg-muted'
                rows={6}
                maxLength={1000}
              />
              <div className="absolute right-3 bottom-2 text-sm dark:text-white/80">
                {textLen} / 1000
              </div>
            </div>
          </TabsContent>
          <TabsContent value="URL" className="px-4">
            <div className="mt-8 flex items-center">
              <Label htmlFor="url" className="w-10 mr-4">
                素材
              </Label>
              <Input
                className='flex-1'
                id="url"
                ref={inputRef}
                tabIndex={1}
                type="url"
                placeholder="URL"
                value={linkInput}
                onChange={e => {
                  setLinkInput(e.target.value)
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 px-4 flex items-center">
          <Label className="w-10 mr-4">
            形式
          </Label>
          <Select onValueChange={setWayValue} value={wayValue}>
            <SelectTrigger className="w-[180px] rounded-lg">
              <SelectValue placeholder="选对话形式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOLO">单人</SelectItem>
              <SelectItem value="DIALOGUE">对谈</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 px-4 flex items-center">
          <Label className="w-10 mr-4">
            HOST
          </Label>
          <Select onValueChange={setHostValue} value={hostValue}>
            <SelectTrigger className="w-[180px] rounded-lg">
              <SelectValue placeholder="选一个声音" />
            </SelectTrigger>
            <SelectContent>
            {voiceData && Object.entries(voiceData).map(([key, value], index) => (
              <SelectItem key={`host-${index}`} value={key}>{value}</SelectItem>
            ))}
            </SelectContent>
          </Select>
          {wayValue === 'DIALOGUE' && (
          <>
          <Label className="w-10 mx-4">
            GUEST
          </Label>
          <Select onValueChange={setGuestValue} value={guestValue}>
            <SelectTrigger className="w-[180px] rounded-lg">
              <SelectValue placeholder="选一个声音" />
            </SelectTrigger>
            <SelectContent>
            {voiceData && Object.entries(voiceData).map(([key, value], index) => (
              <SelectItem key={`guest-${index}`} value={key}>{value}</SelectItem>
            ))}
            </SelectContent>
          </Select>
          </>)}
        </div>

        <div className='mt-8 mx-4'>
          <Button
            className="w-full text-base font-bold bg-[linear-gradient(225deg,_rgb(255,_58,_212)_0%,_rgb(151,_107,_255)_33%,_rgb(67,_102,_255)_66%,_rgb(89,_187,_252)_100%)] cursor-pointer"
            onClick={handleGenerateBtn}
            disabled={
              loading || !title ||
              (activeTab === 'URL' && !linkInput) ||
              (activeTab === 'TEXT' && !textInput)
            }
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {btnText}
          </Button>
        </div>

        {/* <div ref={listRef} className='flex flex-col py-8 mx-4 h-svh'>
          <h2 className='py-3 text-2xl font-medium border-t'>广场</h2>
          <AudioList />
        </div> */}
      </div>
    </div>
  )
}
