'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type User } from 'next-auth';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { UserNav } from '@/components/custom/navbar-user-nav';
import { Button } from '@/components/ui/button';

// Logo组件
const Logo = ({
  href = '/',
  className = '',
}: {
  href?: string;
  className?: string;
}) => (
  <Link
    href={href}
    className={`flex items-center space-x-2 hover:opacity-80 transition ${className}`}
  >
    <div className="w-10 h-10 relative">
      <Image
        src="/images/logo.png"
        alt="Logo"
        fill
        className="object-contain"
      />
    </div>
    <span className="text-xl font-bold">极效火眼</span>
  </Link>
);

// 用户状态组件
const UserSection = ({ user }: { user: User | undefined }) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const loginHref = code ? `/login?code=${code}` : '/login';

  return user ? (
    <UserNav user={user} />
  ) : (
    <Button size="sm" className="rounded-lg">
      <Link href={loginHref} className="text-white">
        登录
      </Link>
    </Button>
  );
};

// 首页导航链接
const HomeNavLinks = () => (
  <div className="hidden md:flex items-center space-x-8">
    <Link
      href="#features"
      className="text-muted-foreground hover:text-foreground transition"
    >
      功能特性
    </Link>
    <Link
      href="#how-it-works"
      className="text-muted-foreground hover:text-foreground transition"
    >
      使用方法
    </Link>
    <Link
      href="#demo"
      className="text-muted-foreground hover:text-foreground transition"
    >
      演示
    </Link>
    <Link
      href="#contact"
      className="text-muted-foreground hover:text-foreground transition"
    >
      联系我们
    </Link>
  </div>
);

export function Navbar({ user }: { user: User | undefined }) {
  const pathname = usePathname();

  // 定义不需要显示导航栏的页面路径
  const hiddenPaths = ['/login', '/register'];
  const shouldHideNavbar =
    hiddenPaths.includes(pathname) || pathname.startsWith('/video-analysis/');

  if (shouldHideNavbar) return null;

  // 页面类型判断
  const isHomePage = pathname === '/';
  const isInstallPage = pathname === '/install';
  const isHistoryPage = pathname === '/history';

  // History页面只有UserSection的情况
  if (isHistoryPage) {
    return (
      <nav className="fixed top-5 right-5 z-50">
        <UserSection user={user} />
      </nav>
    );
  }

  // 营销页面导航栏（首页和install页面）
  if (isHomePage || isInstallPage) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center space-x-8">
              {isHomePage && <HomeNavLinks />}
              <UserSection user={user} />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // 应用内导航栏
  return (
    <div className="fixed left-0 top-0 z-20 w-full h-16 px-7 flex items-center justify-between bg-sidebar backdrop-blur-md">
      <Logo />
      {/* <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>开始创作</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
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
        </NavigationMenuList>
      </NavigationMenu> */}
      <UserSection user={user} />
    </div>
  );
}
