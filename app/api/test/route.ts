import { NextRequest } from 'next/server'

import prisma from '@/lib/prisma'
import { addPoint } from '@/lib/db'

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid')
  const amount = req.nextUrl.searchParams.get('amount') || '50'
  const vid = req.nextUrl.searchParams.get('vid')
  if(uid) {
    const res = await addPoint(uid, parseInt(amount), 'RECHARGE', '手动充值')
  
    return Response.json({success: true, data: res})
  }
  if(vid) {
    await prisma.video.delete({
      where: { id: vid },
    })
    return Response.json({success: true})
  }
  // await prisma.video.update({
  //   where: { id: 'cm476fwwd00036llneer5cojm' },
  //   data: {
  //     video_url: 'https://c.topmind.video/video/douyin_7439196403374607643.mp4'
  //   }
  // })
  // return Response.json({success: true})
}
