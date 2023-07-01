'use client';

/* eslint-disable @typescript-eslint/no-use-before-define */
import { Suspense, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useAtom } from 'jotai';
import { initialRulesAtom } from './state';
import { SynapticAssignementRule } from '@/components/SynapticAssignementRulesTable/types';
import SynapticAssignementRulesTable from '@/components/SynapticAssignementRulesTable';

function ConnectomeModelAssignmentView() {
  const [defaultRules, userRules, setUserRules] = useRules();
  const [rulesTabActive, setRulesTabActive] = useState(true);

  const activeTabClassName =
    'text-primary-8 bg-white inline-flex justify-center items-center font-bold text-primary-8 text-sm';
  const nonActiveTabClassName =
    'text-white bg-black inline-flex justify-center items-center text-sm';

  return (
    <div className="bg-black h-full">
      <div className="text-white overflow-scroll" style={{ height: '40%' }}>
        <h1 className="text-white font-bold p-4">Default synapse model assignments</h1>
        <div className="h-[calc(100%-30px)] p-4 overflow-scroll">
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
            }}
          >
            <SynapticAssignementRulesTable
              rules={defaultRules}
              onRulesChange={() => {}}
              mode="dark"
            />
          </ConfigProvider>
        </div>
      </div>
      <div className="text-white bg-white" style={{ height: '60%' }}>
        <div className="flex" style={{ height: '50px' }}>
          <div className="bg-black inline-block" style={{ height: '50px', width: '30px' }} />
          <button
            type="button"
            className={rulesTabActive ? activeTabClassName : nonActiveTabClassName}
            style={{ height: '50px', width: '300px' }}
            onClick={() => setRulesTabActive(true)}
          >
            User defined synapse model assignments
          </button>
          <button
            type="button"
            className={rulesTabActive ? nonActiveTabClassName : activeTabClassName}
            style={{ height: '50px', width: '300px' }}
            onClick={() => setRulesTabActive(false)}
          >
            Synapse Type editor
          </button>
          <div className="flex-1 bg-black" />
        </div>
        <div className="h-[calc(100%-50px)] p-4 overflow-scroll">
          <SynapticAssignementRulesTable rules={userRules} onRulesChange={setUserRules} editable />
        </div>
      </div>
    </div>
  );
}

export default function ConnectomeModelAssignment() {
  return (
    <Suspense fallback={null}>
      <ConnectomeModelAssignmentView />
    </Suspense>
  );
}

function useRules(): [
  defaultRules: SynapticAssignementRule[],
  userRules: SynapticAssignementRule[],
  setUserRules: (rules: SynapticAssignementRule[]) => void
] {
  const [rules] = useAtom(initialRulesAtom);
  const [defaultRules, setDefaultRules] = useState<SynapticAssignementRule[]>([]);
  const [userRules, setUserRules] = useState<SynapticAssignementRule[]>([]);
  useEffect(() => {
    if (!rules) return;

    setDefaultRules(rules.slice(0, 4));
    setUserRules(rules.slice(4));
  }, [rules]);
  return [defaultRules, userRules, setUserRules];
}
