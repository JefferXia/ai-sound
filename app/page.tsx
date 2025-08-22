'use client';

import {
  ArrowRight,
  Eye,
  Zap,
  Shield,
  Brain,
  Download,
  Chrome,
  Github,
  Play,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
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
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient
                      id="eyeGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  {/* Eye outline */}
                  <path
                    d="M100 60 Q150 100 100 140 Q50 100 100 60"
                    fill="none"
                    stroke="url(#eyeGradient)"
                    strokeWidth="6"
                  />
                  {/* Eye iris */}
                  <circle
                    cx="100"
                    cy="100"
                    r="25"
                    fill="url(#eyeGradient)"
                    opacity="0.8"
                  />
                  {/* Eye pupil */}
                  <circle cx="100" cy="100" r="10" fill="#1e293b" />
                  {/* Corner brackets */}
                  <path
                    d="M30 30 L30 50 M30 30 L50 30"
                    stroke="url(#eyeGradient)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    d="M170 30 L150 30 M170 30 L170 50"
                    stroke="url(#eyeGradient)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    d="M30 170 L30 150 M30 170 L50 170"
                    stroke="url(#eyeGradient)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    d="M170 170 L170 150 M170 170 L150 170"
                    stroke="url(#eyeGradient)"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
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
            <span className="gradient-text">我眼即你眼</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            为你洞察繁杂的网页信息
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
                    className="lucide lucide-camera h-8 w-8"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                    <circle cx="12" cy="13" r="3"></circle>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#ffffff] mb-4">
                    截图
                  </h3>
                  <p className="text-[#b8d4f0] leading-relaxed">
                    一键捕获屏幕上的任何内容。
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
                    结构化输出
                  </h3>
                  <p className="text-[#b8d4f0] leading-relaxed">
                    一键导出为Markdown、JSON、CSV等格式。
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

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 relative">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient
                      id="footerEyeGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M100 60 Q150 100 100 140 Q50 100 100 60"
                    fill="none"
                    stroke="url(#footerEyeGradient)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="25"
                    fill="url(#footerEyeGradient)"
                    opacity="0.8"
                  />
                  <circle cx="100" cy="100" r="10" fill="#1e293b" />
                  <path
                    d="M30 30 L30 50 M30 30 L50 30"
                    stroke="url(#footerEyeGradient)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    d="M170 30 L150 30 M170 30 L170 50"
                    stroke="url(#footerEyeGradient)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    d="M30 170 L30 150 M30 170 L50 170"
                    stroke="url(#footerEyeGradient)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    d="M170 170 L170 150 M170 170 L150 170"
                    stroke="url(#footerEyeGradient)"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
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
