import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  
  if(!id) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    )
  }

  try {
    const detail = await prisma.video.findUnique({
      where: {
        id
      }
    })
    if(!detail) {
      return NextResponse.json(
        { error: "没有找到视频" },
        { status: 404 }
      )
    }

    return Response.json({video: detail})
  } catch (err:any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
