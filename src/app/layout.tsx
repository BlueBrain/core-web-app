'use client';

import { ReactNode } from 'react';
import { Titillium_Web } from '@next/font/google';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';

import commonAntdTheme from '@/theme/antd';
import useTheme from '@/hooks/theme';
import { basePath } from '@/config';

import '@/styles/globals.scss';

const titilliumWeb = Titillium_Web({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-titillium-web',
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  useTheme();

  return (
    <html lang="en" className={`${titilliumWeb.variable} font-sans`}>
      <ConfigProvider theme={commonAntdTheme}>
        <SessionProvider basePath={`${basePath}/api/auth`}>
          <body>{children}</body>
        </SessionProvider>
      </ConfigProvider>
    </html>
  );
}
