import axios from "axios"
import { NextRequest, NextResponse } from "next/server"
import { cosUploadBuffer } from "@/lib/cosUpload"
import { auth } from '@/app/(auth)/auth'
import prisma from '@/lib/prisma'
import { TaskStatus } from '@prisma/client'
import { videoUrlToBuffer } from '@/lib/utils'

const API_KEY = process.env.MINIMAX_API_KEY
const API_BASE_URL = "https://api.minimax.chat/v1"

const queryVideoGeneration = async (taskId: string) => {
  const url = `${API_BASE_URL}/query/video_generation?task_id=${taskId}`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const { status, file_id: fileId } = response.data;
    switch (status) {
      case "Queueing":
        console.log("...队列中...");
        return { fileId: "", status: "Queueing" };
      case "Processing":
        console.log("...生成中...");
        return { fileId: "", status: "Processing" };
      case "Success":
        console.log("...生成完成...");
        return { fileId, status: "Finished" };
      case "Fail":
        console.error("生成失败");
        return { fileId: "", status: "Fail" };
      default:
        console.error("未知状态");
        return { fileId: "", status: "Unknown" };
    }
  } catch (error: any) {
    console.error(
      "查询任务状态时出错：",
      error.response?.data || error.message
    );
    throw new Error("Failed to query video generation");
  }
}

const fetchVideoResult = async (fileId: string) => {
  console.log("---------------视频生成成功，下载中---------------")
  const url = `${API_BASE_URL}/files/retrieve?file_id=${fileId}`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const downloadUrl = response.data.file.download_url
    console.log("视频下载链接：" + downloadUrl)

    const videoBuffer = await videoUrlToBuffer(downloadUrl)
    if(videoBuffer) {
      const timestamp = Date.now()
      const fileName = `tm/videos/minimax_video_${timestamp}.mp4`
      const cosUploadUrl = await cosUploadBuffer(videoBuffer, fileName)
      return 'https://'+cosUploadUrl
    }
  } catch (error: any) {
    console.error("下载文件时出错：", error.response?.data || error.message);
    throw new Error("Failed to fetch video result");
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, taskId } = body
  const session = await auth()
  const userId = session?.user?.id

  if (!userId || !taskId || !id) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try { 
    const { fileId, status } = await queryVideoGeneration(taskId)

    if (fileId) {
      const downloadUrl = await fetchVideoResult(fileId)

      await prisma.createTask.update({
        where: { id },
        data: {
          content: downloadUrl,
          status: TaskStatus.SUCCESS,
        }
      })

      return Response.json({ downloadUrl })
    } else if (status === "Fail" || status === "Unknown") {
      return NextResponse.json(
        { error: "Video generation failed" },
        { status: 500 }
      )
    }
    return Response.json({ downloadUrl: '' })
  } catch (error: any) {
    console.error(error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
