import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import prisma from '@/lib/prisma';
import { utcToBeijing } from '@/lib/utils';
import { getUserById } from '@/db/queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { userId, limit = 100, offset = 0 } = body;

    // 获取用户的检测记录
    const records = await prisma.weiRecord.findMany({
      where: {
        user_id: userId,
        is_deleted: false,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // 格式化输出
    const formattedData = records.map(record => ({
      id: record.id.toString(),
      product_name: record.product_name || '未知商品',
      product_url: record.product_url || '',
      image_caption: record.image_caption || '',
      report: record.report || '',
      createdAt: utcToBeijing(record.created_at),
      status: record.status,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      total: formattedData.length,
    });

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 检查用户登录状态
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          success: false,
          error: '请先登录后再使用此功能',
          authenticated: false 
        },
        { status: 401 }
      );
    }

    // 使用 getUserById 获取用户信息，包括 grade
    const userInfo = await getUserById(session.user.id);
    if (!userInfo) {
      return NextResponse.json(
        { 
          success: false,
          error: '用户信息不存在',
          authenticated: false 
        },
        { status: 404 }
      );
    }

    // 从URL参数获取分页参数
    // const { searchParams } = new URL(request.url);
    // const limit = parseInt(searchParams.get('limit') || '100');
    // const offset = parseInt(searchParams.get('offset') || '0');

    // 获取用户的检测记录
    const records = await prisma.weiRecord.findMany({
      where: {
        user_id: session.user.id,
        is_deleted: false,
      },
      orderBy: {
        created_at: 'desc',
      },
      // take: limit,
      // skip: offset,
    });

    // 格式化输出
    const formattedData = records.map(record => ({
      id: record.id.toString(),
      product_name: record.product_name || '未知商品',
      product_url: record.product_url || '',
      image_caption: record.image_caption || '',
      report: record.report || '',
      createdAt: utcToBeijing(record.created_at),
      status: record.status,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      total: formattedData.length,
      userGrade: userInfo.grade,
    });

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// 处理OPTIONS预检请求
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
