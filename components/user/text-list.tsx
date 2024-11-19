'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/app/globalContext'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'

interface taskItem {
  id: string,
  content: string
  taskInfo: any
  createdAt: string
}
export function TextList() {
  const [list, setList] = useState<taskItem[]>([])
  const [pageNum, setPageNum] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [noMoreData, setNoMoreData] = useState(false)
  const { userInfo } = useGlobalContext()
  const { isCopied, copyToClipboard } = useCopyToClipboard({})
  const pageCount = 10

  const fetchList = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetch('/api/my/text', {
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

  const handleCopyText = (text: string) => {
    copyToClipboard(text)
    toast('复制成功！')
  }

  return (
    <>
      <h2 className='mb-3 flex justify-between'>
        <span className='text-xl font-bold'>我创作的文案</span>
        <Link href="/account">查看账户余额</Link>
      </h2>
      <div className='grid grid-cols-5 gap-4'>
      {list.length > 0 && list.map((item: taskItem, index) => (
        <div key={item.id} className='p-4 rounded-2xl bg-muted/50'>
          <div className='text-sm font-bold'>
            {item.taskInfo?.parameters?.template}
          </div>
          <div className='relative my-3 text-base group cursor-pointer'>
            <div className='text-base line-clamp-3'>
              {item.content}
            </div>
            <div 
              className='flex justify-center items-center absolute inset-0 bg-[rgba(0,0,0,0.5)] rounded invisible group-hover:visible'
              onClick={() => handleCopyText(item.content)}
            >
              复制文本
            </div>
          </div>
          <div className='text-sm text-muted-foreground/50 text-right'>
            创建于 {item.createdAt}
          </div>
        </div>
      ))}
      </div> 
    </>
  );
}
