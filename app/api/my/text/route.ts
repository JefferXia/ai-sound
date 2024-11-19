import { NextRequest } from 'next/server'

import prisma from '@/lib/prisma'
import { utcToBeijing } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const body: GetAudioWorkFeedReq = await req.json()
  let { userId, limit=10, offset } = body

  const textTasks = await prisma.createTask.findMany({
    where: {
      user_id: userId,
      content_type: 'TEXT'
    },
    orderBy: {
      created_at: 'desc'
    },
    take: limit,
    skip: offset
  })
  console.log(textTasks)

  // 格式化输出
  const formattedData = textTasks.map(task => ({
    id: task.id,
    content: task.content,
    taskInfo: task.task_info,
    createdAt: utcToBeijing(task.created_at),
  }));

  return Response.json({data: formattedData})
}
