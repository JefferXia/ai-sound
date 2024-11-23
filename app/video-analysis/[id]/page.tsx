
import { notFound } from "next/navigation"
import VideoWindow from '@/components/video/video-window'

const Page = async({ 
  params
}: { 
  params: { id: string }
}) => {
  const { id } = await params
  if(!id) {
    return notFound()
  }
  return <VideoWindow id={id} />
};

export default Page
