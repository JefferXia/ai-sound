'use client';

import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { type User } from 'next-auth'
import React, { useEffect, useState } from 'react'
import { UserNav } from '@/components/custom/navbar-user-nav'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BetterTooltip } from '@/components/ui/tooltip'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export function Navbar({ user }: { user: User | undefined }) {

  return (
    <div className="fixed left-0 top-0 z-20 w-full h-16 px-7 flex items-center justify-between bg-sidebar backdrop-blur-md">
      <div className='flex items-center space-x-5'>
        <Link href="/">
          <span className="text-lg font-semibold font-mono tracking-tighter">
            Topmind
          </span>
        </Link>
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>开始创作</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                {/* <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col rounded-md bg-gradient-to-b no-underline outline-none focus:shadow-md overflow-hidden"
                      href="/"
                    >
                      <Image
                        width={190}
                        height={220}
                        src="/images/google-base.svg"
                        alt="创作"
                        objectFit="contain"
                      />
                    </a>
                  </NavigationMenuLink>
                </li> */}
                <ListItem href="/create/text" title="创作文案">
                  超强AI智能体帮你快速创作脚本文案
                </ListItem>
                <ListItem href="/create/audio" title="创作音频">
                  超逼真多情感的生成式语音大模型
                </ListItem>
                <ListItem href="/create/video" title="创作视频">
                  一键生成创意视频
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/hot" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                创作灵感
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <Link href="/director" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                AI 大导演
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>

      {user ? (
        <UserNav user={user} />
      ) : (
        <Button
          size="sm"
          className="rounded-lg"
        >
          <Link href="/login">登录</Link>
        </Button>
      )}
      
    </div>
  );
}
