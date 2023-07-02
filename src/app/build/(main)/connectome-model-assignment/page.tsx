'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { DownCircleTwoTone, DownOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { initialRulesAtom } from './state';
import { SynapticAssignementRule } from '@/components/SynapticAssignementRulesTable/types';
import SynapticAssignementRulesTable from '@/components/SynapticAssignementRulesTable';
import { classNames } from '@/util/utils';
import styles from './connectome-model-assignment.module.scss';
import { SettingsIcon } from '@/components/icons';
import { Select } from 'antd';
import { useGetFieldsOptions } from '@/components/SynapticAssignementRulesTable/hooks/get-fields-options';

function ConnectomeModelAssignmentView() {
  const [defaultRules, userRules, setUserRules] = useRules();
  const [rulesTabActive, setRulesTabActive] = useState(true);

  const getFieldsOptions = useGetFieldsOptions();

  const [filters, setFilters] = useState<{ col: string; value: string }[]>([
    { col: '', value: '' },
  ]);

  const filteredUserRules = useMemo(
    () =>
      userRules.filter((r) => {
        for (const filter of filters) {
          if (!filter.col || !filter.value) continue;
          if (r[filter.col] !== filter.value) return false;
        }
        return true;
      }),
    [userRules, filters]
  );

  const cols = useMemo(() => {
    if (!defaultRules[0]) return new Set();
    const selectedCols = filters.filter((f) => f.col !== '');
    return Object.keys(defaultRules[0]).filter((v) => !selectedCols.map((c) => c.col).includes(v));
  }, [defaultRules, filters]);

  const activeTabClassName =
    'text-primary-8 bg-white inline-flex justify-center items-center font-bold text-primary-8 text-sm';
  const nonActiveTabClassName =
    'text-white bg-black inline-flex justify-center items-center text-sm';

  return (
    <div className="bg-black h-full mr-7">
      <div className="text-white" style={{ height: '40%' }}>
        <h1 className="text-white font-bold p-4">Default synapse model assignments</h1>
        <div className="h-[calc(100%-30px)] p-4 overflow-scroll">
          <SynapticAssignementRulesTable
            rules={defaultRules}
            onRulesChange={() => {}}
            mode="dark"
          />
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
          {rulesTabActive && (
            <>
              <div className="mb-1 flex text-primary-8 w-full justify-between">
                <div className="flex">
                  <SettingsIcon
                    className="rotate-90 inline-block "
                    style={{ width: 12, height: 12 }}
                  />
                  <div className="-mt-1 ml-1 text-sm">Filter</div>
                </div>
                <div>
                  <div className="text-sm inline-block">
                    Total: {filteredUserRules.length} rules
                  </div>
                  <DownOutlined className="text-xs ml-2" />
                </div>
              </div>
              <div className="flex text-primary-8 text-sm mb-2">
                <div className="text-xs">Show me pathways with</div>
                {filters.map((f, i) => (
                  <div key={i}>
                    <Select
                      style={{ width: 120 }}
                      onChange={(value) =>
                        setFilters([
                          ...filters.slice(0, i),
                          { col: value, value: '' },
                          ...filters.slice(i, filters.length - 1),
                        ])
                      }
                      options={Array.from(cols).map((col) => ({ value: col, label: col }))}
                    />
                    {!!f.col && (
                      <Select
                        style={{ width: 120 }}
                        showSearch
                        onChange={(value) =>
                          setFilters([
                            ...filters.slice(0, i),
                            { col: f.col, value },
                            ...filters.slice(i, filters.length - 1),
                          ])
                        }
                        options={getFieldsOptions(f.col).map((opt) => ({
                          value: opt,
                          label: opt,
                        }))}
                      />
                    )}
                  </div>
                ))}

                {filters.every((f) => f.col && f.value) && (
                  <button
                    type="button"
                    onClick={() => setFilters([...filters, { col: '', value: '' }])}
                  >
                    Add new filter
                  </button>
                )}
                {filters.length >= 2 && (
                  <button
                    type="button"
                    onClick={() => setFilters(filters.slice(0, filters.length - 1))}
                  >
                    Remove filter
                  </button>
                )}
              </div>

              <SynapticAssignementRulesTable
                rules={filteredUserRules}
                onRulesChange={setUserRules}
                editable
              />
            </>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <button type="button" className={classNames(styles.button, 'bg-primary-8')}>
          <PlusOutlined />
          &nbsp;&nbsp;Add pathway
        </button>
        <button type="button" className={classNames(styles.button, 'bg-black')}>
          <EyeOutlined />
          &nbsp;&nbsp;Preview on Matrix
        </button>
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
