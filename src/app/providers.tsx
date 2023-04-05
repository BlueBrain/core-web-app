'use client';

import { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import { Provider as JotaiProvider } from 'jotai';
import * as Toast from '@radix-ui/react-toast';

import { basePath } from '@/config';
import commonAntdTheme from '@/theme/antd';
import useTheme from '@/hooks/theme';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  useTheme();

  return (
    <Toast.Provider swipeDirection="right">
      <ConfigProvider theme={commonAntdTheme}>
        <JotaiProvider>
          <SessionProvider basePath={`${basePath}/api/auth`} refetchInterval={5 * 60}>
            {children}
          </SessionProvider>
        </JotaiProvider>
      </ConfigProvider>
    </Toast.Provider>
  );
}
