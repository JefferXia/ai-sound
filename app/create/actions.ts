'use server'
import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { groq } from '@/ai'
import { auth } from '@/app/(auth)/auth'
import prisma from '@/lib/prisma'
import { ContentType, FileFormat, TaskStatus } from '@prisma/client'
import { createTransaction, addPoint } from "@/lib/db"

type GenerateParam = {
  userId: string
  systemPrompt: string
  textMaterial: string
  model: string
  template: string
};

export async function generate(data: GenerateParam) {
  const { systemPrompt, textMaterial, model, template } = data
  const session = await auth()
  const userId = session?.user?.id

  if (!userId || !systemPrompt || !textMaterial || !model || !template) {
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
          await prisma.createTask.create({
            data: {
              user_id: userId,
              content_type: ContentType.TEXT,
              file_format: FileFormat.PLAIN_TEXT,
              content: result?.text,
              status: TaskStatus.SUCCESS,
              task_info: {
                model: model,
                parameters: {
                  systemPrompt,
                  textMaterial,
                  template
                }
              }
            }
          });
          // const transactionData = await createTransaction(accountData.id, ContentType.TEXT)
          await addPoint(userId, -5, 'CONSUME', '消耗积分-生成文案')
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
