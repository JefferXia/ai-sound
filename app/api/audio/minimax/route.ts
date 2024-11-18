import axios from "axios"
import { NextRequest, NextResponse } from 'next/server'
import { cosUploadBuffer } from "@/lib/cosUpload"

const GROUP_ID = '1837474834917900516'
const API_KEY =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJHb2RlbCIsIlVzZXJOYW1lIjoiR29kZWwiLCJBY2NvdW50IjoiIiwiU3ViamVjdElEIjoiMTgzNzQ3NDgzNDkyNjI4OTEyNCIsIlBob25lIjoiMTM3MzIyMjYyNTIiLCJHcm91cElEIjoiMTgzNzQ3NDgzNDkxNzkwMDUxNiIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6IiIsIkNyZWF0ZVRpbWUiOiIyMDI0LTA5LTI3IDExOjA4OjI3IiwiaXNzIjoibWluaW1heCJ9.mO_3UZPRbciyFqeEnIc7lq9gD5UGFZo3wzrXU7Xgu5DlkCxzZOyRAmstWrcA6rKGpXplbzYIzD4jpB2GIcEUCx0HqFmNM--jP-qhqNC3ZheDAeWaldmu7IMu0N5NqTqZBR_IWXAox3p2Mf6q2puP9as-AvAKktrPHTs3zFewOBtes0KVDsXXetw43XPt3Vx6iTbipiCyDbCGGPa85uVCDB7Nwc9qltVgBebMY4cMFZHzQBxt7zBPplqk-ZmGgYY_Ij5UFBaSoJgvhz3-YOjGGOA2isS07H8px0Ohx6NJvp7Q3Hg0gkK0zOlhZb_aPcYl_Chk10hb-qAdNU7ZKHXG5Q'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { text, voiceId } = body

  const payload = {
    model: "speech-01-turbo",
    text,
    stream: false,
    voice_setting: {
      voice_id: voiceId,
      speed: 1,
      vol: 1,
      pitch: 0
    },
    audio_setting: {
      sample_rate: 32000,
      bitrate: 128000,
      format: "mp3",
      channel: 1,
    },
  };

  const url = `https://api.minimax.chat/v1/t2a_v2?GroupId=${GROUP_ID}`;
  const headers = {
    authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, payload, { headers });
    if(response.status === 200) {
      const minimaxResponse = response.data
      // console.log(minimaxResponse)
      const timestamp = Date.now()
      const fileName = `topmind/audios/minimax_audio_${timestamp}.mp3`
      const audioUrl = await cosUploadBuffer(minimaxResponse.data.audio, fileName)

      const resp = {
        audioUrl: '//'+audioUrl || '',
      }
      return Response.json(resp)
    } else {
      throw new Error(`Minimax.t2a_v2: error: ${response.status}`)
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 })
  }
}
