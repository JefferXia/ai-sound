'use client'

import { Link } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <div 
      id="space"
      className='min-h-svh'
    >
      <div id='stars'></div>
      <div id='stars2'></div>
      <div id='stars3'></div>
      <div className="w-full h-svh flex flex-col justify-center items-center">
        <h2 id="typing">
          <span>AI创作无界 尽在天马行空</span>
        </h2>
        <div className='w-[500px] mt-5 flex items-center gap-1 p-1 pl-5 border-2 rounded-full border-[#38495a]'>
          <Link />
          <Input className='border-none outline-0 bg-transparent ring-0 focus-visible:ring-offset-0 focus-visible:outline-0 focus-visible:ring-0' />
          <Button 
            className='great-btn rounded-full' 
            onClick={() => {
              router.push('/create/text')
            }}
          >
            分析链接
          </Button>
        </div>
      </div>
    </div>
  );
}
