export const maxDuration = 60; // 设置为60秒
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { tecentAsr } from '@/lib/asr'
import { cosUploadBuffer } from "@/lib/cosUpload"
import { videoUrlToBuffer } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, url } = body;
  if (!userId || !url) {
    return NextResponse.json(
      { error: '请输入视频链接' },
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
      grade: true
    }
  });

  if (!accountData || accountData.balance < 10) {
    return NextResponse.json(
      { error: "余额不足" },
      { status: 402 }
    );
  }

  try {
    const res = await fetch(
      `http://45.55.255.120/api/hybrid/video_data?url=${url}`,
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
        title: existVideo.title,
        content: existVideo.content,
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

    const videoBuffer = await videoUrlToBuffer(metadata.video?.play_addr?.url_list[2])
    const fileName = `va/videos/${metadata.aweme_id}.mp4`
    let videoUrl;
    if(videoBuffer) {
      const cosUploadUrl = await cosUploadBuffer(videoBuffer, fileName)
      videoUrl = cosUploadUrl ? `https://${cosUploadUrl}` : metadata.video?.play_addr?.url_list[2]
      console.log('上传视频成功')
    }

    const ocrContent = metadata.seo_info?.ocr_content;
    const audioInfo = await tecentAsr(audioUrl);
    const videoScript = audioInfo ? audioInfo.result : ocrContent;
    const subtitles = (audioInfo && audioInfo.resultDetail) ? { asrData: audioInfo.resultDetail } : {};

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
            play_addr: metadata.video?.play_addr,
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
    });

    return Response.json({
      title: metadata.item_title,
      content: videoScript,
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: "出错了~ 请重试" }, { status: 500 });
  }
}
