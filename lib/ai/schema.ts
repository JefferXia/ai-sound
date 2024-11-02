import {z, ZodSchema} from 'zod'

export const GetAudioWorkScriptSchema = (audioWorkStyle: AudioWorkStyle): ZodSchema => {
  switch (audioWorkStyle) {
    case 'DIALOGUE':
      return z.object({
        conversation: z.array(
          z.object({
            role: z.enum(['host', 'guest']),
            content: z.string()
          })
        )
      })
    case 'SOLO':
      return  z.object({
        conversation: z.array(
          z.object({
            role: z.enum(['speaker']),
            content: z.string()
          })
        )
      })
    default:
      throw new Error('Unsupported audio work style')
  }
}
