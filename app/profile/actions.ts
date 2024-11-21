'use server'

import prisma from '@/lib/prisma'
import { accountDetails } from "@/lib/db"

export async function getAccountInfo(userId: string) {
  return await accountDetails(userId)
}
