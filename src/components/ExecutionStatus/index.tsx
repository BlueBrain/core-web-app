import { Suspense, useEffect, useState } from 'react';
import { Checkbox, Spin } from 'antd';

import { useSetAtom } from 'jotai';
import StepItem from '@/components/ExecutionStatus/StepItem';
import {
  statusStructure,
  StatusStructureItem,
  targetConfigToBuildAtom,
} from '@/state/build-status';

type UncheckingWarningProps = {
  statusStructureState: StatusStructureItem[];
  currentGroup: StatusStructureItem;
  currentIndex: number;
};

function UncheckingWarning({
  statusStructureState,
  currentGroup,
  currentIndex,
}: UncheckingWarningProps) {
  if (!currentGroup.checked) return null;

  const nextGroup = statusStructureState[currentIndex + 1];
  if (!nextGroup) return null;
  if (!nextGroup.checked) return null;

  return (
    <div className="ml-[50px] text-warning">
      Be aware that unchecking this option will automatically uncheck &quot;{nextGroup.name}
      &quot;
    </div>
  );
}

export default function ExecutionStatus() {
  const [statusStructureState, setStatusStructureState] =
    useState<StatusStructureItem[]>(statusStructure);

  const setTargetConfigToBuild = useSetAtom(targetConfigToBuildAtom);

  const handleChecked = (groupName: string, newCheckedValue: boolean) => {
    setStatusStructureState((groups) => {
      const groupIdx = groups.findIndex((group) => group.name === groupName);

      return groups.map((group, idx) => {
        const checkedIfNotCurrent =
          idx < groupIdx
            ? group.checked || newCheckedValue // when checking: check previous steps, otherwise - do nothing
            : group.checked && newCheckedValue; // when checking: do not modify next steps, otherwise - uncheck

        return {
          ...group,
          checked: idx === groupIdx ? newCheckedValue : checkedIfNotCurrent,
        };
      });
    });
  };

  useEffect(() => {
    const lastChecked = statusStructureState.findLast((step) => step.checked);
    setTargetConfigToBuild(lastChecked?.targetConfigName || null);
  }, [statusStructureState, setTargetConfigToBuild]);

  return (
    <>
      {statusStructureState.map((group, index) => (
        <div className="flex flex-col" key={group.name}>
          <div className="flex items-center">
            <Checkbox
              className="h-[20px] w-[20px] justify-self-start"
              checked={group.checked}
              onChange={(e) => handleChecked(group.name, e.target.checked)}
            />
            <div className="ml-[30px] text-2xl text-primary-7">{group.name}</div>
          </div>

          <UncheckingWarning
            statusStructureState={statusStructureState}
            currentGroup={group}
            currentIndex={index}
          />

          <div className="mb-8 ml-[50px] mt-5 flex justify-between">
            {group.items.map((step) => (
              <div className="w-1/3" key={group.name + step.name}>
                <Suspense fallback={<Spin size="small" className="h-8" />}>
                  <StepItem name={step.name} statusAtom={step.statusAtom} />
                </Suspense>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
