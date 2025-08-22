'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CheckCircle } from 'lucide-react';
import { AuthForm } from '@/components/custom/auth-form';
import { SubmitButton } from '@/components/custom/submit-button';
import { WeChatLoginQR } from '@/components/custom/wechat-login-simple';

import { login, LoginActionState } from '../actions';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    }
  );

  // 检查URL参数中是否有微信用户信息
  useEffect(() => {
    const wechatUser = searchParams.get('wechat_user');
    if (wechatUser) {
      setIsLoggedIn(true);
    }

    const error = searchParams.get('error');
    if (error === 'wechat_auth_failed') {
      toast.error('微信登录失败，请重试');
    }
  }, [searchParams]);

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Invalid credentials!');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  const handleWeChatSuccess = (userInfo: any) => {
    toast.success(`微信登录成功！欢迎 ${userInfo.nickname}`);
  };

  const handleWeChatError = (error: string) => {
    toast.error(`微信登录失败: ${error}`);
  };

  if (isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-background p-4">
        <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-900/50 p-8 border border-gray-700 shadow-lg backdrop-blur-sm">
          <div className="text-green-400">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">登录成功</h2>
          <p className="text-gray-300">您已成功登录极效火眼</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-[400px] mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8 gradient-text">
          登录极效火眼
        </h1>

        {/* 微信登录组件 */}
        <div className="mb-6">
          <WeChatLoginQR
            onSuccess={handleWeChatSuccess}
            onError={handleWeChatError}
          />
        </div>

        {/* 分割线 */}
        {/* <div className="relative px-4 sm:px-16 my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">
              或者使用邮箱登录
            </span>
          </div>
        </div> */}

        {/* 邮箱登录表单 */}
        {/* <div className="px-4 sm:px-16">
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton>邮箱登录</SubmitButton>
            <p className="text-center text-sm text-gray-400 mt-4">
              {'还没有账号? 立即'}
              <Link
                href="/register"
                className="font-semibold text-gray-300 hover:underline"
              >
                注册
              </Link>
            </p>
          </AuthForm>
        </div> */}
      </div>
    </div>
  );
}
