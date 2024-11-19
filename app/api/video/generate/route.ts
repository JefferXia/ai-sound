import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cosUploadBuffer } from "@/lib/cosUpload"
import prisma from '@/lib/prisma'
import { ContentType, FileFormat, TaskStatus } from '@prisma/client'
import { createTransaction } from "@/lib/db"

const API_KEY = process.env.MINIMAX_API_KEY;
const API_BASE_URL = "https://api.minimax.chat/v1";

const invokeVideoGeneration = async (prompt: string, model: string) => {
  console.log("-----------------提交视频生成任务-----------------");
  const url = `${API_BASE_URL}/video_generation`;

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
    const taskId = response.data.task_id;
    console.log("视频生成任务提交成功，任务ID：" + taskId);
    return taskId;
  } catch (error: any) {
    console.error("提交任务时出错：", error.response?.data || error.message);
    throw new Error("Failed to invoke video generation");
  }
};

const queryVideoGeneration = async (taskId: string) => {
  const url = `${API_BASE_URL}/query/video_generation?task_id=${taskId}`;

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
};

const videoUrlToBuffer = async (videoUrl: string) => {
  try {
    const response = await axios.get(videoUrl, {
      responseType: "arraybuffer", // 确保响应是二进制数据
    });

    const buffer = Buffer.from(response.data, "binary");
    return buffer;
  } catch (error: any) {
    console.error("Error downloading video:", error.message);
    throw new Error("Failed to convert video URL to buffer");
  }
}

const fetchVideoResult = async (fileId: string) => {
  console.log("---------------视频生成成功，下载中---------------");
  const url = `${API_BASE_URL}/files/retrieve?file_id=${fileId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const downloadUrl = response.data.file.download_url;
    console.log("视频下载链接：" + downloadUrl);
    const videoBuffer = await videoUrlToBuffer(downloadUrl);
    const timestamp = Date.now()
    const fileName = `tm/videos/minimax_video_${timestamp}.mp4`
    const cosUploadUrl = await cosUploadBuffer(videoBuffer, fileName)
    return 'https://'+cosUploadUrl;
  } catch (error: any) {
    console.error("下载文件时出错：", error.response?.data || error.message);
    throw new Error("Failed to fetch video result");
  }
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, prompt, model } = body;

  if (!prompt || !model) {
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

  if (!accountData || accountData.balance < 60) {
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
          status: TaskStatus.SUCCESS,
          task_info: {
            model: `minimax ${model}`,
            parameters: {
              script: prompt
            }
          }
        }
      });
      const transactionData = await createTransaction(accountData.id, ContentType.VIDEO)
    } else {
      return NextResponse.json(
        { error: "Video generation failed" },
        { status: 500 }
      );
    }

    while (true) {
      // 等待 30 秒后轮询
      await new Promise((resolve) => setTimeout(resolve, 30000));

      const { fileId, status } = await queryVideoGeneration(taskId);

      if (fileId) {
        const downloadUrl = await fetchVideoResult(fileId);    
        return Response.json({ downloadUrl })
      } else if (status === "Fail" || status === "Unknown") {
        return NextResponse.json(
          { error: "Video generation failed" },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
