import { NextRequest } from 'next/server'

import prisma from '@/lib/prisma'
import { utcToBeijing } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const body = await req.json()
  let { phone, limit=100, offset=0 } = body

  const records = await prisma.weiRecord.findMany({
    where: {
      phone,
      is_deleted: false
    },
    orderBy: {
      created_at: 'desc'
    },
    take: limit,
    skip: offset
  })

  // 格式化输出
  const formattedData = records.map(record => ({
    id: record.id,
    product_name: record.product_name,
    product_url: record.product_url,
    image_caption: record.image_caption,
    report: record.report,
    createdAt: utcToBeijing(record.created_at),
  }));

  return Response.json({data: formattedData})
}
