'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Crown } from 'lucide-react';
import { useGlobalContext } from '@/app/globalContext'

interface Item {
  type: string;
  amount: string | number;
  createdAt: string;
}
type ListProps = {
  list?: Item[];
};

export function AccountList({ list }: ListProps) {
  // const [list, setList] = useState([])
  const { userInfo } = useGlobalContext()
  const typeMap:any = {
    WELCOME_GIFT: '注册赠送积分',
    VIDEO_ANALYSIS: '消耗积分-拆解视频',
    TEXT: '消耗积分-文案创作',
    AUDIO: '消耗积分-音频创作',
    VIDEO: '消耗积分-视频创作',
    WECHAT: '充值积分-微信',
    ALIPAY: '充值积分-支付宝'
  }

  useEffect(() => {}, []);

  return (
    <div className="mt-7">
      <h2 className='mb-3 text-xl font-bold'>积分收支明细</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>类型</TableHead>
            <TableHead>积分变动数量</TableHead>
            <TableHead className="text-left">时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{typeMap[item.type] || '其他类型'}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
