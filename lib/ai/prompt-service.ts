import promptLayerClient from '@/lib/prompt-layer'

// content style -> promptId
export const PromptTemplateDict: Map<AudioWorkStyle, string> = new Map<AudioWorkStyle, string>([
  ['DIALOGUE', 'interview'],
  ['SOLO', 'standup-comedy']
])

export const VoiceDict: { [key: string]: string } = {
  xuzhisheng: '31a676bf-9798-4acb-839a-5a93f247b3b3',
  leijun: '0af76f8a-cfae-4aff-aa9a-4d98234c1cb6',
  fushouer: '6e0dbe70-841c-450a-bfbd-77308b4e0d31',
  muyushuixin: 'a45eeda0-a113-45ca-b52d-f250debe00b5',
  naxida: '5088f41c-3ede-46d7-891d-a75970c17eac'
}

export const PromptService = {
  GetPromptTemplate: async (
    id: string,
    options: any = {}
  ): Promise<string | undefined> => {
    const template_dict = await promptLayerClient.templates.get(id, {
      ...options,
      provider: 'openai'
    })

    if (!template_dict) return
    let prompt =
      (template_dict.prompt_template as any)?.llm_kwargs?.messages?.[0]
        ?.content ??
      (template_dict.prompt_template as any)?.messages[0].content?.[0]?.text
    for (const key in options.input_variables) {
      const keyTemplate = `\{${key}\}`

      if (prompt.includes(keyTemplate)) {
        prompt = prompt.replace(
          new RegExp(keyTemplate, 'g'),
          options.input_variables[key]
        )
      }
    }

    return prompt
  }
}
