import { NextRequest } from 'next/server'

import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  let { limit=10, offset } = body

  const list = await prisma.video.findMany({
    where: {
      user_id: '52d1d6e4-b8a2-4a02-9aae-dcb18d0ceb25',
      status: 'SUCCESS'
    },
    orderBy: {
      created_at: 'desc'
    },
    take: limit,
    skip: offset
  })

  // 格式化输出
  const formattedData = list.map(item => ({
    id: item.id,
    url: item.video_url,
    title: item.title,
    extractor: item.source,
    metadata: item.metadata,
  }));

  return Response.json({data: formattedData})
}
