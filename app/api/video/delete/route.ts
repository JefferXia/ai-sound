import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/app/(auth)/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id
  const id = req.nextUrl.searchParams.get('id')

  // await prisma.video.deleteMany({
  //   where: { status: 'DELETED' },
  // })
  
  if (!userId || !id) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    )
  }
  
    // await prisma.video.delete({
    //   where: { id: vid },
    // })

  await prisma.video.update({
    where: { id: id },
    data: {
      status: 'DELETED'
    }
  })
  return Response.json({success: true})
}
