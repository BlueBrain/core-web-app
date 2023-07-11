'use client';

import { useState } from 'react';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';

import AddRuleModal from './AddRuleModal';
import RulesFilters from './RulesFilters';
import Filter from './RulesFilters/filter';
import { useRules } from './hooks';
import SynapticAssignmentRulesTable from './SynapticAssignmentRulesTable';
import { classNames } from '@/util/utils';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import styles from './connectome-model-assignment.module.scss';

const ACTIVE_TAB_CLASSNAME =
  'text-primary-8 bg-white inline-flex justify-center items-center font-bold text-primary-8 text-sm';
const INACTIVE_TAB_CLASSNAME =
  'text-white bg-black inline-flex justify-center items-center text-sm';

export default function ConnectomeModelAssignmentView() {
  const [addRuleModalOpen, setAddRuleModalOpen] = useState(false);
  const [defaultRules, userRules, setUserRules] = useRules();
  const [userRulesFilter, setUserRulesFilter] = useState(new Filter([]));
  const [rulesTabActive, setRulesTabActive] = useState(true);
  return (
    <>
      <div className="bg-black mr-7 flex flex-col relative">
        <div className="text-white flex-initial">
          <h1 className="text-white font-bold p-4">Default synapse model assignments</h1>
          <div className="h-[calc(100%-30px)] p-4 overflow-scroll">
            <SynapticAssignmentRulesTable
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
              style={{ height: '50px', width: '300px' }}
              onClick={() => setRulesTabActive(true)}
            >
              User defined synapse model assignments
            </button>
            <button
              type="button"
              className={rulesTabActive ? INACTIVE_TAB_CLASSNAME : ACTIVE_TAB_CLASSNAME}
              style={{ height: '50px', width: '300px' }}
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
                <SynapticAssignmentRulesTable
                  rules={userRules}
                  filter={userRulesFilter.exec}
                  onRulesChange={setUserRules}
                  editable
                />
              </>
            )}
          </div>
        </div>
        <div className="absolute right-4" style={{ bottom: '.5em' }}>
          <button
            type="button"
            className={classNames(styles.button, 'bg-primary-8')}
            onClick={() => setAddRuleModalOpen(true)}
          >
            <PlusOutlined />
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
