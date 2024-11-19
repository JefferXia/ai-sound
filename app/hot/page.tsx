'use client'

import { PlayCircle, Download, Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import Loading from '@/components/create/loading'

export interface VideoItem {
  id: string;
  url: string;
  title: string;
  extractor: string;
  metadata: string;
  metadataObj: any;
  createdAt: number;
}

const Page = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const formatNumber = (num:number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    } else {
      return num.toString();
    }
  }

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      const newData = data.videos.map((item:any) => ({
        metadataObj: JSON.parse(item.metadata),
        ...item
      }));

      setVideos(newData);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  const downloadVideo = (url:string) => {
    const a = document.createElement('a');
    a.href = '//'+url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return loading ? (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <Loading />
    </div>
  ) : (
    <>
      {videos.length === 0 && (
        <div className="flex flex-row items-center justify-center min-h-screen">
          <p className="text-black/70 dark:text-white/70 text-sm">
          没有数据
          </p>
        </div>
      )}
      {videos.length > 0 && (
        <div className="grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 gap-4">
          {videos.map((video, i) => (
            <div
              className="flex flex-col justify-between p-3 pb-2 bg-muted rounded-lg"
              key={i}
            >
              <div 
                onClick={() => {
                  videoRefs.current[i] && videoRefs.current[i].play()
                }}
                className='flex flex-1 justify-center items-center bg-black relative transition duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer'>
                <video
                  className='w-full'
                  ref={(el:any) => (videoRefs.current[i] = el)}
                  src={`//${video.url}`}
                  onMouseLeave={() => {
                    videoRefs.current[i] && videoRefs.current[i].pause()
                  }}
                ></video>
                <div className="absolute bg-white/70 dark:bg-black/70 text-black/70 dark:text-white/70 px-2 py-1 flex flex-row items-center space-x-1 bottom-1 right-1 rounded-md">
                  <PlayCircle size={15} />
                  <p className="text-xs">点击播放</p>
                </div>
              </div>
              <div className=''>
                <div className='flex justify-around py-4'>
                  <div className='text-center'>
                    <p className='text-lg font-medium'>{formatNumber(video.metadataObj?.like_count)}</p>
                    <p className="text-sm text-gray-500">点赞</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-lg font-medium'>{formatNumber(video.metadataObj?.comment_count)}</p>
                    <p className="text-sm text-gray-500">评论</p>
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  <Link
                    className="block w-2/3"
                    href={`/video-analysis/${video.id}`}
                  >
                    <Button variant="outline" className="w-full h-[33px] hover:bg-opacity-85 bg-[linear-gradient(225deg,_rgb(255,_58,_212)_0%,_rgb(151,_107,_255)_33%,_rgb(67,_102,_255)_66%,_rgb(89,_187,_252)_100%)]">
                    拆解视频
                    </Button>
                  </Link>
                  <div className='flex space-x-2'>
                    <Download className='cursor-pointer' size={20} onClick={() => downloadVideo(video.url)} />
                    <Star className='cursor-pointer' size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;