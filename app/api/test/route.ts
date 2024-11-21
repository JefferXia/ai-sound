import { NextRequest } from 'next/server'

import prisma from '@/lib/prisma'
import { createRecharge } from '@/lib/db'

export async function GET(req: NextRequest) {
  // const data =  await prisma.user.findUnique({
  //   where: { id: 'a3192a56-34a8-4c6c-9a5a-6aa6bb9bf132' },
  // })
  // const data =  await prisma.video.update({
  //   where: { id: 'cm3q03ig8000037ryqqim69le' },
  //   data: {
  //     video_url: 'https://video-1255988328.cos.ap-nanjing.myqcloud.com/va/videos/7431065052020608268.mp4'
  //   }
  // })
  
  return Response.json({success: true})
}
