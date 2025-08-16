# ZPAY支付系统配置说明

## 1. 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下配置：

```bash
# ZPAY支付配置
# 从 https://z-pay.cn 注册获取
ZPAY_PID=你的商户ID
ZPAY_KEY=你的商户密钥

# 支付回调地址配置
# 这些URL需要是公网可访问的地址
ZPAY_NOTIFY_URL=https://你的域名.com/api/payment/notify
ZPAY_RETURN_URL=https://你的域名.com/api/payment/return

# ZPAY API地址（一般不需要修改）
ZPAY_API_URL=https://z-pay.cn
```

## 2. 获取ZPAY商户信息

1. 访问 [https://z-pay.cn](https://z-pay.cn)
2. 注册账号并完成实名认证
3. 获取商户ID (PID) 和商户密钥 (KEY)

## 3. 配置回调地址

### 异步通知地址 (notify_url)

- 用于接收支付结果通知
- 必须是公网可访问的HTTPS地址
- 建议使用你的域名：`https://你的域名.com/api/payment/notify`

### 页面跳转地址 (return_url)

- 用于用户支付完成后的页面跳转
- 必须是公网可访问的HTTPS地址
- 建议使用你的域名：`https://你的域名.com/api/payment/return`

## 4. 本地开发配置

如果需要在本地开发环境测试支付功能，可以使用以下工具：

### ngrok (推荐)

```bash
# 安装ngrok
npm install -g ngrok

# 启动本地服务
npm run dev

# 在另一个终端启动ngrok
ngrok http 3000

# 使用ngrok提供的HTTPS地址作为回调地址
ZPAY_NOTIFY_URL=https://xxxx.ngrok.io/api/payment/notify
ZPAY_RETURN_URL=https://xxxx.ngrok.io/api/payment/return
```

### localtunnel

```bash
# 安装localtunnel
npm install -g localtunnel

# 启动本地服务
npm run dev

# 在另一个终端启动localtunnel
lt --port 3000

# 使用localtunnel提供的HTTPS地址作为回调地址
ZPAY_NOTIFY_URL=https://xxxx.loca.lt/api/payment/notify
ZPAY_RETURN_URL=https://xxxx.loca.lt/api/payment/return
```

## 5. 支付流程说明

### 创建支付订单

1. 用户填写商品信息和选择支付方式
2. 调用 `/api/payment/create` 创建支付订单
3. 系统生成订单号并调用ZPAY API
4. 返回支付URL或二维码

### 用户支付

1. 用户跳转到ZPAY支付页面
2. 完成支付操作
3. ZPAY异步通知支付结果到 `/api/payment/notify`
4. 用户跳转回 `/api/payment/return`

### 支付结果处理

1. 异步通知更新订单状态
2. 页面跳转显示支付结果
3. 处理支付成功后的业务逻辑

## 6. 安全注意事项

1. **签名验证**：所有回调都必须验证签名，防止伪造请求
2. **金额验证**：验证支付金额与订单金额是否一致
3. **订单状态**：防止重复处理同一笔支付
4. **HTTPS**：生产环境必须使用HTTPS协议
5. **密钥安全**：不要将商户密钥提交到代码仓库

## 7. 测试支付

ZPAY提供测试环境，可以使用以下测试账号：

- 支付宝测试账号：13800138000
- 微信支付测试：使用微信扫码支付
- 测试金额：建议使用0.01元进行测试

## 8. 常见问题

### Q: 回调地址无法访问？

A: 确保回调地址是公网可访问的HTTPS地址，本地开发需要使用ngrok等工具。

### Q: 签名验证失败？

A: 检查商户密钥是否正确，确保签名算法按照文档实现。

### Q: 支付成功但订单状态未更新？

A: 检查异步通知接口是否正常返回"success"，检查数据库连接和更新逻辑。

## 9. 技术支持

- ZPAY官方文档：[https://z-pay.cn/doc.html](https://z-pay.cn/doc.html)
- ZPAY技术支持：联系ZPAY客服
- 项目问题：查看项目Issues或联系开发者
