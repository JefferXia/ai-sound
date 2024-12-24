'use client'

import { Download, Loader2, Gem } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Loading from './loading'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { BetterTooltip } from '@/components/ui/tooltip'

export function CreateVideo() {
  const [script, setScript] = useState('')
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleGenerateBtn = async () => {
    setVideoUrl('')
    setLoading(true)
    const response = await fetch('/api/video/generate', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: script,
        model: "video-01"
      })
    })
    const res = await response.json()
    if (!response.ok) {
      setLoading(false)
      toast.error(res?.error || '出错了~ 请重试')
      return
    }   
    await pollForTask(res.id, res.taskId)
  }

  const queryTask = async (id: string, taskId: string) => {
    setLoading(true)
    const response = await fetch('/api/video/query-task', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        taskId,
      })
    })
    const res = await response.json()
    if (!response.ok) {
      return {}
    }
    return res
  }

  const pollForTask = async (id: string, taskId: string) => {
    const poll = async () => {
      const data = await queryTask(id, taskId)
      if(data?.downloadUrl) {
        setLoading(false)
        setVideoUrl(data.downloadUrl)
      } else {
        await sleep(20000)
        poll()
      }
    }
    poll()
  }

  const handleDownload = () => {
    if (!videoUrl) {
      return
    }
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = 'video-' + Date.now() // 设置下载后文件的名称
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="p-6 pt-24">
      <div className="w-1/2 mx-auto">
        <Label className="block mb-2 font-medium text-base">提示词</Label>
        <div className="relative mb-5">
          <Textarea
            rows={6}
            maxLength={500}
            placeholder={'输入你的提示词，比如：摄像机从高处俯瞰的位置开始缓慢下降，呈现出一个古老战场的全景。从高处的视角，可以看到一片广阔泥泞的大地，见证着下方激烈的冲突。摄像机镜头捕捉到陷入生死搏斗的战士们痛苦的吼叫、刀剑相击，用令人窒息的紧张感笼罩着感官。'}
            value={script}
            className="w-full border p-2 bg-muted rounded-lg placeholder:text-sm placeholder:leading-[22px] text-sm leading-[22px] resize-none"
            onChange={e => {
              setScript(e.target.value)
            }}
          />
        </div>

        <div className="mt-5">
          <BetterTooltip content="将消耗 60 积分">
            <Button
              className="w-full text-base font-bold cursor-pointer"
              onClick={handleGenerateBtn}
              disabled={loading || !script}
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              生成
              <span className='flex items-center'>
                （<Gem className='mr-1' size={16} />60）
              </span>
            </Button>
          </BetterTooltip>
        </div>

        <div className="mt-10 flex justify-between">
          <span className="font-medium text-base">生成结果</span>
          <div
            className="flex items-center text-sm cursor-pointer"
            onClick={handleDownload}
          >
            <Download size={16} className="mr-1" />
            下载
          </div>
        </div>
        {videoUrl && (
          <div className='mt-3'>
            <video
              className="w-full border-none appearance-none outline-none"
              controls
              controlsList="nodownload noplaybackrate nofullscreen"
              src={videoUrl}
            ></video>
          </div>
        )}
        {loading && <Loading />}
      </div>
    </div>
  )
}