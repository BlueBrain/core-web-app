'use client';

import { ReactNode, Suspense } from 'react';
import { ConfigProvider, theme } from 'antd';

type ConnectomeConfigLayoutProps = {
  children: ReactNode;
};

export default function ConnectomeConfigLayout({ children }: ConnectomeConfigLayoutProps) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Select: {
            borderRadius: 0,
          },
          Tabs: {
            colorPrimary: 'white',
          },
        },
      }}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </ConfigProvider>
  );
}
