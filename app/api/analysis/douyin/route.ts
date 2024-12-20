import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import prisma from '@/lib/prisma'
import { tecentAsr } from '@/lib/asr'
import { cosUploadBuffer } from "@/lib/cosUpload"
import { videoUrlToBuffer } from '@/lib/utils'
import { addPoint } from "@/lib/db"
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
    const res = await fetch(
      `https://douyin-download-api-7wpc.onrender.com/api/hybrid/video_data?url=${url}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const dyData = await res.json();
    // console.log(dyData);
    if (dyData?.code !== 200) {
      return NextResponse.json(
        { error: '没找到任何视频信息' },
        { status: 404 }
      );
    }
    const metadata = dyData.data;

    const existVideo = await prisma.video.findFirst({
      where: { 
        video_id: metadata.aweme_id,
      }
    })

    if(existVideo) {
      return Response.json({
        data: {
          title: existVideo.title,
          content: existVideo.content,
        }
      })
    }

    // if (accountData.grade === 'REGULAR' && metadata.duration > 300000) {
    if (metadata.duration > 300000) {
      return NextResponse.json(
        { error: '普通会员视频长度最大5分钟' },
        { status: 403 }
      );
    }
    const audioUrl = metadata.music?.play_url?.uri
    if (!audioUrl) {
      return NextResponse.json(
        { error: '没有提取到视频文案，请换一个有台词的试试' },
        { status: 404 }
      );
    }
    console.log('开始下载')
    let videoUrl = ``
    const urlLength = metadata.video?.download_addr?.url_list.length
    let downloadUrl = metadata.video?.download_addr?.url_list[urlLength - 1]
    downloadUrl = downloadUrl?.replace(/watermark=1/, 'watermark=0') || ''
    // let downloadUrl = `https://douyin-download-api-7wpc.onrender.com/api/download?prefix=false&with_watermark=false&url=${url}`
    const videoBuffer = await videoUrlToBuffer(downloadUrl)
    const fileName = `va/videos/${metadata.aweme_id}.mp4`
    if(videoBuffer) {
      const cosUploadUrl = await cosUploadBuffer(videoBuffer, fileName)
      if(cosUploadUrl) {
        videoUrl = `https://${cosUploadUrl}`
        console.log('上传视频成功')
      }
    }
    const asrStart = Date.now()
    const ocrContent = metadata.seo_info?.ocr_content;
    const audioInfo = await tecentAsr(audioUrl);
    const videoScript = audioInfo ? audioInfo.result : ocrContent;
    const subtitles = (audioInfo && audioInfo.resultDetail) ? audioInfo.resultDetail : null;
    const asrEnd = Date.now()
    console.log('asr时间', Math.round((asrEnd-asrStart)/1000))

    await prisma.video.create({
      data: {
        user_id: userId,
        video_id: metadata.aweme_id,
        video_url: videoUrl,
        audio_url: audioUrl,
        title: metadata.item_title,
        content: videoScript,
        status: 'SUCCESS',
        source: 'DOUYIN',
        metadata: {
          video: {
            cover: metadata.video?.cover?.url_list[0],
            duration: metadata.video?.duration,
            format: metadata.video?.format,
            download_addr: metadata.video?.download_addr
          },
          author: {
            nickname: metadata.author?.nickname,
            avatar_thumb: metadata.author?.avatar_thumb?.url_list[0],
            author_url: `https://www.douyin.com/user/${metadata.author?.sec_uid}`,
            follower_count: metadata.author?.follower_count,
            age: metadata.author?.user_age,
            custom_verify: metadata.author?.custom_verify
          },
          stat: metadata.statistics,
        },
        subtitles
      },
    })
    const transactionData = await addPoint(userId, -10, 'CONSUME', '消耗积分-分析视频')

    return Response.json({
      data: {
        title: metadata.item_title,
        content: videoScript,
      }
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: "出错了~ 请重试" }, { status: 500 });
  }
}
