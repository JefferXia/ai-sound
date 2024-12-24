import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
// 超时时间设置为60秒
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, url } = body
  
  if (!id || !url) {
    return NextResponse.json(
      { error: '请输入视频链接' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.DLP_API_URL}/api/frame`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          url,
        }),
      },
    );
    const res = await response.json();

    if(response.status !== 200) {
      return NextResponse.json({ error: res?.message || "出错了~ 请重试" }, { status: 500 });
    }          

    if(res?.data) {
      await prisma.video.update({
        where: {
          id
        },
        data: {
          scene: res.data,
        }
      })
    }

    return Response.json({
      scene: res?.data
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: "出错了~ 请重试" }, { status: 500 });
  }
}
