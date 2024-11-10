import { streamObject, streamText } from 'ai'
import _ from 'lodash'
import { NextRequest, NextResponse } from 'next/server'

import { customOpenAI, customModel, groq } from '@/ai'
import { GetAudioWorkScriptSchema } from '@/lib/ai/schema'
import { Regex } from '@/lib/utils'
import { sevenThetaService } from '@/services'

export async function POST(request: NextRequest) {
  const body: GenerateScriptReq = await request.json()
  const { userId, contentFormat, content, audioWorkStyle } = body

  if (!userId) {
    return NextResponse.json({error: 'Missing required parameter: userId'}, { status: 400 })
  }

  if (!contentFormat) {
    return NextResponse.json({error: 'Missing required parameter: format'}, { status: 400 })
  }

  if (!content) {
    return NextResponse.json({error: 'Missing required parameter: content'}, { status: 400 })
  }

  if (!audioWorkStyle) {
    return NextResponse.json({error: 'Missing required parameter: audioWorkStyle'}, { status: 400 })
  }

  const requestId = request.headers.get('x-request-id') || 'xxx'

  let scriptPrompt = ''

  // if format is URL, check regex of content is URL
  if (contentFormat === 'URL') {
    if (!Regex.URL.test(content)) {
      return NextResponse.json({error: 'Invalid URL'}, { status: 400 })
    }
    const scrapResp: WebTextScrapResp = await sevenThetaService.webTextScrape(
      requestId!,
      content
    )
    console.log(
      `requestId: ${requestId}, scrapResp: ${JSON.stringify(scrapResp)}`
    )
    scriptPrompt = scrapResp.chunk_list.join('\n')
    console.log(`requestId: ${requestId}, scriptPrompt: ${scriptPrompt}`)
  } else {
    scriptPrompt = content
  }

  // const session = await auth()
  //
  // if (!session) {
  //   return new Response('Unauthorized', { status: 401 })
  // }

  const promptTemplate = `## Goals
  你是一个播客对话内容生成器，你需要将我给你的内容转换为自然的对话，创作一段500字左右的谈话文案。
  
  ## Workflow
  1. 对于话题进行搜索，找到相关的信息。信息只用于辅助后续创作，不要直接输出。
  2. 生成一个播客内容大纲，包括5-10个主要点。大纲只用于内容梳理，不要直接输出。
  3. 根据内容大纲筛选几个观点，结合话题内容进行深入分析探讨。

  ## Rules
  1. 对话以探讨交流形式，不要问答形式。对话需要更口语化一点。
  2. 对话不是简单的一问一答，应该在每个发言中都抛出更多的观点和内容知识。
  3. 要敢于讽刺，但是不要直接用脏话。
  4. 正式对话开始前需要有引入主题的对话，需要欢迎大家收听本期播客。
  5. 文案长度在500字左右。`

  // const { fullStream } = await streamText({
  //   model: customModel(),
  //   system:
  //     'You are a helpful writing assistant. Based on the description, please update the piece of writing.',
  //   messages: [
  //     {
  //       role: 'user',
  //       content: scriptPrompt,
  //     },
  //   ],
  // });

  // return fullStream

  const resultV2 = await streamObject({
    // model: customOpenAI('gpt-4o', {
    //   structuredOutputs: true
    // }),
    model: groq('llama-3.1-70b-versatile'),
    schema: GetAudioWorkScriptSchema(audioWorkStyle),
    system: promptTemplate,
    messages: [
      {
        role: 'user',
        content: scriptPrompt
      }
    ],
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text'
    }
  })

  return resultV2.toTextStreamResponse({})

}
