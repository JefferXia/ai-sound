import { NextRequest } from 'next/server'

import { checkPoint } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.json()
  let { userId } = body

  const data = await checkPoint(userId)

  return Response.json({data})
}
