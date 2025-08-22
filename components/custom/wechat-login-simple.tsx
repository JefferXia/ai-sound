'use client';

import { useState } from 'react';
import { generateWeChatAuthUrl } from '@/lib/wechat';

interface WeChatLoginSimpleProps {
  onSuccess?: (userInfo: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function WeChatLoginSimple({
  onSuccess,
  onError,
  className = '',
}: WeChatLoginSimpleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWeChatLogin = () => {
    setIsLoading(true);

    try {
      // 生成state参数用于防止CSRF攻击
      const state = Math.random().toString(36).substring(2, 15);

      // 生成微信授权URL并跳转
      const authUrl = generateWeChatAuthUrl(state);
      window.location.href = authUrl;
    } catch (error) {
      setIsLoading(false);
      onError?.(error instanceof Error ? error.message : '微信登录失败');
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <button
        onClick={handleWeChatLogin}
        disabled={isLoading}
        className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mr-2"></div>
            登录中...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.212 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.42 4.882-1.92 7.432-.823-.576-3.583-3.98-6.348-7.924-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18 0 .653-.52 1.182-1.162 1.182-.641 0-1.162-.529-1.162-1.182 0-.651.521-1.18 1.162-1.18zm5.82 0c.641 0 1.162.529 1.162 1.18 0 .653-.521 1.182-1.162 1.182-.642 0-1.162-.529-1.162-1.182 0-.651.52-1.18 1.162-1.18z" />
            </svg>
            微信登录
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 mt-2">使用微信账号快速登录</p>
    </div>
  );
}

// 内嵌二维码版本（需要微信开放平台支持）
export function WeChatLoginQR({ className = '' }: { className?: string }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // 生成微信登录二维码URL
  const generateQRCode = () => {
    const state = Math.random().toString(36).substring(2, 15);
    const params = new URLSearchParams({
      appid: process.env.NEXT_PUBLIC_WECHAT_APP_ID || '',
      redirect_uri: encodeURIComponent(
        process.env.NEXT_PUBLIC_WECHAT_REDIRECT_URI || ''
      ),
      response_type: 'code',
      scope: 'snsapi_login',
      state: state,
    });

    const qrUrl = `https://open.weixin.qq.com/connect/qrconnect?${params.toString()}#wechat_redirect`;
    setQrCodeUrl(qrUrl);
  };

  return (
    <div className={`text-center ${className}`}>
      {qrCodeUrl ? (
        <div className="mb-4">
          <iframe
            src={qrCodeUrl}
            className="w-full h-80 border border-gray-300 rounded-lg"
            title="微信登录"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      ) : (
        <button
          onClick={generateQRCode}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          显示微信登录二维码
        </button>
      )}

      <p className="text-xs text-gray-400 mt-2">扫描二维码登录微信</p>
    </div>
  );
}
