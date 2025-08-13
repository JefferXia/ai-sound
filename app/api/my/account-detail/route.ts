import { NextRequest } from 'next/server'

import { pointDetails } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.json()
  let { userId } = body

  const data = await pointDetails(userId)

  return Response.json({data})
}
