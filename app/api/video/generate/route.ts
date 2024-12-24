export const maxDuration = 60
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"
import { auth } from '@/app/(auth)/auth'
import prisma from '@/lib/prisma'
import { ContentType, FileFormat, TaskStatus } from '@prisma/client'
import { addPoint } from "@/lib/db"

const API_KEY = process.env.MINIMAX_API_KEY
const API_BASE_URL = "https://api.minimax.chat/v1"

const invokeVideoGeneration = async (prompt: string, model: string) => {
  console.log("-----------------提交视频生成任务-----------------")
  const url = `${API_BASE_URL}/video_generation`

  try {
    const response = await axios.post(
      url,
      { prompt, model },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const taskId = response?.data?.task_id;
    console.log("视频生成任务提交成功，任务ID：" + taskId);
    return taskId;
  } catch (error: any) {
    console.error("提交任务时出错：", error.response?.data || error.message);
    throw new Error("Failed to invoke video generation");
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { prompt, model } = body
  const session = await auth()
  const userId = session?.user?.id

  if (!userId || !prompt || !model) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const accountData = await prisma.user.findUnique({
    where: { 
      id: userId,
    },
    select: {
      balance: true,
    }
  });

  if (accountData && accountData.balance < 60) {
    return NextResponse.json(
      { error: "余额不足" },
      { status: 403 }
    );
  }

  try {
    const taskId = await invokeVideoGeneration(prompt, model);
    if(taskId) {
      const newTask = await prisma.createTask.create({
        data: {
          user_id: userId,
          content_type: ContentType.VIDEO,
          file_format: FileFormat.MP4,
          content: taskId,
          status: TaskStatus.PROCESSING,
          task_info: {
            model: `minimax ${model}`,
            parameters: {
              script: prompt
            }
          }
        }
      })
      await addPoint(userId, -60, 'CONSUME', '消耗积分-生成视频')
      return Response.json({ id: newTask.id, taskId })
    } else {
      return NextResponse.json(
        { error: "Video generation failed" },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
