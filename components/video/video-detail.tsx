import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VideoInfo } from '@/components/video/video-window'

const VideoInfoBox = ({ videoInfo }: { videoInfo?: VideoInfo }) => {
  
  useEffect(() => {    
    if (videoInfo) {
      // reset()     
    }
  }, [videoInfo]);

  return (
    <div className="grid grid-cols-3 gap-5 text-muted-foreground">
      <div className='shadow-sm rounded-lg bg-muted px-6 py-4'>
        <div className="mb-1">创作者</div>
        {videoInfo?.metadata?.author?.author_url ? (
          <Link href={videoInfo?.metadata?.author?.author_url} target='_blank' className='text-blue-500 hover:underline'>
            {videoInfo?.metadata?.author?.nickname}
          </Link>
        ) : (
          <div className='text-foreground'>
            {videoInfo?.metadata?.author?.nickname}
          </div>
        )}
      </div>
      <div className='shadow-sm rounded-lg bg-muted px-6 py-4'>
        <div className="mb-1">粉丝数</div>
        <div className='text-foreground'>{videoInfo?.metadata?.author?.follower_count || '--'}</div>
      </div>
      <div className='shadow-sm rounded-lg bg-muted px-6 py-4'>
        <div className="mb-1">平台</div>
        <div className='text-foreground'>{videoInfo?.source === 'DOUYIN' ? '抖音' : videoInfo?.source}</div>
      </div>
      <div className='shadow-sm rounded-lg bg-muted px-6 py-4'>
        <div className="mb-1">点赞数</div>
        <div className='text-foreground'>{videoInfo?.metadata?.stat?.digg_count || videoInfo?.metadata?.stat?.like_count}</div>
      </div>
      <div className='shadow-sm rounded-lg bg-muted px-6 py-4'>
        <div className="mb-1">评论数</div>
        <div className='text-foreground'>{videoInfo?.metadata?.stat?.comment_count}</div>
      </div>
      {videoInfo?.source === 'DOUYIN' ? (
        <div className='shadow-sm rounded-lg bg-muted px-6 py-4'>
          <div className="mb-1">收藏数</div>
          <div className='text-foreground'>{videoInfo?.metadata?.stat?.collect_count}</div>
        </div>
      ) : (
        <div className='shadow-sm rounded-lg bg-muted px-6 py-4'>
          <div className="mb-1">观看数</div>
          <div className='text-foreground'>{videoInfo?.metadata?.stat?.view_count}</div>
        </div>
      )}
      <div className='shadow-sm rounded-lg bg-muted px-6 py-4'>
        <div className="mb-1">时长</div>
        <div className='text-foreground'>{videoInfo?.metadata?.video?.duration}秒</div>
      </div>
      {/* <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
        <div className="mb-1">预估收益</div>
        <div className='text-foreground'>
          {videoInfo?.metadata?.stat?.digg_count ? `${Number(videoInfo?.metadata?.stat?.digg_count * 0.03).toFixed(2)} - ${Number(videoInfo?.metadata?.stat?.digg_count * 0.05).toFixed(2)}` : '--'}
        </div>
      </div> */}
    </div>
  );
};

export default VideoInfoBox;
