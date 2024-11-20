export const maxDuration = 60;

import axios from "axios"
import { NextRequest, NextResponse } from 'next/server'
import { cosUploadBuffer } from "@/lib/cosUpload"
import prisma from '@/lib/prisma'
import { ContentType, FileFormat, TaskStatus } from '@prisma/client'
import { createTransaction } from "@/lib/db"

const GROUP_ID = process.env.MINIMAX_GROUP_ID
const API_KEY = process.env.MINIMAX_API_KEY

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, text, voiceId } = body

  if (!userId || !text || !voiceId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
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

  if (!accountData || accountData.balance < 8) {
    return NextResponse.json(
      { error: "余额不足" },
      { status: 403 }
    );
  }

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
      const fileName = `tm/audios/minimax_audio_${timestamp}.mp3`
      const audioUrl = await cosUploadBuffer(Buffer.from(minimaxResponse.data.audio, 'hex'), fileName)

      const resp = {
        audioUrl: 'https://'+audioUrl || '',
      }
      try {
        await prisma.createTask.create({
          data: {
            user_id: userId,
            content_type: ContentType.AUDIO,
            file_format: FileFormat.MP3,
            content: resp.audioUrl,
            status: TaskStatus.SUCCESS,
            task_info: {
              model: 'minimax speech-01-turbo',
              parameters: {
                script: text,
                voice_id: voiceId
              }
            }
          }
        });
        const transactionData = await createTransaction(accountData.id, ContentType.AUDIO)

        return Response.json(transactionData ? {
          ...resp,
          balance: transactionData[1]?.balance
        } : resp)
      } catch (error) {
        console.error('Error saving content work to database:', error);
        return NextResponse.json({ error: 'Error saving task to database' }, { status: 500 })
      }
    } else {
      throw new Error(`Minimax.t2a_v2: error: ${response.status}`)
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate audio'+JSON.stringify(error) }, { status: 500 })
  }
}
