'use client';

import { useEffect, useRef, useState } from 'react';
import { generateWeChatAuthUrl } from '@/lib/wechat';

interface WeChatLoginProps {
  onSuccess?: (userInfo: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

declare global {
  interface Window {
    WwLogin: any;
  }
}

export function WeChatLogin({
  onSuccess,
  onError,
  className = '',
}: WeChatLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 动态加载微信登录JS SDK
    const loadWeChatSDK = async () => {
      try {
        // 检查是否已经加载
        if (window.WwLogin) {
          initWeChatLogin();
          return;
        }

        // 动态创建script标签加载微信登录SDK
        const script = document.createElement('script');
        script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
        script.onload = () => {
          // 微信登录SDK加载完成后，再加载微信开放平台登录JS
          const loginScript = document.createElement('script');
          loginScript.src =
            'https://res.wx.qq.com/open/js/wwopen-jsapi-1.0.0.js';
          loginScript.onload = initWeChatLogin;
          loginScript.onerror = () => {
            setError('Failed to load WeChat login SDK');
            setIsLoading(false);
          };
          document.head.appendChild(loginScript);
        };
        script.onerror = () => {
          setError('Failed to load WeChat SDK');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } catch (err) {
        setError('Failed to initialize WeChat login');
        setIsLoading(false);
      }
    };

    const initWeChatLogin = () => {
      if (!containerRef.current || !window.WwLogin) {
        setError('WeChat login container or SDK not available');
        setIsLoading(false);
        return;
      }

      try {
        // 生成state参数用于防止CSRF攻击
        const state = Math.random().toString(36).substring(2, 15);

        // 初始化微信登录
        new window.WwLogin({
          id: containerRef.current,
          appid: process.env.NEXT_PUBLIC_WECHAT_APP_ID || '',
          agentid: process.env.NEXT_PUBLIC_WECHAT_AGENT_ID || '',
          redirect_uri: encodeURIComponent(
            process.env.NEXT_PUBLIC_WECHAT_REDIRECT_URI || ''
          ),
          state: state,
          href: '', // 自定义样式文件链接，可以为空使用默认样式
          lang: 'zh', // 界面语言
        });

        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize WeChat login widget');
        setIsLoading(false);
      }
    };

    loadWeChatSDK();

    // 清理函数
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  // 监听微信登录成功事件
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 处理微信登录成功后的消息
      if (event.data && event.data.type === 'wechat_login_success') {
        onSuccess?.(event.data.userInfo);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess]);

  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <div className="text-red-500 text-sm mb-2">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-500 text-sm hover:underline"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      {isLoading && (
        <div className="mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">加载微信登录中...</p>
        </div>
      )}

      <div
        ref={containerRef}
        className="min-h-[220px] flex items-center justify-center"
        style={{ minWidth: '220px' }}
      />

      <p className="text-xs text-gray-400 mt-2">使用微信扫码登录</p>
    </div>
  );
}

// 备用方案：如果SDK加载失败，使用链接跳转方式
export function WeChatLoginFallback({
  className = '',
}: {
  className?: string;
}) {
  const handleWeChatLogin = () => {
    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = generateWeChatAuthUrl(state);
    window.location.href = authUrl;
  };

  return (
    <div className={`text-center ${className}`}>
      <button
        onClick={handleWeChatLogin}
        className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.212 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.42 4.882-1.92 7.432-.823-.576-3.583-3.98-6.348-7.924-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18 0 .653-.52 1.182-1.162 1.182-.641 0-1.162-.529-1.162-1.182 0-.651.521-1.18 1.162-1.18zm5.82 0c.641 0 1.162.529 1.162 1.18 0 .653-.521 1.182-1.162 1.182-.642 0-1.162-.529-1.162-1.182 0-.651.52-1.18 1.162-1.18z" />
        </svg>
        微信登录
      </button>
    </div>
  );
}
