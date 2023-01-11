'use client';

import { ReactNode } from 'react';
import { Titillium_Web } from '@next/font/google';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { Provider as JotaiProvider } from 'jotai/react';
import { ErrorBoundary } from 'react-error-boundary';

import commonAntdTheme from '@/theme/antd';
import useTheme from '@/hooks/theme';
import { basePath } from '@/config';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';

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
    <ConfigProvider theme={commonAntdTheme}>
      <JotaiProvider>
        <SessionProvider basePath={`${basePath}/api/auth`}>
          <html lang="en" className={`${titilliumWeb.variable} font-sans`}>
            <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
              <body>{children}</body>
            </ErrorBoundary>
          </html>
        </SessionProvider>
      </JotaiProvider>
    </ConfigProvider>
  );
}
