import { useEffect, useState } from 'react';
import { LayoutList, LayoutGrid } from 'lucide-react'
import { Scene, Subtitle } from '@/components/video/video-window'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SrtBoxLoading from '@/components/video/srt-skeleton'
import Image from 'next/image';
interface VideoSceneBoxProps {
  sceneData?: Scene[]
  handleSeek: (time: number) => void
}

const VideoSceneBox: React.FC<VideoSceneBoxProps> = ({ sceneData, handleSeek }) => {
  
  useEffect(() => {    
    
  }, []);

  return (
    <div className="p-8 shadow-sm rounded-lg bg-muted text-card-foreground">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className='flex justify-center'>
          <TabsTrigger value="list">
            <LayoutList size={25} />
          </TabsTrigger>
          <TabsTrigger value="grid">
            <LayoutGrid size={25} />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div>
            <table className="w-full border-collapse">
              <thead>
                <tr className='text-[#A0AEC0] text-left'>
                  <th className='w-8 px-0 py-3 border-b border-tbborder'></th>
                  <th className='w-[230px] px-6 py-3 border-b border-tbborder'>场景</th>
                  <th className='w-[100px] px-0 py-3 border-b border-tbborder'></th>
                  <th className='px-6 py-3 border-b border-tbborder'>文案</th>
                </tr>
              </thead>
              <tbody>
              {sceneData && sceneData.map((s:Scene, sceneIndex:number) => (
                (s.relatedSubtitles && s.relatedSubtitles.length > 0) ? (
                  s.relatedSubtitles.map((subtitle:Subtitle, subtitleIndex:number) => (
                    <tr key={`${sceneIndex}-${subtitleIndex}`}>
                      {subtitleIndex === 0 && (
                        <>
                        <td className='py-3 border-b border-tbborder' rowSpan={s.relatedSubtitles?.length}>
                          <span 
                            onClick={() => handleSeek(s.startTime)}
                            className='flex justify-center items-center w-8 h-8 text-white bg-main-color rounded-full cursor-pointer'>
                            {sceneIndex+1}
                          </span>
                        </td>
                        <td className='px-6 py-3 border-b border-tbborder' rowSpan={s.relatedSubtitles?.length}>
                          <Image
                            src={
                              `//${s.url}`
                            }
                            className='cursor-pointer'
                            alt={`Scene ${sceneIndex}`}
                            width={180}
                            height={320}
                            priority={false} // 表示启用懒加载
                            onClick={() => handleSeek(s.startTime)}
                          />
                        </td>
                        </>
                      )}
                      <td className='px-0 py-3 text-sm border-b border-tbborder'>
                        <p className="">
                          {`${subtitle.startTime} - ${subtitle.endTime}`}
                        </p>
                      </td>
                      <td className='px-6 py-3 border-b border-tbborder'>
                        <p className="">
                          {subtitle.text}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={`${sceneIndex}`}>
                    <td className='py-3 border-b border-tbborder'>
                      <span 
                        onClick={() => handleSeek(s.startTime)}
                        className='flex justify-center items-center w-8 h-8 text-white bg-main-color rounded-full cursor-pointer'>
                        {sceneIndex+1}
                      </span>
                    </td>
                    <td className='px-6 py-3 border-b border-tbborder'>
                      <Image
                        src={
                          `//${s.url}`
                        }
                        className='cursor-pointer'
                        alt={`Scene ${sceneIndex}`}
                        width={180}
                        height={320}
                        priority={false} // 表示启用懒加载
                        onClick={() => handleSeek(s.startTime)}
                      />
                    </td>
                    <td className='px-6 py-3 border-b border-tbborder'></td>
                    <td className='px-6 py-3 border-b border-tbborder'>无字幕</td>
                  </tr>
                )
              ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="grid">
          <div className='grid grid-cols-3 gap-4'>
          {sceneData && sceneData.map((s:Scene, sceneIndex:number) => (
            <div key={`scene-${sceneIndex}`} className='p-3 bg-light-secondary dark:bg-dark-secondary rounded-md'>
              <div 
                onClick={() => handleSeek(s.startTime)}
                className='relative w-full pt-[100%] cursor-pointer'>
                <Image
                  src={
                    `//${s.url}`
                  }
                  className='rounded-md'
                  alt={`Scene ${sceneIndex}`}
                  layout="fill"
                  objectFit="cover"
                  priority={false} // 表示启用懒加载
                />
              </div>

              <div className='px-3 py-2 text-sm'>
              {(s.relatedSubtitles && s.relatedSubtitles.length > 0) ? (
                s.relatedSubtitles.map((subtitle:Subtitle, subtitleIndex:number) => (
                  <p key={`sub-${subtitleIndex}`} className="line-clamp-1">
                    {subtitle.text}
                  </p>
                ))
              ) : (
                <p>无字幕</p>
              )}
              </div>
            </div>
          ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* {!sceneData && (
        <SrtBoxLoading />
      )} */}
    </div>
  );
};

export default VideoSceneBox;
