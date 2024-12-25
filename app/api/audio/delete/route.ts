import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/app/(auth)/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  const id = req.nextUrl.searchParams.get('id')
  
  if (!userId || !id) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    )
  }

  await prisma.createTask.update({
    where: { id: id },
    data: {
      is_deleted: true
    }
  })
  return Response.json({success: true})
}
