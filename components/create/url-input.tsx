'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
interface UrlInputProps {
  analysisCallback: (page: number) => void
}

const UrlInput: React.FC<UrlInputProps> = ({ analysisCallback }) => {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, []);

  const handleDownload = async(link: string) => {   
    setLoading(true)
    try {
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
        setLoading(false)
        toast.error(res?.error || '出错了~ 请重试')
        return
      }
      analysisCallback(0)
    } catch (error) {
      setLoading(false)
      console.error(error)
      toast.error(
        '出错了！请重试~',
      );
    } finally {
      setLoading(false)   
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gi;
    const matchUrl = url.match(regex);
    // console.log(matchUrl)
    // const testUrl = new URL(url);
    if (matchUrl) {
      const theUrl = matchUrl[0]
      handleDownload(theUrl)
    } else {
      toast.error('请输入正确的视频链接')
    }
  }

  return (
    <div className="pt-24 mx-auto w-1/2 flex flex-col items-center justify-center space-y-3">
      <h2 className="text-black/70 dark:text-white/70 text-3xl font-medium">
        拆解视频
      </h2>
      <form 
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e)
          }
        }}
        className="w-full"
      >
        <div className="flex flex-col bg-light-secondary dark:bg-dark-secondary px-5 pt-5 pb-2 rounded-lg w-full border border-light-200 dark:border-dark-200">
          <Textarea
            ref={inputRef}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            rows={3}
            className="resize-none focus:outline-none w-full"
            placeholder='将视频链接粘贴在这里'
            disabled={loading}
          />
          <div className="flex flex-row items-center justify-between mt-2">
            <div className="flex flex-row space-x-3">
              <Image src="/images/douyin.png" width={16} height={16} alt="tiktok logo" />
              <Image src="/images/xiaohongshu.ico" width={16} height={16} alt="小红书logo" />
              <Image src="/images/bilibili.png" width={16} height={16} alt="bilibili logo" />
              <Image src="/images/instagram.png" width={16} height={16} alt="instagram logo" />
            </div>
            <div className="flex flex-row items-center space-x-4">
              <Button 
                type="submit"
                disabled={url.trim().length === 0 || loading}
                className="w-[36px] h-[36px] text-white bg-blue-600 hover:bg-blue-500 transition duration-100 rounded-full"
              >
                <ArrowRight size={17} />
              </Button>
            </div>
          </div>
        </div>
      </form>
      {loading && (
        <div className="w-full flex items-center justify-center text-black/70 dark:text-white/70">
          <div className='relative w-full h-[16px] bg-[#cccccc] rounded-[16px]'>
            <div className='absolute top-[2px] h-[12px] animate-linespin bg-blue-600 rounded-[12px]'></div>
          </div>
        </div>
      )}
    </div>
  )
};

export default UrlInput;
