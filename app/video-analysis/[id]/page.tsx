
import { notFound } from "next/navigation"
import VideoWindow from '@/components/video/video-window'

type Params = {
  id: string
};
const VaPage = async({ 
  params
}: { 
  params: Promise<Params>
}) => {
  const { id } = await params
  if(!id) {
    return notFound()
  }
  return <VideoWindow id={id} />
};

export default VaPage
