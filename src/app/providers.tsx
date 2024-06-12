'use client';

import { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { Provider as JotaiProvider } from 'jotai';
import { DevTools } from 'jotai-devtools';

import { basePath } from '@/config';
import commonAntdTheme from '@/theme/antd';
import SessionStateProvider from '@/components/SessionStateProvider';
import ThemeProvider from '@/components/ThemeProvider';
import { SessionOrNull } from '@/hooks/session';

type ProvidersProps = {
  children: ReactNode;
  session: SessionOrNull;
};

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <ConfigProvider theme={commonAntdTheme}>
      <JotaiProvider>
        {process.env.NEXT_PUBLIC_JOTAI_DEVTOOLS_ENABLED && (
          <DevTools {...{ isInitialOpen: false }} />
        )}
        <ThemeProvider>
          <SessionProvider basePath={`${basePath}/api/auth`} refetchInterval={2 * 60}>
            <SessionStateProvider session={session}>{children}</SessionStateProvider>
          </SessionProvider>
        </ThemeProvider>
      </JotaiProvider>
    </ConfigProvider>
  );
}
