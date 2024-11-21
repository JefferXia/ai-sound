'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Page = () => {
  const [billType, setBillType] = useState<string>('monthly')

  useEffect(() => {
    
  }, []);

  return (
    <div className="max-w-6xl px-4 py-8 pt-24 mx-auto sm:px-6 lg:px-8">
      <div className="sm:flex sm:flex-col sm:align-center">
        <h1 className="text-4xl font-extrabold sm:text-center sm:text-5xl">
          会员计划
        </h1>
        <p className="max-w-2xl m-auto mt-5 text-xl dark:text-zinc-200 sm:text-center sm:text-2xl">
          Topmind集成了最强大的AI功能，助你开启短视频AI创作之路，免费试用功能有限，添加会员计划能解锁更多其他功能。
        </p>
      </div>
      <div className='mt-12 flex justify-center'>
        <Tabs
          defaultValue="monthly"
          className="w-[400px]"
          onValueChange={setBillType}
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="monthly">按月购买</TabsTrigger>
            <TabsTrigger value="yearly">年度9折</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly"></TabsContent>
          <TabsContent value="yearly"></TabsContent>
        </Tabs>
      </div>


      <div className="mt-12 grid grid-cols-4 gap-6">
        <div
          className='flex flex-col rounded-xl shadow-sm bg-muted'
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold leading-6">
              免费试用
            </h2>
            <p className="mt-8">
              <span className="text-4xl font-extrabold tracking-tight">
                ￥0
              </span>
              <span className="ml-2 text-base font-medium text-zinc-400">
                /{billType==='monthly'?'月':'年'}
              </span>
            </p>
            <Button
              variant={'outline'}
              className="mt-8 w-full"
            >
              当前
            </Button>
            <p className="flex items-center mt-4 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />50积分注册奖励
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />AI生成文案、音频
            </p>
          </div>
        </div>
        <div
          className='flex flex-col rounded-xl shadow-sm bg-muted'
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold leading-6">
              基础版
            </h2>
            <p className="mt-8">
              <span className="text-4xl font-extrabold tracking-tight">
                ￥{billType==='monthly'?'39':'420'}
              </span>
              <span className="ml-2 text-base font-medium text-zinc-400">
                /{billType==='monthly'?'月':'年'}
              </span>
            </p>
            <Button
              className="mt-8 w-full"
            >
              订阅
            </Button>
            <p className="flex items-center mt-4 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />一次性发放500积分
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />AI生成文案、音频、视频
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />爆款二创功能
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />优先体验新功能
            </p>
          </div>
        </div>
        <div
          className='flex flex-col rounded-xl shadow-sm bg-muted'
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold leading-6">
              高级版
            </h2>
            <p className="mt-8">
              <span className="text-4xl font-extrabold tracking-tight">
                ￥{billType==='monthly'?'99':'1069'}
              </span>
              <span className="ml-2 text-base font-medium text-zinc-400">
                /{billType==='monthly'?'月':'年'}
              </span>
            </p>
            <Button
              className="mt-8 w-full"
            >
              订阅
            </Button>
            <p className="flex items-center mt-4 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />一次性发放1500积分
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />AI生成文案、音频、视频
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />爆款二创功能
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />快速生成通道
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />优先体验新功能
            </p>
          </div>
        </div>
        <div
          className='flex flex-col rounded-xl shadow-sm bg-muted'
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold leading-6">
              企业版
            </h2>
            <p className="mt-8">
              <span className="text-4xl font-extrabold tracking-tight">
                ￥{billType==='monthly'?'999':'10789'}
              </span>
              <span className="ml-2 text-base font-medium text-zinc-400">
                /{billType==='monthly'?'月':'年'}
              </span>
            </p>
            <Button
              className="mt-8 w-full"
            >
              订阅
            </Button>
            <p className="flex items-center mt-4 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />一次性发放20000积分
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />AI生成文案、音频、视频
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />爆款二创功能
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />开放AI导演功能
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />提供专属技术支持
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />快速生成通道
            </p>
            <p className="flex items-center mt-2 text-zinc-400">
              <Check size={18} className='text-green-500 mr-2' />优先体验新功能
            </p>
          </div>
        </div>


      </div>
    </div>
  )
};

export default Page;
