import { Metadata } from 'next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/custom/theme-provider'
import { Navbar } from '@/components/custom/navbar'
import { GlobalContextProvider } from './globalContext'
import { auth } from './(auth)/auth'
import { cookies } from 'next/headers'
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sound.topmind.video'),
  title: '音咖',
  description: '用AI创作有趣的播客',
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
  const [session, cookieStore] = await Promise.all([auth(), cookies()])

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <GlobalContextProvider>
            <Navbar user={session?.user} />
            {children}
          </GlobalContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
