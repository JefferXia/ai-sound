import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { addPoint } from "@/lib/db"
import { auth } from '@/app/(auth)/auth'
// 超时时间设置为60秒
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { url } = body
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json(
      { error: '请先登录' },
      { status: 400 }
    );
  }
  
  if (!url) {
    return NextResponse.json(
      { error: '请输入视频链接' },
      { status: 400 }
    );
  }

  const accountData = await prisma.user.findUnique({
    where: { 
      id: userId,
    },
    select: {
      balance: true
    }
  })

  if (!accountData || accountData.balance < 10) {
    return NextResponse.json(
      { error: "余额不足" },
      { status: 402 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.DLP_API_URL}/api/video_crawler`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${process.env.DLP_API_KEY}`,
        },
        body: JSON.stringify({
          url,
        }),
      },
    );
    const data = await response.json();

    if(response.status !== 200) {
      return NextResponse.json({ error: data?.message || "出错了~ 请重试" }, { status: 500 });
    }          

    await prisma.video.create({
      data: {
        user_id: userId,
        ...data
      },
    })
    await addPoint(userId, -10, 'CONSUME', '消耗积分-分析视频')

    return Response.json({
      data
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: "出错了~ 请重试" }, { status: 500 });
  }
}
