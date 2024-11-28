"server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import prisma from '@/lib/prisma'

export async function getUser(email: string) {
  try {
    // return await db.select().from(user).where(eq(user.email, email));
    return await prisma.user.findUnique({
      where: { email },
    })
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);
  const name = email.split('@')[0];

  try {
    // return await db.insert(user).values({ email, password: hash });
    return await prisma.user.create({
      data: {
        email,
        name,
        password: hash,
        balance: 50, // 创建账户时设置总余额
        point: {
          create: {
            amount: 50,
            type: 'SYSTEM',
            reason: '首次注册送新人礼50积分'
          }
        }
      },
    });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}
