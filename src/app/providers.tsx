'use client';

import { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { Provider as JotaiProvider } from 'jotai';
import * as Toast from '@radix-ui/react-toast';

import { basePath } from '@/config';
import commonAntdTheme from '@/theme/antd';
import SessionStateProvider from '@/components/SessionStateProvider';
import ThemeProvider from '@/components/ThemeProvider';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <Toast.Provider swipeDirection="right">
      <ConfigProvider theme={commonAntdTheme}>
        <JotaiProvider>
          <ThemeProvider>
            <SessionProvider basePath={`${basePath}/api/auth`} refetchInterval={5 * 60}>
              <SessionStateProvider>{children}</SessionStateProvider>
            </SessionProvider>
          </ThemeProvider>
        </JotaiProvider>
      </ConfigProvider>
    </Toast.Provider>
  );
}
