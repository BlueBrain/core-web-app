'use client';

import { ReactNode } from 'react';
import { Titillium_Web } from '@next/font/google';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { Provider as JotaiProvider } from 'jotai/react';
import { ErrorBoundary } from 'react-error-boundary';
import * as Toast from '@radix-ui/react-toast';
import commonAntdTheme from '@/theme/antd';
import useTheme from '@/hooks/theme';
import { basePath } from '@/config';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import '@/styles/globals.scss';
import NotificationProvider from '@/components/NotificationProvider';
import Feedback from '@/components/Feedback';

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
    <Toast.Provider swipeDirection="right">
      <ConfigProvider theme={commonAntdTheme}>
        <JotaiProvider>
          <SessionProvider basePath={`${basePath}/api/auth`} refetchInterval={5 * 60}>
            <html lang="en" className={`${titilliumWeb.variable} font-sans`}>
              <body>
                <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>

                <Feedback />

                <NotificationProvider />
              </body>
            </html>
          </SessionProvider>
        </JotaiProvider>
      </ConfigProvider>
    </Toast.Provider>
  );
}
