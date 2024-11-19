'use server';
import { streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { groq } from '@/ai';
import prisma from '@/lib/prisma';
import { ContentType, FileFormat, TaskStatus } from '@prisma/client';
import { createTransaction } from "@/lib/db"

type GenerateParam = {
  userId: string
  systemPrompt: string
  textMaterial: string
  model: string
  template: string
};

export async function generate(data: GenerateParam) {
  const { userId, systemPrompt, textMaterial, model, template } = data;

  if (!userId || !systemPrompt || !textMaterial || !model || !template) {
    return { error: "Missing required parameters" }
  }

  const accountData = await prisma.account.findFirst({
    where: { 
      user_id: userId,
    },
    select: {
      id: true,
      balance: true,
    }
  });

  if (!accountData || accountData.balance < 5) {
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
          const transactionData = await createTransaction(accountData.id, ContentType.TEXT)
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
