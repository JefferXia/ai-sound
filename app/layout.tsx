import { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/custom/theme-provider';
// import { Navbar } from '@/components/custom/navbar'
import { GlobalContextProvider } from './globalContext';
import { auth } from './(auth)/auth';
import { cookies } from 'next/headers';
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ai.topmind.video'),
  title: '极效火眼 - AI驱动的网页信息提取工具',
  description:
    '我眼即你眼，为你洞察繁杂的网页信息。AI驱动的浏览器扩展，智能识别、提取和处理网页内容。',
  keywords: '浏览器扩展,Chrome扩展,网页信息提取,AI工具,内容识别',
  authors: [{ name: '光环效应(杭州)人工智能应用技术有限公司' }],
  openGraph: {
    title: '极效火眼 - AI驱动的网页信息提取工具',
    description: '我眼即你眼，为你洞察繁杂的网页信息',
    type: 'website',
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className={inter.className}>
        <Script
          src="https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"
          strategy="beforeInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <GlobalContextProvider user={session?.user}>
            {/* <Navbar user={session?.user} /> */}
            {children}
          </GlobalContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
