'use server'

import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { groq } from '@/ai'
import { auth } from './(auth)/auth'
import prisma from '@/lib/prisma'
import { addPoint } from "@/lib/db"

type GenerateParam = {
  userId: string
  systemPrompt: string
  textMaterial: string
  model: string
  videoId: string
};

export async function generateSummary(data: GenerateParam) {
  const { systemPrompt, textMaterial, model, videoId } = data
  const session = await auth()
  const userId = session?.user?.id

  if (!userId || !systemPrompt || !textMaterial || !model || !videoId) {
    return { error: "Missing required parameters" }
  }

  const accountData = await prisma.user.findUnique({
    where: { 
      id: userId,
    },
    select: {
      balance: true,
    }
  });

  if (accountData && accountData.balance < 5) {
    return { error: "余额不足" }
  }

  const stream = createStreamableValue('');
  (async () => {
    // let accumulatedContent = ''
    const { textStream } = await streamText({
      model: groq('llama-3.1-70b-versatile'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: textMaterial,
        },
      ],
      onFinish: async (result) => {
        // console.log(result)
        try {
          await prisma.video.update({
            where: {
              id: videoId
            },
            data: {
              summary: result?.text,
            }
          });
          await addPoint(userId, -5, 'CONSUME', '消耗积分-生成脑图')
        } catch (error) {
          console.error('Error saving content work to database:', error);
        }
      },
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();
  return { output: stream.value };
}
