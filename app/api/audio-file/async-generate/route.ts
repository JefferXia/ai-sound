import { NextRequest, NextResponse } from 'next/server'

import { VoiceDict } from '@/lib/config'
import {
  AsyncGenerateTTSReq,
  AsyncGenerateTTSResp,
  Content,
  DefaultAsyncGenerateTTSReq
} from '@/lib/ai/reecho/async-generate-tts'
import { ReechoServiceImpl } from '@/lib/ai/reecho/reecho-service'
import prisma from '@/lib/prisma'

enum ModelProvide {
  REECHO = 'REECHO'
}

enum ModelName {
  ReechoV1 = 'reecho-neural-voice-001'
}

type ModelInfo = {
  provider: ModelProvide
  modelName: ModelName
}

export async function POST(req: NextRequest) {
  const body: AsyncGenerateAudioFileReq = await req.json()
  const { userId, title, script, audioStyle, voiceConfigString } = body

  // Check if required parameters are provided
  if (!userId) {
    return NextResponse.json({ error: 'Missing required parameter: userId' }, { status: 400 })
  }

  if (!title || title.trim() === '') {
    return NextResponse.json({ error: 'Missing required parameter: title' }, { status: 400 })
  }

  if (!script) {
    return NextResponse.json({ error: 'Missing required parameter: script' }, { status: 400 })
  }

  if (!audioStyle) {
    return NextResponse.json({ error: 'Missing required parameter: audioStyle' }, { status: 400 })
  }

  if (!voiceConfigString) {
    return NextResponse.json({ error: 'Missing required parameter: voiceConfig' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })
  // console.log('user', user)
  if (!user) {
    console.error(`User not found: ${userId}`)
    return new Response('User not found', { status: 401 });
  }

  const asyncGenerateTTSReq: AsyncGenerateTTSReq = DefaultAsyncGenerateTTSReq
  const jsonString = script.replace(/^```json\n/, '').replace(/\n```$/, '')

  let conversation
  try {
    const parsedData = JSON.parse(jsonString)

    conversation = parsedData.conversation
    console.log('conversation', conversation)
  } catch (e) {
    console.error('Failed to parse JSON', e)
    return NextResponse.json({ error: 'Failed to parse JSON' }, { status: 500 })
  }

  // given different audioStyle, handle the conversation differently

  // map the conversation to reecho content format
  asyncGenerateTTSReq.contents = handleScriptContents(
    conversation,
    audioStyle,
    voiceConfigString
  )

  const asyncGenerateTTSResp: AsyncGenerateTTSResp =
    await ReechoServiceImpl.AsyncGenerateTTS(asyncGenerateTTSReq)

  const taskId = asyncGenerateTTSResp.id
  // create audio work for the task
  const modelInfo: ModelInfo = {
    provider: ModelProvide.REECHO,
    modelName: ModelName.ReechoV1
  }
  const audioWork = await prisma.audioWork.create({
    data: {
      audio_task_id: taskId,
      title: title,
      script: script,
      user_id: userId,
      user_name: user.name,
      model_info: modelInfo
    }
  })

  const resp: AsyncGenerateAudioFileResp = {
    audioWorkId: audioWork.id,
    generateSuccess: true,
    taskId: taskId
  }

  return Response.json(resp)
}

function handleScriptContents(
  conversation: { role: string; content: string }[],
  audioStyle: AudioWorkStyle,
  voiceConfigString: string
): Content[] {
  if (audioStyle === 'DIALOGUE') {
    const parsedVoiceConfig: DialogueConfig = JSON.parse(voiceConfigString)
    return conversation.map((item: any) => {
      if (item.role === 'host') {
        return {
          voiceId: VoiceDict[parsedVoiceConfig.host],
          text: item['content'],
          promptId: 'default'
        }
      } else {
        return {
          voiceId: VoiceDict[parsedVoiceConfig.guest],
          text: item['content'],
          promptId: 'default'
        }
      }
    })
  } else if (audioStyle === 'SOLO') {
    const parsedVoiceConfig: SoloConfig = JSON.parse(voiceConfigString)
    // console.log(conversation)
    const splittedContents = conversation[0].content.split('\n\n')
    // console.log('splittedContents', splittedContents)
    return splittedContents.map((content: any) => {
      return {
        voiceId: VoiceDict[parsedVoiceConfig.speaker],
        text: content,
        promptId: 'default'
      }
    })
  } else {
    throw new Error('Invalid audio style')
  }
}
