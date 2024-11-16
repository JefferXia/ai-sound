'use server';
import { ContentType, FileFormat, TaskStatus } from '@prisma/client';
import { streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { groq } from '@/ai';
import prisma from '@/lib/prisma';

type GenerateParam = {
  userId: string;
  systemPrompt: string;
  textMaterial: string;
  model: string;
};

export async function generate(data: GenerateParam) {
  const { userId, systemPrompt, textMaterial, model } = data;
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
        console.log(result)
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
                  textMaterial
                }
              }
            }
          });
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
