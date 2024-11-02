import { NextRequest } from 'next/server'

import { VoiceDisplayConfig } from '@/lib/config'

export async function POST(req: NextRequest) {
  const resp: VoiceMapResp = {
    voiceMap: VoiceDisplayConfig
  }

  return Response.json(resp);
}
