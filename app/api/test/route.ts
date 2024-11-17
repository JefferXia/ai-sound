import { NextRequest } from 'next/server'

// import prisma from '@/lib/prisma'
// import { createAccount } from '@/lib/db'

export async function GET(req: NextRequest) {
  // const data = await createAccount('a3192a56-34a8-4c6c-9a5a-6aa6bb9bf132')
  // const data =  await prisma.user.findUnique({
  //   where: { id: 'a3192a56-34a8-4c6c-9a5a-6aa6bb9bf132' },
  // })
  return Response.json({success: true})
}
