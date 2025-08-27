'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Users } from 'lucide-react';
import { toast } from 'sonner';

interface InviteStats {
  inviteCode: string | null;
  inviteCount: number;
  canInvite: boolean;
}

export function InviteCodeDisplay() {
  const [stats, setStats] = useState<InviteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchInviteStats();
  }, []);

  const fetchInviteStats = async () => {
    try {
      const response = await fetch('/api/invite/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('获取邀请统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!stats?.inviteCode) return;

    try {
      await navigator.clipboard.writeText(stats.inviteCode);
      setCopied(true);
      toast.success('邀请码已复制到剪贴板');

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('复制失败，请手动复制');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!stats?.canInvite) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-gray-500 text-center">邀请码生成中...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">我的邀请码</h3>

      <div className="space-y-4">
        {/* 邀请码显示 */}
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邀请码
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono text-lg tracking-wider">
                {stats.inviteCode}
              </div>
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 邀请统计 */}
        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">已邀请</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.inviteCount}
          </div>
          <span className="text-sm text-gray-500">人</span>
        </div>

        {/* 邀请说明 */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p>• 分享您的邀请码给朋友，邀请他们注册使用</p>
          <p>• 每个邀请码只能使用一次</p>
          <p>• 邀请码注册后自动建立邀请关系</p>
        </div>
      </div>
    </div>
  );
}
