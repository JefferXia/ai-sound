'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, Smartphone, QrCode, Coins, Check } from 'lucide-react'
import type { PaymentType } from '@/types/payment'
import { Label } from '@/components/ui/label'

interface RechargeFormProps {
  userId: string
  onRechargeSuccess?: (orderId: string, pointAmount: number) => void
  onRechargeError?: (error: string) => void
}

// 三档充值套餐
const RECHARGE_PACKAGES = [
  {
    id: 'basic',
    name: '专业体验包',
    price: 199,
    points: 1000,
    description: '适合个人用户和小型项目'
  },
  {
    id: 'pro',
    name: '旗舰商家包',
    price: 895,
    points: 5000,
    description: '适合商业用户和中等规模项目'
  },
  {
    id: 'enterprise',
    name: '尊享品牌包',
    price: 2980,
    points: 20000,
    description: '适合企业用户和大型项目'
  }
]

export function RechargeForm({ userId, onRechargeSuccess, onRechargeError }: RechargeFormProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('pro')
  const [paymentType, setPaymentType] = useState<PaymentType>('alipay')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // 二维码相关状态
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<{
    orderId: string
    qrCode: string
    qrCodeImg: string
    amount: number
    pointAmount: number
    paymentType: PaymentType
  } | null>(null)

  // 获取选中的套餐
  const getSelectedPackage = () => {
    return RECHARGE_PACKAGES.find(pkg => pkg.id === selectedPackage)!
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const pkg = getSelectedPackage()
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // 创建充值订单
      const response = await fetch('/api/recharge/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount: pkg.price,
          paymentType,
          pointAmount: pkg.points // 添加积分数量参数
        })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(`充值订单创建成功！订单号：${result.orderId}`)
        
        // 如果有二维码，显示二维码弹窗
        if (result.qrCode || result.qrCodeImg) {
          console.log('显示二维码:', { qrCode: result.qrCode, qrCodeImg: result.qrCodeImg })
          setQrCodeData({
            orderId: result.orderId,
            qrCode: result.qrCode || '',
            qrCodeImg: result.qrCodeImg || result.qrCode || '',
            amount: pkg.price,
            pointAmount: result.pointAmount,
            paymentType
          })
          setShowQRCode(true)
        } else if (result.paymentUrl) {
          // 如果没有二维码但有支付URL，询问用户是否跳转
          console.log('没有二维码，使用支付URL:', result.paymentUrl)
          if (confirm('即将跳转到支付页面，是否继续？')) {
            window.open(result.paymentUrl, '_blank')
          }
        } else {
          console.log('既没有二维码也没有支付URL，完整响应:', result)
          setError('支付接口异常，请联系客服')
        }

        onRechargeSuccess?.(result.orderId, result.pointAmount)
      } else {
        setError(result.message || '创建充值订单失败')
        onRechargeError?.(result.message)
      }
    } catch (error) {
      console.error('充值失败:', error)
      setError('网络错误，请稍后重试')
      onRechargeError?.('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const getPaymentIcon = (type: PaymentType) => {
    switch (type) {
      case 'alipay':
        return <CreditCard className="h-4 w-4" />
      case 'wxpay':
        return <Smartphone className="h-4 w-4" />
      case 'qqpay':
        return <QrCode className="h-4 w-4" />
      case 'tenpay':
        return <CreditCard className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getPaymentName = (type: PaymentType) => {
    switch (type) {
      case 'alipay':
        return '支付宝'
      case 'wxpay':
        return '微信支付'
      case 'qqpay':
        return 'QQ钱包'
      case 'tenpay':
        return '财付通'
      default:
        return '支付宝'
    }
  }

  const closeQRCode = () => {
    setShowQRCode(false)
    setQrCodeData(null)
  }

  // 如果显示二维码，只显示二维码界面
  if (showQRCode) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-6 w-6 text-blue-600" />
            扫码支付
          </CardTitle>
          <CardDescription>
            请使用{getPaymentName(qrCodeData?.paymentType || 'alipay')}扫描下方二维码完成支付
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 订单信息 */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">订单号：</span>
              <span className="font-mono">{qrCodeData?.orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">充值金额：</span>
              <span className="font-semibold">¥{qrCodeData?.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">获得积分：</span>
              <span className="font-semibold text-green-600">{qrCodeData?.pointAmount} 积分</span>
            </div>
          </div>

          {/* 二维码 */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border">
              {qrCodeData?.qrCodeImg ? (
                // 如果有二维码图片，直接显示
                <img 
                  src={qrCodeData.qrCodeImg} 
                  alt="支付二维码" 
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    console.error('二维码图片加载失败:', e)
                    // 如果图片加载失败，显示错误信息
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : qrCodeData?.qrCode ? (
                // 如果没有图片但有链接，显示链接信息
                <div className="w-48 h-48 flex flex-col items-center justify-center text-center p-4">
                  <QrCode className="h-16 w-16 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">二维码链接已生成</p>
                  <p className="text-xs text-gray-500 break-all">
                    {qrCodeData.qrCode}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    请复制链接到浏览器打开
                  </p>
                </div>
              ) : (
                // 如果都没有，显示错误
                <div className="w-48 h-48 flex flex-col items-center justify-center text-center p-4">
                  <QrCode className="h-16 w-16 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">二维码生成失败</p>
                  <p className="text-xs text-gray-500">请联系客服</p>
                </div>
              )}
              
              <div className="hidden text-center text-gray-500 mt-2">
                <p>二维码加载失败</p>
                <p className="text-sm">请刷新页面重试</p>
              </div>
            </div>
          </div>

          {/* 支付说明 */}
          <div className="text-center text-sm text-gray-500">
            <p>支付完成后，积分将自动到账</p>
            <p>如遇问题，请联系客服</p>
          </div>

          {/* 完成支付按钮 */}
          <Button 
            onClick={() => {
              // 这里可以添加支付完成的处理逻辑
              alert('支付完成后，请等待系统自动处理')
            }}
            className="w-full"
            size="lg"
          >
            完成支付
          </Button>

          {/* 返回按钮 */}
          <Button 
            variant="outline" 
            onClick={closeQRCode}
            className="w-full"
          >
            返回选择套餐
          </Button>
        </CardContent>
      </Card>
    )
  }

  // 显示套餐选择界面
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Coins className="h-6 w-6 text-yellow-600" />
          积分充值
        </CardTitle>
        <CardDescription>
          选择适合您的充值套餐，享受更多服务
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 充值套餐选择 */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">选择充值套餐</Label>
            <div className="space-y-4">
              {RECHARGE_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedPackage === pkg.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{pkg.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        ¥{pkg.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {pkg.points.toLocaleString()} 积分
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 支付方式选择 */}
          <div className="space-y-2">
            <Label htmlFor="paymentType">支付方式</Label>
            <Select value={paymentType} onValueChange={(value: PaymentType) => setPaymentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alipay">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    支付宝
                  </div>
                </SelectItem>
                {/* <SelectItem value="wxpay">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    微信支付
                  </div>
                </SelectItem>
                <SelectItem value="qqpay">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    QQ钱包
                  </div>
                </SelectItem>
                <SelectItem value="tenpay">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    财付通
                  </div>
                </SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {/* 选中套餐预览 */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2 border border-blue-200">
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">已选择：</span>
              <span className="font-semibold text-blue-800">
                {getSelectedPackage().name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">充值金额：</span>
              <span className="font-semibold text-blue-800">
                ¥{getSelectedPackage().price.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">获得积分：</span>
              <span className="font-semibold text-blue-800">
                {getSelectedPackage().points.toLocaleString()} 积分
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {success}
            </div>
          )}

          <Button type="submit" className="w-full h-14 text-lg font-semibold" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                创建充值订单中...
              </>
            ) : (
              <>
                {getPaymentIcon(paymentType)}
                <span className="ml-3">立即充值 ¥{getSelectedPackage().price.toLocaleString()}</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 