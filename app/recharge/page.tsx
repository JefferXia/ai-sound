'use client'

import { RechargeForm } from '@/components/recharge/RechargeForm'

export default function RechargePage() {
  // 这里应该从认证系统获取真实的用户ID
  // 暂时使用模拟的用户ID
  const mockUserId = '7d826cf6-2833-44a3-9b58-082ceaf9a953'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">积分充值</h1>
          <p className="text-gray-600">充值积分，享受更多服务</p>
        </div>
        
        <RechargeForm 
          userId={mockUserId}
          onRechargeSuccess={(orderId, pointAmount) => {
            console.log('充值订单创建成功:', { orderId, pointAmount })
          }}
          onRechargeError={(error) => {
            console.error('充值失败:', error)
          }}
        />
        
      </div>
    </div>
  )
} 