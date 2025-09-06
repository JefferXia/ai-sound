import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import prisma from '@/lib/prisma';
import { isProductDetailUrl, extractProductId } from '@/lib/utils';
import { addPoint, checkPoint } from '@/lib/db';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { product_url } = body;

    // 验证输入参数
    if (!product_url || typeof product_url !== 'string') {
      return NextResponse.json(
        { success: false, error: '请输入有效的商品详情页地址' },
        { status: 400 }
      );
    }

    // 验证URL格式和平台支持
    if (!isProductDetailUrl(product_url)) {
      return NextResponse.json(
        { success: false, error: '暂不支持该平台的商品检测，请使用淘宝、天猫、京东、抖音的商品链接' },
        { status: 400 }
      );
    }

    // 从URL中提取商品ID
    const productId = extractProductId(product_url);

    if (!productId) {
      return NextResponse.json(
        { success: false, error: '无法从URL中提取商品ID，请确认输入的是有效的商品详情页地址' },
        { status: 400 }
      );
    }

    // 检查用户是否已有该商品的检测记录
    const existingRecord = await prisma.weiRecord.findFirst({
      where: {
        user_id: session.user.id,
        product_id: productId,
        is_deleted: false,
      },
    })

    // 获取用户当前余额
    const currentBalance = await checkPoint(session.user.id);

    if (existingRecord) {
      return NextResponse.json({
        success: true,
        message: '该商品已提交过检测',
        data: {
          id: existingRecord.id,
          status: existingRecord.status,
          created_at: existingRecord.created_at,
        },
        balance: currentBalance, // 返回当前余额
      })
    }

    // 检查用户余额是否足够（检测费用为100积分）
    const requiredPoints = 100;
    if (currentBalance < requiredPoints) {
      return NextResponse.json({
        success: false,
        error: `余额不足，检测需要 ${requiredPoints} 积分，当前余额：${currentBalance}`,
        balance: currentBalance,
      }, { status: 400 });
    }

    // 创建新的检测记录
    const newRecord = await prisma.weiRecord.create({
      data: {
        user_id: session.user.id,
        product_id: productId,
        product_url: product_url,
        product_name: '待检测商品',
        status: 'PENDING',
      },
    })

    // 扣除积分
    const transactionData = await addPoint(
      session.user.id,
      -1*requiredPoints,
      'CONSUME',
      '消耗积分-商品违规检测'
    );

    return NextResponse.json({
      success: true,
      message: '商品已成功提交检测',
      data: {
        id: newRecord.id,
        product_id: newRecord.product_id,
        status: newRecord.status,
        created_at: newRecord.created_at,
      },
      balance: transactionData?.[0]?.balance, // 返回扣费后的余额
    });

  } catch (error) {
    console.error('Product check API error:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}
