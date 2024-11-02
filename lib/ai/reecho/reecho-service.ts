import {
  AsyncGenerateTTSReq,
  AsyncGenerateTTSResp
} from '@/lib/ai/reecho/async-generate-tts'
import { ReechoResp, ReechoSuccess } from '@/lib/ai/reecho/common'
import { GetTTSStatusResp } from '@/lib/ai/reecho/get-tts-status'

export interface ReechoService {
  AsyncGenerateTTS(request: AsyncGenerateTTSReq): Promise<AsyncGenerateTTSResp>

  GetTTSStatus(taskId: string): Promise<GetTTSStatusResp>
}

export const ReechoServiceImpl: ReechoService = {
  AsyncGenerateTTS: async (request: AsyncGenerateTTSReq) => {
    const response = await fetch('https://v1.reecho.cn/api/tts/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REECHO_API_KEY}`
      },
      body: JSON.stringify(request)
    })

    const resp: ReechoResp = await response.json()
    console.log(
      `ReechoServiceImpl.AsyncGenerateTTS req: ${JSON.stringify(request)}, resp: ${JSON.stringify(resp)}`
    )
    if (ReechoSuccess(resp.status)) {
      return resp.data as AsyncGenerateTTSResp
    } else {
      throw new Error(`Failed to generate TTS: ${resp.message}`)
    }
  },

  GetTTSStatus: async (taskId: string) => {
    const response = await fetch(
      `https://v1.reecho.cn/api/tts/generate/${taskId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REECHO_API_KEY}`
        }
      }
    )

    const resp: ReechoResp = await response.json()
    console.log(
      `ReechoServiceImpl.GetTTSStatus taskId: ${taskId}, resp: ${JSON.stringify(resp)}`
    )
    if (ReechoSuccess(resp.status)) {
      return resp.data as GetTTSStatusResp
    } else {
      throw new Error(`Failed to get TTS status: ${resp.message}`)
    }
  }
}
