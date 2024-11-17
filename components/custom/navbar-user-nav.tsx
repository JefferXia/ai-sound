'use client';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserNav({ user }: { user: User }) {
  const { setTheme, theme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent h-10">
          <Image
            src={`https://avatar.vercel.sh/${user.email}`}
            alt={user.email ?? '用户'}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className='max-w-26 text-primary line-clamp-1'>{user?.name}</span>
          <ChevronDown className="ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem>
          <Link href="/profile">个人主页</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          切换主题色
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            className="w-full "
            onClick={() => {
              signOut({
                redirectTo: '/',
              });
            }}
          >
            退出登录
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
