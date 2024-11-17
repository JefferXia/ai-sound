'use server'

import prisma from '@/lib/prisma'
import { utcToBeijing } from './utils'

interface Record {
  type: string
  amount: string | number
  createdAt: Date
}
type ValueType = {
  [key: string]: number; // 定义对象的键为字符串，值为数字
};

export async function createAccount(uid: string) {
  
    // 建立初始账户
    const account = await prisma.account.create({
      data: {
        user_id: uid,
        balance: 50,
        gift_tokens: 50,
        gifts: {
          create: {
            amount: 50,
            type: 'WELCOME_GIFT'
          }
        }
      }
    })

    return account
}

// 添加充值记录
export async function createRecharge(accountId: string, amount: number) {
  const rechargeTransaction = await prisma.$transaction([
    // 1. 创建充值记录
    prisma.rechargeRecord.create({
      data: {
        account_id: accountId,
        amount,
        order_number: 'ORD123456', // 生成或传入唯一订单号
        source: 'WECHAT',         // 充值来源，如：支付宝、微信等
        status: 'COMPLETED',      // 充值状态：成功
      },
    }),
    // 2. 更新账户余额和充值代币
    prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amount, // 增加总余额
        },
        recharge_tokens: {
          increment: amount, // 增加充值代币余额
        },
      },
    }),
  ]);

  console.log('Recharge record created:', rechargeTransaction);
}

// 添加交易记录
export async function createTransaction(accountId: string, type: string) {
  const getValueByType: ValueType = {
    'VIDEO_ANALYSIS': 10
  }
  const accountData = await prisma.account.findUnique({
    where: { id: accountId },
    select: {
      balance: true,
      gift_tokens: true,
      recharge_tokens: true,
    }
  });
  if(!accountData || accountData.balance < getValueByType[type]) {
    return false
  }
  // 优先扣除 giftTokens
  let updateData;
  if (accountData.gift_tokens >= getValueByType[type]) {
    updateData = {
      balance: {
        decrement: getValueByType[type],
      },
      gift_tokens: {
        decrement: getValueByType[type],
      },
    }
  } else {
    updateData = {
      balance: {
        decrement: getValueByType[type],
      },
      recharge_tokens: {
        decrement: getValueByType[type],
      },
    }
  }

  const transaction = await prisma.$transaction([
    prisma.transactionRecord.create({
      data: {
        account_id: accountId,
        price: getValueByType[type],
        type,
      },
    }),
    prisma.account.update({
      where: { id: accountId },
      data: updateData,
    }),
  ]);

  return transaction

  console.log('Transaction record created:', transaction);
}

export async function accountDetails(userId: string) {
  // 查询账户及其关联的收支记录
  const accountWithDetails = await prisma.account.findFirst({
    where: {
      user_id: userId,
    },
    include: {
      gifts: true,            // 包含 GiftRecord 赠送记录
      recharges: true,        // 包含 RechargeRecord 充值记录
      transactions: true,     // 包含 TransactionRecord 消费记录
    },
  });

  // 确保账户存在
  if (!accountWithDetails) {
    throw new Error('Account not found for this user');
  }

  // 合并 GiftRecord、TransactionRecord 和 RechargeRecord
  const combinedRecords = [
    ...accountWithDetails.gifts.map(record => ({
      type: record.type,                 // 赠送记录的类型
      amount: `+${record.amount}`,        // 积分变动（正数）
      createdAt: record.created_at,        // 记录的时间
    })),
    ...accountWithDetails.transactions.map(record => ({
      type: record.type,                  // 消费记录的类型
      amount: `-${record.price}`,              // 积分变动（负数）
      createdAt: record.created_at,        // 记录的时间
    })),
    ...accountWithDetails.recharges
      .filter(record => record.status === 'COMPLETED') // 只包含已完成的充值
      .map(record => ({
        type: record.source,              // 充值记录的类型
        amount: `+${record.amount}`,       // 积分变动（正数）
        createdAt: record.created_at,       // 记录的时间
      })),
  ];

  // 按照时间进行排序
  const sortedRecords = combinedRecords.sort((a: Record, b: Record) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  // 格式化输出
  const formattedRecords = sortedRecords.map(record => ({
    type: record.type,
    amount: record.amount,
    createdAt: utcToBeijing(record.createdAt),
  }));

  return {
    info: {
      balance: accountWithDetails.balance,
      giftTokens: accountWithDetails.gift_tokens,
      rechargeTokens: accountWithDetails.recharge_tokens,
      earnedTokens: accountWithDetails.earned_tokens,
      createdAt: utcToBeijing(accountWithDetails.created_at)
    },
    records: formattedRecords
  }
}