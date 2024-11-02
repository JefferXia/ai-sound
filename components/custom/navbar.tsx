'use client';

import { Plus } from 'lucide-react'
import Link from 'next/link'
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
    <div className="sticky top-0 z-99 w-full h-12 px-7 flex items-center justify-between backdrop-blur-md border-b">
      <div className='flex items-center space-x-3'>
        <Link href="/">
          <span className="text-lg font-semibold font-mono tracking-tighter">
            音咖
          </span>
        </Link>
        <Link href="/sound">
          <BetterTooltip content="创建新的播客">
            <Plus />
          </BetterTooltip>
        </Link>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/sound-list" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                发现聆听
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
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
