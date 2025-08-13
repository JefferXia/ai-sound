import { NextRequest, NextResponse } from 'next/server'
import { createUserByShop, getUserByPhone } from "@/db/queries";
import { compare } from "bcrypt-ts";

// 超时时间设置为60秒
export const maxDuration = 60

function extractPasswordFromShopUrl(shopUrl: string): string | null {
  try {
    const url = new URL(shopUrl);
    const hostname = url.hostname;
    const pathname = url.pathname;

    // Taobao: https://shop112090715.taobao.com/
    const taobaoMatch = hostname.match(/^shop(\d+)\.taobao\.com$/);
    if (taobaoMatch) return taobaoMatch[1];

    // Tmall: https://onyundong.tmall.com/shop/view_shop.htm
    const tmallMatch = hostname.match(/^([a-z0-9-]+)\.tmall\.com$/i);
    if (tmallMatch) return tmallMatch[1];

    // JD: https://mall.jd.com/index-1000435001.html
    const jdHostOk = /(^|\.)jd\.com$/.test(hostname);
    if (jdHostOk) {
      const jdPathMatch = pathname.match(/index-(\d+)\.html$/);
      if (jdPathMatch) return jdPathMatch[1];
    }

    return null;
  } catch {
    return null;
  }
}

function omitPassword<T extends Record<string, any>>(user: T): Omit<T, 'password'> {
  const { password: _omit, ...rest } = user as any;
  return rest as Omit<T, 'password'>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone, shopName, shopUrl } = body
    
    if (!phone) {
      return NextResponse.json(
        { error: '请输入手机号' },
        { status: 400 }
      );
    }

    if (!shopUrl) {
      return NextResponse.json(
        { error: '请提供店铺URL' },
        { status: 400 }
      );
    }

    const password = extractPasswordFromShopUrl(shopUrl);
    if (!password) {
      return NextResponse.json(
        { error: '无法验证该店铺URL，请检查店铺URL是否正确' },
        { status: 400 }
      );
    }

    let user = await getUserByPhone(phone);
    console.log('查询user', user)

    if (user) {
      const passwordsMatch = await compare(password, user.password!);
      if (passwordsMatch) {
        return NextResponse.json({ status: 'user_exists', userInfo: omitPassword(user) });
      }
      return NextResponse.json({ status: 'fail', message: '店铺不匹配' });
    } else {
      const newUser = await createUserByShop(phone, shopName, password);
      console.log('创建user', newUser)

      return NextResponse.json({ status: "new_user", userInfo: omitPassword(newUser) });
    }
  } catch (error) {
    console.error('JSON parsing error:', error)
    return NextResponse.json(
      { error: '无效的JSON格式' },
      { status: 400 }
    );
  }
}
