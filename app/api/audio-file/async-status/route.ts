import { NextRequest, NextResponse } from 'next/server'

import { DataStatus } from '@/lib/ai/reecho/common'
import { GetTTSStatusResp } from '@/lib/ai/reecho/get-tts-status'
import { ReechoServiceImpl } from '@/lib/ai/reecho/reecho-service'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body: GetAsyncAudioFileStatusReq = await req.json()
  const { userId, taskId } = body

  // Check if required parameters are provided
  if (!userId) {
    return NextResponse.json({ error: 'Missing required parameter: userId' }, { status: 400 })
  }

  if (!taskId) {
    return NextResponse.json({ error: 'Missing required parameter: taskId' }, { status: 400 })
  }

  // check the status of the task
  const getTTSStatusResp: GetTTSStatusResp =
    await ReechoServiceImpl.GetTTSStatus(taskId)

  const resp: GetAsyncAudioFileStatusResp = {
    audioWorkId: '',
    generated: false,
    audioUrl: ''
  }

  if (getTTSStatusResp.status == DataStatus.Generated) {
    // save the audio url to audio work
    const audioWork = await prisma.audioWork.findUnique({
      where: {
        audio_task_id: taskId
      }
    })
    if (!audioWork) {
      console.error(`Generated audio task lost track: ${taskId}`)
      return new Response('Audio work not found', { status: 401 })
    }
    await prisma.audioWork.update({
      where: {
        id: audioWork.id
      },
      data: {
        audio_url: getTTSStatusResp.metadata.audio!
      }
    })

    // audio file is generated
    resp.audioWorkId = audioWork.id
    resp.generated = true
    resp.audioUrl = getTTSStatusResp.metadata.audio!
  }

  return Response.json(resp)
}
