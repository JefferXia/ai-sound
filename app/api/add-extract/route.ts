import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { addPoint } from '@/lib/db'
import { getUserById } from '@/db/queries'
import { auth } from '@/app/(auth)/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    const body = await req.json()
    const {
      user_id = userId,
      amount = 10,
      reason = '文案提取',
    } = body || {}

    if (!user_id) {
      return NextResponse.json({ error: '缺少参数: user_id' }, { status: 400 })
    }

    const user = await getUserById(user_id)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const transactionData = await addPoint(
      user.id,
      -1 * amount,
      'CONSUME',
      `消耗积分-${reason}`
    )

    return NextResponse.json({
      success: true,
      balance: transactionData?.[0]?.balance,
    })
  } catch (error) {
    console.error('add-extract error:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
} 