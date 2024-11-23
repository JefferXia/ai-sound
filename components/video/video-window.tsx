'use client';

import { readStreamableValue } from 'ai/rsc'
import React, { useEffect, useRef, useState } from 'react';
import Error from 'next/error'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Copy, Download, ClipboardPenLine, Layers2, Loader2, Route } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { BetterTooltip } from '@/components/ui/tooltip'
import VideoInfoBox from '@/components/video/video-detail'
import VideoMarkmapBox from '@/components/video/video-markmap'
import VideoSceneBox from '@/components/video/video-scene'
import Loading from '../create/loading'
import { generateSummary } from '@/app/actions'
import { useGlobalContext } from "@/app/globalContext"
import { BestPromptText } from '@/lib/ai/prompt-template'

export interface Scene {
  startTime: number
  endTime: number
  url: string
  relatedSubtitles?: Subtitle[]
}
export interface Subtitle {
  text: string
  startMs: number
  endMs: number
  speechSpeed?: number
  wordsNum?: number
  startTime: string
  endTime: string
}
export interface Subtitles {
  asrData: Subtitle[]
}

export interface VideoInfo {
  id: string
  video_url: string
  title?: string
  content?: string
  metadata: any
  scene?: any
  subtitles?: any
  summary?: string
  source?: string
  created_at: Date 
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const VideoWindow = ({ 
  id,
  isFirst
}: { 
  id: string
  isFirst?: boolean
}) => {
  const [generating, setGenerating] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [videoInfo, setVideoInfo] = useState<VideoInfo>()
  const [subtitles, setSubtitles] = useState<Subtitles>()
  const [scene, setScene] = useState<Scene[]>()
  const [newScene, setNewScene] = useState<Scene[]>()
  const [markmapData, setMarkmapData] = useState('')
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // const searchParams = useSearchParams();
  const router = useRouter();
  const {
    userInfo
  } = useGlobalContext()

  const loadVideoData = async () => {
    try {
      const res = await fetch(
        `/api/video/detail?id=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.status === 404) {
        setNotFound(true);
        return;
      }

      const data = await res.json();
      if (data?.video) {
        const videoData = data.video

        setVideoInfo(videoData);

        if (videoData.scene) {
          setScene(data.video.scene?.frames)
        }

        if (videoData.subtitles) {
          setSubtitles(data.video.subtitles)
        }

        if (videoData.summary) {
          setMarkmapData(videoData.summary)
        }
      }
    } catch (error) {
      setNotFound(true);
      console.error('loadVideoData catch error');
    }
  };

  const handleGenerateSummary = async () => {
    if(!videoInfo?.content) {
      toast.error('没有视频文案')
      return false
    }
    try {
      setGenerating(true)
      const res = await generateSummary({
        userId: userInfo.id,
        systemPrompt: BestPromptText['summary'],
        textMaterial: videoInfo?.content,
        model: 'gpt-4o',
        videoId: videoInfo?.id
      })

      if(!res.output) {
        setGenerating(false)
        toast.error(res?.error || '出错了~ 请重试')
        return
      }
      for await (const delta of readStreamableValue(res.output)) {
        setMarkmapData(currentGeneration => `${currentGeneration}${delta}`)
      }
      setGenerating(false)
    } catch(err:any) {
      setGenerating(false)
      toast.error(err.message)
    }
  }

  useEffect(() => {
    (async() => {
      await loadVideoData()
      setIsReady(true)
    })()    
  }, []);

  useEffect(() => {
    if(scene) {
      const newSceneData = scene.map((s, index) => {
        if(subtitles?.asrData && subtitles?.asrData.length > 0) {
          // 找出当前 scene 包含的 subtitles
          const relatedSubtitles = subtitles.asrData.filter((sub) =>
            index === scene.length - 1
              ? sub.endMs >= s.startTime
              : ((sub.startMs >= s.startTime && sub.endMs <= s.endTime) ||
                (sub.startMs <= s.startTime && sub.endMs >= s.startTime))
          );

          // 返回新的 scene 对象，添加 relatedSubtitles 属性
          return {
            ...s,
            relatedSubtitles
          };
        } else {
          return {
            ...s,
            relatedSubtitles: []
          };
        }
      });

      setNewScene(newSceneData);
    }
  }, [scene, subtitles]);

  const copyText = () => {
    if (videoInfo?.content) {
      navigator.clipboard.writeText(videoInfo?.content)
      toast.success('复制成功')
    } else {
      toast.error('该视频没有文案')
    }
  }

  const downloadVideo = () => {
    if (!videoInfo?.video_url) {
      return
    }
    const a = document.createElement('a');
    a.href = videoInfo?.video_url;
    a.download = videoInfo?.title || ('video-' + Date.now()); // 设置下载后文件的名称
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const seekTo = (time: number) => {
    if(videoRef.current) {
      videoRef.current.currentTime = Math.floor(time / 1000);
      videoRef.current.play()
    }
  }

  return isReady ? (
    notFound ? (
      <Error statusCode={404} />
    ) : (
      <div className='max-w-screen-lg mx-auto pt-24'>
        <div className="w-full flex space-x-5">
          <div className="w-[270px]">
            <div className="sticky top-16">
              <div className="flex w-[270px] h-[480px] justify-center items-center bg-black">
                <video 
                  controls
                  controlsList='nodownload nofullscreen'
                  ref={videoRef}
                  src={`${videoInfo?.video_url}`}
                  width="270"
                  // onMouseEnter={() => {
                  //   videoRef.current && videoRef.current.play()
                  // }}
                  // onMouseLeave={() => {
                  //   videoRef.current && videoRef.current.pause()
                  // }}
                ></video>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button variant="secondary" onClick={copyText}>
                  <Copy className="mr-2 h-4 w-4" />复制文案
                </Button>

                <Button variant="secondary" onClick={downloadVideo}>
                  <Download className="mr-2 h-4 w-4" />下载视频
                </Button>

                <Button variant="secondary">
                  <Layers2 className="mr-2 h-5 w-4" />模仿创作
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-5 pb-10">
            <h3 className="line-clamp-1 text-lg">
              {videoInfo?.title}
            </h3>
            <VideoInfoBox videoInfo={videoInfo} />

            {!markmapData && (
              <div className="flex justify-center items-center h-56 shadow-sm rounded-lg bg-muted">
                <BetterTooltip content="将消耗 5 积分">
                  <Button 
                    className='bg-blue-600 hover:bg-blue-500 text-white rounded-lg' 
                    onClick={handleGenerateSummary}
                    disabled={generating}
                  >
                    {generating && <Loader2 className="mr-2 size-4 animate-spin" />}
                    <Route className="mr-2 h-4 w-4" />生成脑图
                  </Button>
                </BetterTooltip>
              </div>
            )}
            {(generating || markmapData) && <VideoMarkmapBox markmapData={markmapData} />}

            <VideoSceneBox sceneData={newScene} handleSeek={seekTo} />
          </div>
        </div>
      </div>
    )
  ) : (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <Loading />
    </div>
  );
};

export default VideoWindow;