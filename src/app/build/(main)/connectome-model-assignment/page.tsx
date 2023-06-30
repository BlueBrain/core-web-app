'use client';

import { Suspense } from 'react';
import { ConfigProvider, theme } from 'antd';
// import { useAtomValue } from 'jotai';
// import { initialRulesAtom } from './state';
// import { SynapticRule } from './types';
// import RightHemisphere from '@/components/right-hemisphere';
// import LeftHemisphere from '@/components/left-hemisphere';

function ConnectomeModelAssignmentView() {
  return (
    <div className="bg-black h-full">
      <div className="text-white p-8" style={{ height: '40%' }}>
        <h1 className="text-white font-bold">Default synapse model assignments</h1>
      </div>
      <div className="text-white bg-white" style={{ height: '60%' }}>
        <div className="flex" style={{ height: '50px' }}>
          <div className="bg-black inline-block" style={{ height: '50px', width: '30px' }} />
          <div
            className="text-primary-8 bg-white inline-flex justify-center items-center font-bold text-primary-8 text-sm"
            style={{ height: '50px', width: '300px' }}
          >
            User defined synapse model assignments
          </div>
          <div
            className="text-white bg-black inline-flex justify-center items-center text-sm"
            style={{ height: '50px', width: '300px' }}
          >
            Synapse Type editor
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConnectomeModelAssignment() {
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
        <ConnectomeModelAssignmentView />
      </Suspense>
    </ConfigProvider>
  );
}
