'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ConfigProvider, theme } from 'antd';

const ConnectomeConfigurationView = dynamic(() => import('./ConnectomeConfigurationView'), {
  ssr: false,
});

export default function ConfigurationPage() {
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
      <Suspense fallback={null}>
        <ConnectomeConfigurationView />
      </Suspense>
    </ConfigProvider>
  );
}
