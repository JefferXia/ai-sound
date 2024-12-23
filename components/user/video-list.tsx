'use client'

import React, { useEffect, useState } from 'react'
import Loading from '@/components/create/loading'
import NoData from '@/components/user/no-data'
import { useGlobalContext } from '@/app/globalContext'

interface taskItem {
  id: string,
  content: string
  taskInfo: any
  createdAt: string
}
export function VideoList() {
  const [list, setList] = useState<taskItem[]>([])
  const [pageNum, setPageNum] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [noMoreData, setNoMoreData] = useState(false)
  const { userInfo } = useGlobalContext()
  const pageCount = 10

  const fetchList = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetch('/api/my/video', {
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

  return (
    <>
      <h2 className='flex justify-between mb-3'>
        <span className='text-xl font-bold'>我创作的视频</span>
      </h2>
      {!loading && list.length === 0 && (
        <NoData />
      )}
      <div className='grid grid-cols-3 gap-4'>
      {list.length > 0 && list.map((item: taskItem, index) => (
        <div key={item.id} className='p-4 rounded-2xl bg-muted/50'>
          <div className='flex justify-between items-center'>  
            <span className='text-sm font-bold'>{item.taskInfo?.model}</span>
          </div>
          <div className='relative my-3'>
            <div className='mb-3'>
              <video
                className="w-full border-none appearance-none outline-none"
                controls
                controlsList="nodownload noplaybackrate nofullscreen"
                src={item.content}
              ></video>
            </div>
            <div className='text-sm line-clamp-2'>
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
    </>
  );
}
