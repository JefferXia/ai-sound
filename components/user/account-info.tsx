'use client';

import React, { useEffect, useState } from 'react';
import { Crown, CalendarDays, Info } from 'lucide-react';
import { useGlobalContext } from '@/app/globalContext';
import { useRouter } from 'next/navigation';
import { getFirstLetterAndUpperCase } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AccountData } from '@/app/profile/account/page';
import Image from 'next/image';

export function AccountInfo({ accountInfo }: { accountInfo?: AccountData }) {
  const { userInfo } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {}, []);

  return (
    <div className="p-5 rounded-lg bg-muted">
      <div className="flex justify-between items-center">
        <div className="flex">
          <span className="flex items-center justify-center text-xl font-medium rounded-full w-12 h-12 mr-4 text-white bg-[linear-gradient(225deg,_rgb(255,_58,_212)_0%,_rgb(151,_107,_255)_33%,_rgb(67,_102,_255)_66%,_rgb(89,_187,_252)_100%)]">
            {getFirstLetterAndUpperCase(userInfo?.name)}
            {/* <Image
              src={userInfo.wechatAvatar}
              alt={userInfo.name}
              width={48}
              height={48}
              className="mr-4 rounded-full object-cover"
            /> */}
          </span>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{userInfo?.name}</h4>
            <div className="flex items-center pt-1">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-xs text-muted-foreground">
                Joined {accountInfo?.createdAt}
              </span>
            </div>
          </div>
        </div>
        <Button
          className="text-[#79402e] bg-[#F8da51] hover:bg-[#ffefd1] flex items-center justify-center"
          onClick={() => {
            router.push('/member/upgrade');
          }}
        >
          <Crown className="mr-1 h-4 w-4" />
          升级会员
        </Button>
      </div>
      <div className="flex items-center mt-5 pt-5 border-t border-tbborder text-sm">
        <span className="text-muted-foreground">账户余额：</span>
        <span className="text-4xl font-semibold mr-1">
          {accountInfo?.balance}
        </span>
        <span className="text-muted-foreground mr-2">积分</span>
        {/* <HoverCard>
          <HoverCardTrigger asChild>             
            <Info size={18} />
          </HoverCardTrigger>
          <HoverCardContent side="right" className="w-[150px]">
            <div className="text-sm space-y-2">
              <p>赠送积分：{accountInfo?.giftTokens}</p>
              <p>充值积分：{accountInfo?.rechargeTokens}</p>
              <p>赚取积分：{accountInfo?.earnedTokens}</p>
            </div>
          </HoverCardContent>
        </HoverCard>  */}
      </div>
    </div>
  );
}
