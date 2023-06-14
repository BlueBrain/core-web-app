'use client';

import { Suspense } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useAtomValue } from 'jotai';
import { initialRulesAtom } from './state';
import { SynapticRule } from './types';
import RightHemisphere from '@/components/right-hemisphere';
import LeftHemisphere from '@/components/left-hemisphere';

function SynapticRuleItem({ ruleDef }: { ruleDef: SynapticRule }) {
  const from = ruleDef.fromSClass || ruleDef.fromMType || '-';
  const to = ruleDef.toSClass || ruleDef.toMType || '-';

  return (
    <div className="text-white flex justify-between">
      <div className="inline-flex justify-between" style={{ minWidth: 200 }}>
        <div className="inline-block" style={{ minWidth: 100 }}>
          {from}
        </div>
        {ruleDef.fromRegion !== null && <span>{ruleDef.toRegion}</span>}
        {ruleDef.fromHemisphere === 'left' && <LeftHemisphere />}
        {ruleDef.fromHemisphere === 'right' && <RightHemisphere />}
      </div>
      <span>➜</span>
      <div className="inline-flex justify-between" style={{ minWidth: 200 }}>
        <div className="inline-block" style={{ minWidth: 100 }}>
          {to}
        </div>
        {ruleDef.toRegion !== null && <span>{ruleDef.toRegion}</span>}
        {ruleDef.toHemisphere === 'left' && <LeftHemisphere />}
        {ruleDef.toHemisphere === 'right' && <RightHemisphere />}
      </div>
    </div>
  );
}

function ConnectomeModelAssignmentView() {
  const initialRules = useAtomValue(initialRulesAtom);

  return (
    <div className="p-4 bg-black h-full overflow-scroll">
      <h1 className="text-white text-xl p-4 font-bold">Synapse Assignment Rules</h1>
      <div className="mt-4 w-1/2">
        {initialRules?.map((r, i) => (
          <SynapticRuleItem ruleDef={r} key={i} />
        ))}
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
