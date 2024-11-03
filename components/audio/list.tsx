'use client'

import { ExternalLink, Trash2 } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import { useGlobalContext } from "@/app/globalContext"
import AudioLoader from '@/components/audio/loader'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { DEMO_USER_ID } from '@/lib/utils'
import WaveLoader from "./wave-loader"
import AudioPlayingLoader from "./audio-loader"

const AudioList = () => {
  const [listData, setListData] = useState<AudioWorkCard[]>([])
  const [pageNum, setPageNum] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [noMoreData, setNoMoreData] = useState(false)
  const [playingId, setPlayingId] = useState(-1)
  const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 })
  const audioRefs = useRef<any>([]); // 创建一个 ref 数组
  const {
    createId,
    queryData,
    generateStatus
  } = useGlobalContext()
  const pageCount = 10

  const fetchAudioList = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetch('/api/audio-work/feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          limit: pageCount,
          offset: page * pageCount
        })
      })
      setLoading(false)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const { audioWorkCards } = await response.json()
      if(page === 0) {
        setListData(audioWorkCards)
      } else {
        setListData(prevList => [...prevList, ...audioWorkCards])
      }
      if(audioWorkCards?.length < pageCount) {
        setNoMoreData(true)
      }

    } catch (error) {
      setLoading(false)
      console.error('Error fetching user info:', error)
    }
  }

  useEffect(() => {
    setPageNum(0)
    fetchAudioList(0)
  }, [])

  useEffect(() => {
    if(generateStatus === 'success') {
      setPageNum(0)
      fetchAudioList(0)
    }
  }, [generateStatus])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 1 && !loading && !noMoreData) {
      const nextPage = pageNum+1
      fetchAudioList(nextPage)
      setPageNum(nextPage)
    }
  }

  const handleCopyLink = (item: AudioWorkCard) => {
    copyToClipboard(`${window.location.origin}/content/${item.id}`)
    toast.success('分享链接已复制')
  }

  const handleDelete = async(item: AudioWorkCard) => {
    try {
      const response = await fetch('/api/audio-work/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          audioWorkId: item.id
        })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      data.success && toast.success('删除成功')
      setPageNum(0)
      fetchAudioList(0)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  return (
    <div 
      className='flex-1 overflow-y-auto' 
      onScroll={handleScroll}
    >
      <div className='grid grid-cols-2 gap-4'>
      {(createId && queryData) && (
        <AudioLoader
          initialMessages={[]}
        />
      )}

      {listData.length > 0 && listData.map((item, index) => (
        <div key={item.id} className="flex flex-col justify-between bg-muted p-3 h-36 rounded-xl">
          <div className='flex justify-between'>
            <div
              className='pt-2 line-clamp-1'
            >
              <Link href="/">
                {item.title}
              </Link>
            </div>
            {/* <div className='flex pt-2 space-x-3'>
              <ExternalLink
                size={16}
                className='cursor-pointer'
                onClick={() => handleCopyLink(item)}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2
                    size={16}
                    className='cursor-pointer'
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确定要删除吗?</AlertDialogTitle>
                    <AlertDialogDescription>
                      删除后无法恢复，确认要删除吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(item)}>确认</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div> */}
          </div>
          <div className={cn("justify-center",
            playingId === index ? 'flex' : 'hidden'
          )}>
            <AudioPlayingLoader />
          </div>
          <div className="flex items-center">
            <audio
              ref={(el:any) => audioRefs.current[index] = el}
              className="w-full border-none appearance-none outline-none"
              controls
              controlsList="nodownload noplaybackrate nofullscreen"
              src={item?.audioUrl}
              onPlay={() => {
                playingId >= 0 && audioRefs.current[playingId].pause()
                setPlayingId(index)
              }}
              onPause={() => {
                playingId === index && setPlayingId(-1)
              }}
            ></audio>
          </div>
        </div>
      ))}
      </div>
      {loading && (
        <div className={cn('w-full',
          pageNum > 0 ? 'h-[40px]' : 'h-[300px]')}
        >
          <WaveLoader />
        </div>
      )}
    </div>
  )
}

export default AudioList
