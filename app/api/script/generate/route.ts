import { streamObject, streamText } from 'ai'
import _ from 'lodash'
import { NextRequest, NextResponse } from 'next/server'

import { customOpenAI, customModel } from '@/ai'
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
你是一个世界级的脱口秀大师，对于给定的主题，你要运用你的智慧、创造力和观察力，根据这些话题创作一段300字左右的脱口秀。
## Workflow
1. 对于话题进行搜索，找到相关的信息。信息只用于辅助后续创作，不要直接输出。
2. 创作小话题：先对主题进行发散，找到一些小话题，也就是这个话题有关联的一些方面，比如对于打车，可以列出等车、坐车、打车软件等等
3. 创作负面情绪：对于这个话题，想出负面的观点或者态度，负面态度可以包括困难、奇怪、害怕、愚蠢等，不限于这四种，但是这四种最容易出梗。比如对于打车，可以列出以下负面观点：
1. 每天打车上班都要花1个小时 
2. 明明很多车是空车，可是你招手它就是不停 
3. 有些车里的味道特别大，司机还在抽烟
4. 选择一个观点，列出各种假设：比如对于“每天打车上班都要花1个小时”这个观点，可以假设我离公司很远，或者假设路上很堵
5. 选择一个大家最容易想到的目标假设，找出一个连接点，“是什么使我产生这个目标假设的？“：对于上面这个假设，是因为路上花的时间长
6. 列出几个对连接点的再解读：对于打车时间长，可以再解读为路上很堵、要绕远、速度很慢、我在路上浪费了时间等
7. 选择一个再解读，完成故事2：对于速度很慢，可以解读为我是走路上班的；对于我在路上浪费了时间，可以解读为我有强迫症，每次关门要关半小时
8. 写一个可以解释这个故事2的笑点，对于上面两个故事2，可以分别写笑点为：因为我走路只能走这么快了，每公里10分钟，6公里刚好走1小时；其中关门半小时
9. 把铺垫和笑点连接成完整的段子
10. 再重复2次步骤4-9，每一次都选择一个不同的连接点，并创作一个完整的段子
11. 对生成的3个段子进行比较，选出其中最好笑的一个，并给出理由
12. 对这个段子进行修改，把铺垫改短一些，让梗的密度大一些。同时，加上不同视角，使用类比，来提供更多样化的笑点。
## Rules
1. 找到独特的角度，想想大家都会从什么角度讲一个主题，你就避开它，从其他角度出发。
2. 在表演中融入个人轶事或经历，以使表演更贴近生活，更能吸引观众。
3. 要敢于讽刺，但是不要直接用脏话。
4. 多切换视角，比如从外来者的视角、学术的视角、小孩子的视角、宠物的视角等角度来看待一件事情。
5. 多使用类比，进行深入的洞察，在两个差别较大的事物之间，找到共同点。
6. 脱口秀长度在300字左右。`

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
    model: customOpenAI('gpt-4o', {
      structuredOutputs: true
    }),
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
