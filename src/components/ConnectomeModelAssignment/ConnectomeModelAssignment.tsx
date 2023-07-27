'use client';

import { useState } from 'react';
import { EyeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';

import AddRuleModal from './AddRuleModal';
import RulesFilters from './RulesFilters';
import Filter from './RulesFilters/filter';
import { useDefaultRules, useFetchRules, useSetRules } from './hooks';
import SynapticAssignmentRulesTable from './SynapticAssignmentRulesTable';
import { loadingAtom } from './state';
import { classNames } from '@/util/utils';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import styles from './connectome-model-assignment.module.scss';

const ACTIVE_TAB_CLASSNAME =
  'text-primary-8 bg-white inline-flex justify-center items-center font-bold text-primary-8 text-sm';
const INACTIVE_TAB_CLASSNAME =
  'text-white bg-black inline-flex justify-center items-center text-sm';

export default function ConnectomeModelAssignmentView() {
  const [addRuleModalOpen, setAddRuleModalOpen] = useState(false);
  const userRules = useFetchRules();
  const defaultRules = useDefaultRules();
  const setUserRules = useSetRules();
  const [userRulesFilter, setUserRulesFilter] = useState(new Filter([]));
  const [rulesTabActive, setRulesTabActive] = useState(true);
  const [loading] = useAtom(loadingAtom);

  return (
    <>
      <div className="bg-black mr-7 flex flex-col relative">
        <div className="text-white flex-initial">
          <h1 className="text-white font-bold p-4">Default synapse model assignments</h1>
          <div style={{ width: '90%' }}>
            <div className="w-1/2 flex justify-between" style={{ marginLeft: 16 }}>
              <div>From ⭢</div>
              <div>⭢ To</div>
            </div>
          </div>
          <div className="h-[calc(100%-30px)] p-4 overflow-scroll">
            <SynapticAssignmentRulesTable
              className={styles.table}
              rules={defaultRules}
              onRulesChange={() => {}}
              mode="dark"
            />
          </div>
        </div>
        <div className="text-white bg-white flex-auto">
          <div className="flex" style={{ height: '50px' }}>
            <div className="bg-black inline-block" style={{ height: '50px', width: '30px' }} />
            <button
              type="button"
              className={rulesTabActive ? ACTIVE_TAB_CLASSNAME : INACTIVE_TAB_CLASSNAME}
              style={{ height: '50px', width: '250px' }}
              onClick={() => setRulesTabActive(true)}
            >
              User defined synapse model assignments
            </button>
            <button
              type="button"
              className={rulesTabActive ? INACTIVE_TAB_CLASSNAME : ACTIVE_TAB_CLASSNAME}
              style={{ height: '50px', width: '150px' }}
              onClick={() => setRulesTabActive(false)}
            >
              Synapse Type editor
            </button>
            <div className="flex-1 bg-black" />
          </div>
          <div className="h-[calc(100%-50px)] p-4 pb-20 overflow-scroll">
            {rulesTabActive && (
              <>
                <RulesFilters rules={userRules} onFilterChange={setUserRulesFilter} />
                <div className="text-primary-8 mb-5" style={{ width: '90%' }}>
                  <div className="w-1/2 flex justify-between" style={{ marginLeft: 8 }}>
                    <div>From ⭢</div>
                    <div>⭢ To</div>
                  </div>
                </div>
                <SynapticAssignmentRulesTable
                  className={styles.table}
                  rules={userRules}
                  filter={userRulesFilter.exec}
                  onRulesChange={setUserRules}
                  editable
                />
              </>
            )}
          </div>
        </div>
        <div className="fixed" style={{ right: 35, bottom: 8 }}>
          <button
            type="button"
            className={classNames(styles.button, 'bg-primary-8')}
            onClick={() => setAddRuleModalOpen(true)}
            disabled={loading}
          >
            {!loading && <PlusOutlined />}
            {loading && <LoadingOutlined />}
            &nbsp;&nbsp;Add synapse assignment rule
          </button>
          <button type="button" className={classNames(styles.button, 'bg-black')}>
            <EyeOutlined />
            &nbsp;&nbsp;Preview on Matrix
          </button>
        </div>
      </div>
      <AddRuleModal
        open={addRuleModalOpen}
        onValidate={(rule: SynapticAssignmentRule) => {
          setAddRuleModalOpen(false);
          setUserRules([...userRules, rule]);
        }}
        onCancel={() => setAddRuleModalOpen(false)}
      />
    </>
  );
}
