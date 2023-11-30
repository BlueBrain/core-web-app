import { Checkbox, Dropdown, Menu, Tooltip } from 'antd';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import {
  rulesAtom,
  selectedRulesAtom,
  resourceBasedRequestControllerMap,
} from '@/state/explore-section/generalization';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import styles from './styles.module.scss';

function RulesControls() {
  const { id: resourceId } = useResourceInfoFromPath() ?? { id: '' };

  const [rulesDropdownVisible, setRulesDropdownVisible] = useState<boolean>(false);
  const allRules = useAtomValue(useMemo(() => unwrap(rulesAtom(resourceId)), [resourceId]));

  const [selectedRules, setSelectedRules] = useAtom(
    useMemo(() => unwrap(selectedRulesAtom(resourceId)), [resourceId])
  );

  const onCheckBoxChange = (modelName: string) => {
    // this code is used to cancel previous requests to kg inference when more recent changes are made
    if (resourceBasedRequestControllerMap.has(resourceId)) {
      resourceBasedRequestControllerMap.get(resourceId)?.abort('aborting previous request');
      resourceBasedRequestControllerMap.set(resourceId, new AbortController());
    }

    if (selectedRules) {
      setSelectedRules(
        selectedRules.includes(modelName)
          ? selectedRules.filter((name) => name !== modelName)
          : [...selectedRules, modelName]
      );
    } else {
      setSelectedRules([modelName]);
    }
  };

  if (!allRules) return null;

  const menu = (
    <Menu className="w-[46rem] fixed top-0 right-[-36.5rem]">
      {allRules.map((rule) => (
        <Menu.Item key={rule.modelName} className={styles.menuItem}>
          <Tooltip
            title={
              selectedRules && selectedRules.length === 1 && selectedRules.includes(rule.modelName)
                ? 'At least one rule must be selected'
                : undefined
            }
          >
            <Checkbox
              checked={selectedRules && selectedRules.includes(rule.modelName)}
              value={rule.modelName}
              onChange={() => onCheckBoxChange(rule.modelName)}
              disabled={
                selectedRules &&
                selectedRules.length === 1 &&
                selectedRules.includes(rule.modelName)
              }
              className="text-primary-9 font-semibold"
            >
              {rule.name}
            </Checkbox>
          </Tooltip>
          <p className="text-gray-500 font-thin ml-7">
            <InfoCircleOutlined className="font-thin" /> {rule.description}
          </p>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="relative ml-2">
      <Dropdown
        open={rulesDropdownVisible}
        onOpenChange={(isVisible) => setRulesDropdownVisible(isVisible)}
        overlay={menu}
        trigger={['click']}
        placement="bottomRight"
        className="cursor-pointer	ml-5 bg-white flex gap-10 items-center justify-between max-h-[56px] rounded-md p-5 border-gray-200 border"
      >
        <span className="flex items-center">
          <span className="mr-2 text-primary-9 font-semibold">shape</span>
          <DownOutlined />
        </span>
      </Dropdown>
    </div>
  );
}

export default RulesControls;
