import { NextRequest, NextResponse } from 'next/server';
import { getWeChatAccessToken, getWeChatUserInfo } from '@/lib/wechat';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=wechat_auth_failed', request.url));
    }

    // 通过code获取access_token
    const tokenData = await getWeChatAccessToken(code);
    
    // 通过access_token获取用户信息
    const userInfo = await getWeChatUserInfo(tokenData.access_token, tokenData.openid);

    // 检查用户是否已存在（暂时使用email字段，后续需要更新schema）
    let existingUser = null;
    try {
      // 暂时使用email字段查询，后续需要添加wechatOpenId字段
      existingUser = await prisma.user.findFirst({
        where: { 
          wechatOpenId: userInfo.openid  
        }
      });
    } catch (error) {
      console.error('Database query error:', error);
    }

    if (existingUser) {
      // 用户已存在，更新微信信息
      try {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            wechatNickname: userInfo.nickname,  // 暂时注释，等schema更新后启用
            wechatAvatar: userInfo.headimgurl,  // 暂时注释，等schema更新后启用
            wechatUnionId: userInfo.unionid || null,  // 暂时注释，等schema更新后启用
            name: userInfo.nickname, // 临时方案：更新用户名为微信昵称
            updated_at: new Date(),
          }
        });
      } catch (error) {
        console.error('Failed to update user:', error);
      }

      // 重定向到登录成功页面
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('wechat_user', JSON.stringify({
        openid: userInfo.openid,
        nickname: userInfo.nickname,
        headimgurl: userInfo.headimgurl,
        unionid: userInfo.unionid,
        action: 'login',
        userId: existingUser.id,
      }));

      return NextResponse.redirect(redirectUrl);
    } else {
      // 用户不存在，创建新用户
      try {
        const newUser = await prisma.user.create({
          data: {
            name: userInfo.nickname,
            wechatOpenId: userInfo.openid,  // 暂时注释，等schema更新后启用
            wechatUnionId: userInfo.unionid || null,  // 暂时注释，等schema更新后启用
            wechatNickname: userInfo.nickname,  // 暂时注释，等schema更新后启用
            wechatAvatar: userInfo.headimgurl,  // 暂时注释，等schema更新后启用
            balance: 200, // 新用户赠送200积分
            point: {
              create: {
                amount: 200,
                type: 'SYSTEM',
                reason: '微信登录新用户赠送200积分'
              }
            }
          }
        });

        // 重定向到登录成功页面
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('wechat_user', JSON.stringify({
          openid: userInfo.openid,
          nickname: userInfo.nickname,
          headimgurl: userInfo.headimgurl,
          unionid: userInfo.unionid,
          action: 'login',
          userId: newUser.id,
        }));

        return NextResponse.redirect(redirectUrl);
      } catch (error) {
        console.error('Failed to create user:', error);
        return NextResponse.redirect(new URL('/login?error=wechat_user_creation_failed', request.url));
      }
    }
  } catch (error) {
    console.error('WeChat auth error:', error);
    return NextResponse.redirect(new URL('/login?error=wechat_auth_failed', request.url));
  }
}
