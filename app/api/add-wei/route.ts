import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { addPoint } from '@/lib/db'
import { getUserByPhone } from '@/db/queries'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      phone,
      product_id,
      product_name,
      product_url,
      image_caption,
      report,
    } = body || {}

    console.log('body', body)

    if (!phone) {
      return NextResponse.json({ error: '缺少参数: phone' }, { status: 400 })
    }
    if (!product_id) {
      return NextResponse.json({ error: '缺少参数: product_id' }, { status: 400 })
    }

    const user = await getUserByPhone(String(phone))
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 先检查是否已存在该 product_id 的记录（按“唯一”处理）
    const existing = await prisma.weiRecord.findFirst({
      where: { product_id: String(product_id) },
    })

    if (existing) {
      // 已存在则更新可选字段，并且不扣积分
      const updated = await prisma.weiRecord.update({
        where: { id: existing.id },
        data: {
          // 更新提供的字段，未提供则保持不变
          product_name: product_name ?? existing.product_name,
          product_url: product_url ?? existing.product_url,
          image_caption: image_caption ?? existing.image_caption,
          report: report ?? existing.report,
        },
      })

      return NextResponse.json({
        success: true,
        existing: true,
        data: updated,
        balance: user.balance, // 未扣分，返回当前余额
      })
    }

    // 不存在则创建并扣除 10 积分
    const created = await prisma.weiRecord.create({
      data: {
        phone: String(phone),
        product_id: String(product_id),
        product_name: product_name ? String(product_name) : undefined,
        product_url: product_url ? String(product_url) : undefined,
        image_caption: image_caption ? String(image_caption) : undefined,
        report: report ? String(report) : undefined,
      },
    })

    const transactionData = await addPoint(
      user.id,
      -10,
      'CONSUME',
      '消耗积分-检测违规'
    )

    return NextResponse.json({
      success: true,
      existing: false,
      data: created,
      balance: transactionData?.[0]?.balance,
    })
  } catch (error) {
    console.error('add-wei error:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
} 