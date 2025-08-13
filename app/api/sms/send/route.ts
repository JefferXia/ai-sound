import { NextRequest, NextResponse } from 'next/server'
// const twilio = require("twilio")

// 超时时间设置为60秒
export const maxDuration = 60

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

import { Signer } from '@volcengine/openapi'

// 验证手机号格式的函数
function isValidPhoneNumber(phone: string): boolean {
  // 中国大陆手机号正则表达式
  // 支持以下格式：
  // 1. 13x-19x 开头的11位数字
  // 2. 支持 +86 前缀
  const phoneRegex = /^(\+86)?1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone } = body || {}

    if (!phone) {
      return NextResponse.json(
        { error: '请输入手机号' },
        { status: 400 }
      );
    }

    // 验证手机号格式（国内）
    if (!isValidPhoneNumber(phone)) {
      return NextResponse.json(
        { error: '手机号格式不正确，请输入有效的中国大陆手机号' },
        { status: 400 }
      );
    }

    const accessKeyId = process.env.VOLC_ACCESSKEY
    const secretKey = process.env.VOLC_SECRETKEY
    const smsAccount = process.env.VOLC_SMS_ACCOUNT
    const smsSign = process.env.VOLC_SMS_SIGN
    const smsTemplateId = process.env.VOLC_SMS_TEMPLATE_ID

    if (!accessKeyId || !secretKey) {
      return NextResponse.json(
        { error: '未配置火山引擎AK/SK，请设置 VOLC_ACCESSKEY 与 VOLC_SECRETKEY' },
        { status: 500 }
      )
    }
    if (!smsAccount || !smsSign || !smsTemplateId) {
      return NextResponse.json(
        { error: '未配置短信参数，请设置 VOLC_SMS_ACCOUNT、VOLC_SMS_SIGN、VOLC_SMS_TEMPLATE_ID' },
        { status: 500 }
      )
    }

    const payload: Record<string, any> = {
      SmsAccount: smsAccount,
      Sign: smsSign,
      TemplateID: smsTemplateId,
      PhoneNumber: phone,
      CodeType: 6,
      ExpireTime: 600,
      Scene: '注册验证码',
    }

    // 组装并签名请求
    const openApiRequestData = {
      method: 'POST',
      region: 'cn-north-1',
      params: {
        Action: 'SendSmsVerifyCode',
        Version: '2020-01-01',
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Host: 'sms.volcengineapi.com',
      } as Record<string, string>,
      body: JSON.stringify(payload),
    }

    // 使用正确的服务名进行签名（volcSMS）
    const signer = new Signer(openApiRequestData as any, 'volcSMS')
    signer.addAuthorization({ accessKeyId, secretKey, sessionToken: '' })

    const url = 'https://sms.volcengineapi.com/?Action=SendSmsVerifyCode&Version=2020-01-01'

    const resp = await fetch(url, {
      method: 'POST',
      headers: openApiRequestData.headers,
      body: openApiRequestData.body as string,
    })

    const data = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      return NextResponse.json(
        { error: '发送短信失败', detail: data },
        { status: resp.status }
      )
    }

    return NextResponse.json({ success: true, result: data?.Result, metadata: data?.ResponseMetadata })
  } catch (error: any) {
    console.error('SendSms error:', error)
    return NextResponse.json(
      { error: '请求处理失败', detail: String(error?.message || error) },
      { status: 500 }
    );
  }
}
