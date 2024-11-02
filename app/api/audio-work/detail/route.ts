import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body: GetAudioWorkDetailReq = await req.json()
  const { userId, audioWorkId } = body

  if (!audioWorkId) {
    return NextResponse.json({ error: 'Missing required parameter: audioWorkId' }, { status: 400 })
  }

  // get the audio work detail
  const audioWork = await prisma.audioWork.findUnique({
    where: {
      id: audioWorkId
    }
  })

  if (!audioWork) {
    console.error(`Audio work not found: ${audioWorkId}`)
    return NextResponse.json({ error: 'Audio work not found' }, { status: 400 })
  }

  const resp: GetAudioWorkDetailResp = {
    audioWork: {
      id: audioWork.id,
      title: audioWork.title,
      description: audioWork.description,
      script: audioWork.script,
      audioUrl: audioWork.audio_url,
      createdAt: audioWork.created_at,
      updatedAt: audioWork.updated_at,
      user: {
        id: audioWork.user_id,
        name: audioWork.user_name
      }
    }
  }

  return Response.json(resp)
}
