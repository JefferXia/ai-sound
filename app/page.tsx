'use client';

import {
  ArrowRight,
  Eye,
  Zap,
  Shield,
  Brain,
  Download,
  Chrome,
  Play,
  Sparkles,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: '智能识别',
      description: '自动识别网页中的关键信息，包括文本、图片、视频、表格等内容',
      preview: '快速提取网页核心内容，省去人工筛选的时间',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '一键提取',
      description: '一键点击即可提取网页关键信息，支持多种格式导出',
      preview: '支持导出为 Markdown、JSON、CSV 等多种格式',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '合规检测',
      description: '帮你7x24小时检测合规风险，实时同步平台规则风险',
      preview: '您的合规安全是我们的首要任务',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: '视觉增强',
      description: '自动高亮重要信息，帮助您快速定位所需内容',
      preview: '让复杂的网页信息一目了然',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 relative">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">极效火眼</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition"
              >
                功能特性
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition"
              >
                使用方法
              </Link>
              <Link
                href="#demo"
                className="text-muted-foreground hover:text-foreground transition"
              >
                演示
              </Link>
              <Link
                href="/install"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition"
              >
                <Download className="w-4 h-4 inline mr-2" />
                安装扩展
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 hero-gradient">
        <div className="container mx-auto text-center">
          <div className="relative inline-flex items-center px-4 py-2 rounded-full gradient-border mb-8 overflow-hidden">
            <span>
              <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
            </span>
            <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
            <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/40"></span>
            <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
              AI 驱动的浏览器扩展
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">洞若观火</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            为你洞察繁杂的网页信息
            <br />
            用它来监控竞品、舆情跟踪，简直是神器
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/install"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Chrome className="w-5 h-5 mr-2" />
              安装到 Chrome
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center px-8 py-4 border border-border rounded-full hover:bg-muted transition"
            >
              <Play className="w-5 h-5 mr-2" />
              观看演示
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">强大功能</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            让网页操作更高效，信息获取更精准
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`gradient-border rounded-2xl p-8 card-hover cursor-pointer ${
                  activeFeature === index ? 'glow' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <p className="text-sm text-cyan-400">{feature.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">实际效果展示</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            看看极效火眼如何帮助您处理网页信息
          </p>

          <div className="max-w-4xl mx-auto gradient-border rounded-2xl p-2">
            <div className="bg-card rounded-xl aspect-video flex items-center justify-center">
              <img src="/images/product.gif" alt="Product" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">使用方法</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            三步即可生成完整报告
          </p>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            <div className="relative">
              <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff6b9d] z-0 opacity-60"></div>
              <div className="relative bg-[#1a2332]/70 backdrop-blur-sm border border-[#00d4ff]/30 rounded-2xl p-8 text-center hover:bg-[#1a2332]/50 hover:border-[#ff6b9d]/50 transition-all duration-300 group h-full flex flex-col">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-[#00d4ff] to-[#00f5d4] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <div className="w-16 h-16 bg-[#0a1324]/60 border border-[#00d4ff]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#00f5d4] group-hover:scale-110 group-hover:border-[#ff6b9d] group-hover:bg-[#ff6b9d]/10 group-hover:text-[#ff6b9d] transition-all duration-300">
                  <Globe size={32} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#ffffff] mb-4">
                    定位待分析网页
                  </h3>
                  <p className="text-[#b8d4f0] leading-relaxed">
                    打开要分析的竞品页面、活动页面或后台报表。
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#00d4ff] via-[#c77dff] to-[#ff6b9d] z-0 opacity-60"></div>
              <div className="relative bg-[#1a2332]/70 backdrop-blur-sm border border-[#00d4ff]/30 rounded-2xl p-8 text-center hover:bg-[#1a2332]/50 hover:border-[#ff6b9d]/50 transition-all duration-300 group h-full flex flex-col">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-[#00d4ff] to-[#00f5d4] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <div className="w-16 h-16 bg-[#0a1324]/60 border border-[#00d4ff]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#00f5d4] group-hover:scale-110 group-hover:border-[#ff6b9d] group-hover:bg-[#ff6b9d]/10 group-hover:text-[#ff6b9d] transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-brain h-8 w-8"
                  >
                    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                    <path d="M15 13a4.5 4.5 0 0 1-3-4 4 4 0 0 1-3 4"></path>
                    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                    <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                    <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                    <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#ffffff] mb-4">
                    AI智能理解
                  </h3>
                  <p className="text-[#b8d4f0] leading-relaxed">
                    AI检测文本、表格、图片、视频或源码并分析内容结构。
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-[#1a2332]/70 backdrop-blur-sm border border-[#00d4ff]/30 rounded-2xl p-8 text-center hover:bg-[#1a2332]/50 hover:border-[#ff6b9d]/50 transition-all duration-300 group h-full flex flex-col">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-[#00d4ff] to-[#00f5d4] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <div className="w-16 h-16 bg-[#0a1324]/60 border border-[#00d4ff]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#00f5d4] group-hover:scale-110 group-hover:border-[#ff6b9d] group-hover:bg-[#ff6b9d]/10 group-hover:text-[#ff6b9d] transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-download h-8 w-8"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#ffffff] mb-4">
                    结构化报告
                  </h3>
                  <p className="text-[#b8d4f0] leading-relaxed">
                    信息从混乱到清晰，所有整理好的数据一键导出报告。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="gradient-border rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              准备好提升您的<span className="gradient-text">工作效率</span>
              了吗？
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              加入万千极效火眼用户，体验智能化的网页信息处理
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/install"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                立即安装
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Developer Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div
            className="p-12 rounded-3xl text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-400 mb-6">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                产品开发中
              </span>
            </div>
            <h2 className="text-5xl font-bold mb-6 text-white">
              联系 极效火眼 开发者
            </h2>
            <p className="text-xl mb-8 text-gray-300 leading-relaxed">
              我们正在全力开发 极效火眼，添加联系方式直接沟通，获得产品最新进展
            </p>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* QQ Contact */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                {/* QQ QR Code */}
                <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg p-4">
                  <img
                    src="/images/mu_qiwei.png"
                    alt="企微二维码"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    扫码添加企微
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    扫描上方二维码，添加我的微信
                    <br />
                    直接沟通，获得第一手产品信息
                  </p>

                  {/* Contact Button */}
                  <div className="mt-6">
                    <div className="inline-flex items-center px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-green-400 font-medium">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                      </svg>
                      微信专属服务
                    </div>
                  </div>
                </div>
              </div>

              {/* Feishu Contact */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                {/* Feishu QR Code */}
                <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg p-4">
                  <img
                    src="/images/mu_feishu.png"
                    alt="飞书二维码"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    扫码添加飞书
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    扫描上方二维码，添加我的飞书
                    <br />
                    直接沟通，获得第一手产品信息
                  </p>

                  {/* Contact Button */}
                  <div className="mt-6">
                    <div className="inline-flex items-center px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-blue-400 font-medium">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                      </svg>
                      飞书专属服务
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 text-base md:text-lg font-medium">
                💡 提示：请备注&quot;极效火眼&quot;以便快速通过好友申请
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-10 mt-12 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">实时沟通</h3>
                  <p className="text-gray-400 text-sm">
                    直接对话，实时了解开发进展
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">专属服务</h3>
                  <p className="text-gray-400 text-sm">
                    一对一咨询，定制化解决方案
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">优先体验</h3>
                  <p className="text-gray-400 text-sm">
                    内测资格，抢先试用新功能
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 relative">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold">极效火眼</span>
            </div>
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>©光环效应(杭州)人工智能应用技术有限公司</p>
              <p>浙ICP备2025170997号-1</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
