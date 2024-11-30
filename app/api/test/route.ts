import { NextRequest } from 'next/server'

import prisma from '@/lib/prisma'
import { addPoint } from '@/lib/db'

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid')
  const amount = req.nextUrl.searchParams.get('amount') || '50'
  if(!uid) {
    return Response.json({success: false })
  }
  // const data =  await prisma.video.update({
  //   where: { id: 'cm3q03ig8000037ryqqim69le' },
  //   data: {
  //     video_url: 'https://video-1255988328.cos.ap-nanjing.myqcloud.com/va/videos/7431065052020608268.mp4'
  //   }
  // })
  const res = await addPoint(uid, parseInt(amount), 'RECHARGE', '手动充值')
  
  return Response.json({success: true, data: res})
}
