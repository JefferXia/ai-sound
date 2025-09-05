'use client';

import React from 'react';
import {
  Download,
  Settings,
  Pin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function InstallPage() {
  const steps = [
    {
      title: '打开扩展程序管理页面',
      description:
        '在 Chrome 浏览器中，依次选择“更多”图标 展开 → 扩展程序 → 管理扩展程序。',
      image: 'extension_step1.png',
    },
    {
      title: '加载扩展程序',
      description: '开启开发者模式，将下载的文件拖放到扩展程序页面',
      image: 'extension_step2.png',
    },
    {
      title: '固定到工具栏',
      description: '点击浏览器右上角的扩展程序图标，找到极效火眼并点击固定按钮',
      image: 'extension_step3.png',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 hero-gradient">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            安装 <span className="gradient-text">极效火眼</span> 扩展
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            按照以下步骤在 Chrome 浏览器中安装极效火眼扩展程序
          </p>

          <div className="inline-flex items-center px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-8">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
            <span className="text-sm">
              目前扩展程序处于内测阶段，需要手动安装
            </span>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-border rounded-2xl p-8 text-center">
            <Download className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h2 className="text-2xl font-bold mb-4">下载扩展程序</h2>
            <p className="text-muted-foreground mb-6">
              点击下方按钮下载极效火眼扩展程序文件
            </p>
            <button
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full hover:shadow-xl transition-all transform hover:scale-105"
              onClick={() => {
                // 创建下载链接
                const link = document.createElement('a');
                link.href = '/extension/极效火眼-1.0.5.zip';
                link.download = '极效火眼1.0.5.zip';
                link.click();
              }}
            >
              <Download className="w-5 h-5 mr-2" />
              下载极效火眼
            </button>
            {/* <p className="text-sm text-muted-foreground mt-4">
              文件大小：2.3 MB | 格式：.crx
            </p> */}
          </div>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="gradient-text">安装步骤</span>
          </h2>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="flex-1 order-2 md:order-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>

                      {index === 0 && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm">或者直接在地址栏输入：</p>
                          <code className="text-cyan-400 text-sm">
                            chrome://extensions/
                          </code>
                        </div>
                      )}

                      {index === 1 && (
                        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <p className="text-sm flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>开发者模式是安装第三方扩展的必要条件</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 order-1 md:order-2">
                  <div className="gradient-border rounded-xl p-2">
                    <div className="bg-card rounded-lg aspect-video flex items-center justify-center">
                      {/* Placeholder for screenshots */}
                      <div className="text-center">
                        <Image
                          src={`/images/${step.image}`}
                          width={589}
                          height={383}
                          alt={step.title}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-border rounded-2xl p-8">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-4">安装完成！</h2>
              <p className="text-muted-foreground mb-6">
                恭喜！您已成功安装极效火眼扩展程序。现在您可以：
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
                <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-2">
                  <Pin className="w-5 h-5 text-cyan-400" />
                  <p className="text-sm">在打开的网页上使用扩展功能</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400 mb-2" />
                  <p className="text-sm">点击工具栏图标进入设置</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-cyan-400 mb-2" />
                  <p className="text-sm">打开侧边栏快速提取信息</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="gradient-text">常见问题</span>
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>如何使用极效火眼？</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  由于极效火眼目前处于内测阶段，尚未发布到 Chrome
                  网上应用店。开发者模式允许您安装来自第三方的扩展程序。这是完全安全的，不会影响您的浏览器性能。
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>极效火眼有什么不一样？</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  极效火眼是一款基于 AI
                  的浏览器扩展，可以一键提取屏幕上的任何内容，并提供以下功能：
                </p>
                <p>目前支持以下功能：</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>一键检测淘宝/天猫/京东/抖音商品详情页的违禁词</li>
                  <li>一键提取视频文案，深度分析价值</li>
                  <li>实时分析屏幕上的任何内容</li>
                  <li>AI检测文本、表格、图片、视频或源码并分析内容结构</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>如何卸载扩展？</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  您可以随时卸载极效火眼：进入
                  chrome://extensions/，找到极效火眼扩展，点击【移除】按钮即可完全卸载。
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 mt-20">
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
