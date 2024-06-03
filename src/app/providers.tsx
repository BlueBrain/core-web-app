'use client';

import { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { DevTools } from 'jotai-devtools';

import { basePath } from '@/config';
import commonAntdTheme from '@/theme/antd';
import SessionStateProvider from '@/components/SessionStateProvider';
import ThemeProvider from '@/components/ThemeProvider';

type ProvidersProps = {
  children: ReactNode;
};

export const store = createStore();

export default function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider theme={commonAntdTheme}>
      <JotaiProvider>
        <DevTools {...{ isInitialOpen: false }} />
        <ThemeProvider>
          <SessionProvider basePath={`${basePath}/api/auth`} refetchInterval={2 * 60}>
            <SessionStateProvider>{children}</SessionStateProvider>
          </SessionProvider>
        </ThemeProvider>
      </JotaiProvider>
    </ConfigProvider>
  );
}
