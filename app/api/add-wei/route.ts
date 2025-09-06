import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { addPoint } from '@/lib/db'
import { getUserById } from '@/db/queries'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      user_id,
      phone,
      product_id,
      product_name,
      product_url,
      image_caption,
      report,
    } = body || {}

    console.log('body', body)

    // 处理 product_name 长度，超过255则截断
    let processedProductName = product_name
    if (product_name && product_name.length > 255) {
      processedProductName = product_url
    }

    if (!user_id) {
      return NextResponse.json({ error: '缺少参数: user_id' }, { status: 400 })
    }
    if (!product_id) {
      return NextResponse.json({ error: '缺少参数: product_id' }, { status: 400 })
    }

    const user = await getUserById(user_id)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 先检查是否已存在该用户和product_id的记录
    const existing = await prisma.weiRecord.findFirst({
      where: { 
        user_id: user.id,
        product_id: String(product_id)
      },
    })

    if (existing) {
      // 已存在则更新可选字段，并且不扣积分
      const updated = await prisma.weiRecord.update({
        where: { id: existing.id },
        data: {
          // 更新提供的字段，未提供则保持不变
          product_name: processedProductName ?? existing.product_name,
          product_url: product_url ?? existing.product_url,
          image_caption: image_caption ?? existing.image_caption,
          report: report ?? existing.report,
          status: report ? 'SUCCESS' : existing.status,
        },
      })

      // 如果report不为空，则更新所有相同product_id且status为PENDING的记录
      if (report) {
        await prisma.weiRecord.updateMany({
          where: {
            product_id: String(product_id),
            status: 'PENDING',
            id: { not: existing.id }, // 排除当前更新的记录
          },
          data: {
            product_name: processedProductName ?? existing.product_name,
            report: String(report),
            status: 'SUCCESS',
          },
        })
      }

      return NextResponse.json({
        success: true,
        existing: true,
        data: updated,
        balance: user.balance, // 未扣分，返回当前余额
      })
    }

    // 不存在则创建并扣除 100 积分
    const created = await prisma.weiRecord.create({
      data: {
        user_id: user.id,
        phone: String(phone),
        product_id: String(product_id),
        product_name: processedProductName ? String(processedProductName) : undefined,
        product_url: product_url ? String(product_url) : undefined,
        image_caption: image_caption ? String(image_caption) : undefined,
        report: report ? String(report) : undefined,
        status: report ? 'SUCCESS' : 'PROCESSING',
      },
    })

    const transactionData = await addPoint(
      user.id,
      -100,
      'CONSUME',
      '消耗积分-商品违规检测'
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