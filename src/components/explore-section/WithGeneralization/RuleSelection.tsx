import { useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Select } from 'antd';
import { rulesAtom, selectedRulesAtom } from '@/state/explore-section/generalization';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import styles from './styles.module.scss';

const { Option } = Select;

function RuleSelection() {
  const { id: resourceId } = useResourceInfoFromPath() ?? { id: '' };

  const allRules = useAtomValue(useMemo(() => unwrap(rulesAtom(resourceId)), [resourceId]));
  const [selectedRules, setSelectedRules] = useAtom(
    useMemo(() => unwrap(selectedRulesAtom(resourceId)), [resourceId])
  );

  const [showTitles, setShowTitles] = useState(true);

  if (!allRules || allRules.length < 1) return null;

  return (
    <div className="flex">
      <div className={styles.label}>
        Here are the 6 most similar morphologies according to the rules:
      </div>
      <div className="flex-1 ml-2">
        <Select
          mode="multiple"
          className="w-full"
          value={selectedRules}
          maxTagCount="responsive"
          onChange={setSelectedRules}
          onDropdownVisibleChange={(visible) => setShowTitles(!visible)}
        >
          {allRules?.map((rule) => (
            <Option key={rule.modelName} value={rule.modelName}>
              <div className="bg-white text-primary-9">
                {showTitles ? (
                  <div className="title">{rule.name}</div>
                ) : (
                  <div className="title whitespace-normal h-fit">
                    <h1 className="pl-2">{rule.name}</h1>
                    <p className="pl-5 font-thin text-gray-500">{rule.description}</p>
                  </div>
                )}
              </div>
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export default RuleSelection;
