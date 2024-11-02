import { NextRequest } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body: GetAudioWorkFeedReq = await req.json()
  let { userId, limit, offset } = body

  if (!limit) {
    limit = 10
  }

  const audioWorks = await prisma.audioWork.findMany({
    where: {
      is_deleted: false
    },
    orderBy: {
      created_at: 'desc'
    },
    take: limit,
    skip: offset
  })

  const resp: GetAudioWorkFeedResp = {
    audioWorkCards: audioWorks.map((audioWork:any) => {
      return {
        id: audioWork.id,
        title: audioWork.title,
        audioUrl: audioWork.audio_url,
        createdAt: audioWork.created_at
      }
    })
  }

  return Response.json(resp)
}
