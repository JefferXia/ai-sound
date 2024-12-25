'use client'

import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/app/globalContext'
import { toast } from 'sonner'
import Loading from '@/components/create/loading'
import NoData from '@/components/user/no-data'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { MinimaxVoiceNameMap } from '@/lib/config'
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

interface taskItem {
  id: string,
  content: string
  taskInfo: any
  createdAt: string
}
export function AudioList() {
  const [list, setList] = useState<taskItem[]>([])
  const [pageNum, setPageNum] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [noMoreData, setNoMoreData] = useState(false)
  const { userInfo } = useGlobalContext()
  const { isCopied, copyToClipboard } = useCopyToClipboard({})
  const pageCount = 12

  const fetchList = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetch('/api/my/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userInfo.id,
          limit: pageCount,
          offset: page * pageCount
        })
      })
      setLoading(false)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const { data } = await response.json()
      if(page === 0) {
        setList(data)
      } else {
        setList(prevList => [...prevList, ...data])
      }
      if(data?.length < pageCount) {
        setNoMoreData(true)
      }

    } catch (error) {
      setLoading(false)
      console.error('Error fetching user info:', error)
    }
  }

  useEffect(() => {
    setPageNum(0)
    fetchList(0)
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 1 && !loading && !noMoreData) {
      const nextPage = pageNum+1
      fetchList(nextPage)
      setPageNum(nextPage)
    }
  }

  const deleteAudio = async(id: string) => {
    const response = await fetch(`/api/audio/delete?id=${id}`)
    if(response.status === 200) {
      fetchList(0)
    }
  }

  return (
    <>
      <h2 className='flex justify-between mb-3'>
        <span className='text-xl font-bold'>我创作的音频</span>
      </h2>

      <div
        className='overflow-y-auto' 
        onScroll={handleScroll}
        style={{ height: 'calc(100vh - 10rem)' }}
      >
        {!loading && list.length === 0 && (
          <NoData />
        )}
        <div className='grid grid-cols-3 gap-4'>
        {list.length > 0 && list.map((item: taskItem, index) => (
          <div key={item.id} className='p-4 rounded-2xl bg-muted/50'>
            <div className='flex justify-between items-center'>  
              <span className='text-sm font-bold'>{MinimaxVoiceNameMap[item.taskInfo?.parameters?.voice_id]}</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2 className='cursor-pointer' size={20} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认</AlertDialogTitle>
                    <AlertDialogDescription>
                      确定要删除该音频吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteAudio(item.id)}>确定</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className='relative my-3'>
              <div className='mb-3'>
                <audio
                  className="w-full border-none appearance-none outline-none"
                  controls
                  controlsList="nodownload noplaybackrate nofullscreen"
                  src={item.content}
                ></audio>
              </div>
              <div className='text-sm line-clamp-1'>
                {item.taskInfo?.parameters?.script}
              </div>
            </div>
            <div className='text-sm text-muted-foreground/50 text-right'>
              创建于 {item.createdAt}
            </div>
          </div>
        ))}
        </div> 
        {loading && <Loading />}
      </div> 
    </>
  );
}
