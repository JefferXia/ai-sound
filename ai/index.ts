import { createOpenAI, openai } from '@ai-sdk/openai'
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customOpenAI = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE,
  apiKey: process.env.OPENAI_API_KEY
})

// export const customModel = wrapLanguageModel({
//   model: customOpenAI('gpt-4o', {
//     structuredOutputs: true
//   }),
//   middleware: customMiddleware
// })

export const customModel = () => {
  return wrapLanguageModel({
    model: openai('gpt-4o'),
    middleware: customMiddleware,
  });
};
