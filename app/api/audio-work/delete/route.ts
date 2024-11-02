import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body: DeleteAudioWorkReq = await req.json()
  const { userId, audioWorkId } = body

  if (!userId) {
    return NextResponse.json({ error: 'Missing required parameter: userId' }, { status: 400 })
  }

  if (!audioWorkId) {
    return NextResponse.json({ error: 'Missing required parameter: audioWorkId' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  console.log('user', user)
  if (!user) {
    console.error(`User not found: ${userId}`)
    return new Response('User not found', { status: 401 })
  }

  const audioWork = await prisma.audioWork.findUnique({
    where: {
      id: audioWorkId
    }
  })
  if (!audioWork) {
    console.error(`Audio work not found: ${audioWorkId}`)
    return NextResponse.json({ error: 'Audio work not found' }, { status: 400 })
  }

  // Check if the user is the owner of the audio work
  if (audioWork.user_id !== userId) {
    console.error(`User is not the owner of the audio work: ${userId}`)
    return NextResponse.json({ error: 'User is not the owner of the audio work' }, { status: 400 })
  }

  await prisma.audioWork.update({
    where: {
      id: audioWorkId
    },
    data: {
      is_deleted: true
    }
  })

  return NextResponse.json({success: true}, { status: 200 })
}
