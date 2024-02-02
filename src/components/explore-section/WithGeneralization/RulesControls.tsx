import { Checkbox, Dropdown, Menu, Tooltip, ConfigProvider } from 'antd';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { rulesAtom, selectedRulesAtom } from '@/state/explore-section/generalization';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import styles from './styles.module.scss';

const theme = {
  components: {
    Checkbox: {
      colorTextDisabled: '#002766',
    },
  },
};

function RulesControls() {
  const { id: resourceId } = useResourceInfoFromPath() ?? { id: '' };

  const [rulesDropdownVisible, setRulesDropdownVisible] = useState<boolean>(false);
  const allRules = useAtomValue(useMemo(() => unwrap(rulesAtom(resourceId)), [resourceId]));

  const [selectedRules, setSelectedRules] = useAtom(
    useMemo(() => unwrap(selectedRulesAtom(resourceId)), [resourceId])
  );

  const onCheckBoxChange = (modelName: string) => {
    if (selectedRules) {
      setSelectedRules(
        selectedRules.includes(modelName)
          ? selectedRules.filter((name) => name !== modelName)
          : [...selectedRules, modelName]
      );
    } else {
      setSelectedRules([modelName]);
    }
    setRulesDropdownVisible(true);
  };

  if (!allRules) return null;

  const menu = (
    <Menu className="fixed right-[-36.5rem] top-0 w-[46rem]">
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
              className="font-semibold text-primary-9"
            >
              {rule.name}
            </Checkbox>
          </Tooltip>
          <p className="ml-7 font-thin text-gray-500">
            <InfoCircleOutlined className="font-thin" /> {rule.description}
          </p>
        </Menu.Item>
      ))}
    </Menu>
  );

  const selectedRulesDropdownContent = (
    <span className="mr-2 font-semibold text-primary-9">
      {selectedRules?.length === 1 ? (
        allRules.find((rule) => rule.modelName === selectedRules[0])?.name
      ) : (
        <>
          <span className="rounded-full bg-primary-9 px-2 text-white">
            {selectedRules?.length ? selectedRules.length : 0}
          </span>{' '}
          similarity rules
        </>
      )}
    </span>
  );

  return (
    <ConfigProvider theme={theme}>
      <div className="relative ml-2">
        <Dropdown
          open={rulesDropdownVisible}
          onOpenChange={(isVisible) => setRulesDropdownVisible(isVisible)}
          overlay={menu}
          trigger={['click']}
          placement="bottomRight"
          className="ml-5	flex max-h-[56px] cursor-pointer items-center justify-between gap-10 rounded-md border border-gray-200 bg-white p-5"
        >
          <span className="flex items-center">
            {selectedRulesDropdownContent}
            <DownOutlined />
          </span>
        </Dropdown>
      </div>
    </ConfigProvider>
  );
}

export default RulesControls;
