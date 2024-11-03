'use client'

import { Message } from 'ai'
import { useChat } from 'ai/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { useGlobalContext } from "@/app/globalContext"
import { spinner } from '@/components/custom/spinner'
import { DEMO_USER_ID, cn } from '@/lib/utils'

const AudioLoader = ({
  initialMessages
}: {
  initialMessages: Array<Message>
}) => {
  const [audioData, setAudioData] = useState<GetAsyncAudioFileStatusResp>(
    {} as GetAsyncAudioFileStatusResp
  )
  const pollTimeout = useRef<any>(null)
  const {
    createId,
    setCreateId,
    queryData,
    generateStatus,
    setGenerateStatus
  } = useGlobalContext()
  const { title, contentFormat, content, audioWorkStyle, voiceConfig } = queryData

  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: {
        id: createId,
        userId: DEMO_USER_ID,
        ...queryData
      },
      initialInput: content || '',
      api: '/api/script/generate',
      initialMessages,
      onFinish: (e: any) => {
        setInput('')
        // console.log(e?.content)
        fetchTaskId(e?.content)
        setGenerateStatus('audioing')
      },
      streamProtocol: 'text'
    })

  useEffect(() => {
    isLoading && setGenerateStatus('scripting')
  }, [isLoading])

  // 获取taskId
  const fetchTaskId = async (script: string) => {
    try {
      const response = await fetch('/api/audio-file/async-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          title: title,
          script,
          audioStyle: audioWorkStyle,
          voiceConfigString: voiceConfig
        })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const { taskId } = await response.json()
      pollForAudioFile(taskId) // 轮询
    } catch (error) {
      setGenerateStatus('')
      console.error('Error fetching taskId info:', error)
    }
  }

  // 获取音频
  const fetchAudioFile = async (taskId: string) => {
    try {
      const response = await fetch('/api/audio-file/async-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          taskId
        })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching audio info:', error)
    }
  }

  const pollForAudioFile = async (taskId: string) => {
    const poll = async () => {
      const data = await fetchAudioFile(taskId)
      if (data?.audioUrl && data?.generated) {
        // setAudioData(data)
        setCreateId('')
        setGenerateStatus('success')
        clearTimeout(pollTimeout.current)
      } else {
        pollTimeout.current = setTimeout(poll, 6000)
      }
    }
    poll()
  }

  useEffect(() => {
    handleSubmit()

    return () => {
      if (pollTimeout.current) {
        clearTimeout(pollTimeout.current)
      }
    }
  }, [])

  return (
    <div className={cn('flex flex-col justify-between bg-muted p-3 h-36 rounded-lg',
      !audioData?.audioUrl ? 'animate-pulse' : '')}
    >
      <div className='pt-2 line-clamp-1'>
      {audioData?.audioWorkId ? (
        <Link href="/">
          {title}
        </Link>
      ) : (
        <span>{title}</span>
      )}
      </div>

      {isLoading && (
      <div className='pb-7 flex justify-center'>
        {spinner}
        <span className='text-xs'>文案生成中</span>
      </div>)}
      {(!isLoading && !audioData.audioUrl) && (
      <div className='pb-7 flex justify-center'>
        {spinner}
        <span className='text-xs'>音频生成中</span>
      </div>)}

      {audioData?.audioUrl && (
        <div className="flex items-center">
          <audio
            className="w-full border-none appearance-none outline-none"
            controls
            controlsList="nodownload noplaybackrate nofullscreen"
            src={audioData.audioUrl}
          ></audio>
        </div>
      )}
    </div>
  )
}

export default AudioLoader
