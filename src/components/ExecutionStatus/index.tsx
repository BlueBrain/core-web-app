import { useState } from 'react';
import { Checkbox } from 'antd';

import StepItem from '@/components/ExecutionStatus/StepItem';
import { statusStructure, StatusStructureItem } from '@/state/build-status';

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
    <div className="text-warning ml-[50px]">
      Be aware that unchecking this option will automatically uncheck &quot;{nextGroup.name}
      &quot;
    </div>
  );
}

export default function ExecutionStatus() {
  const [statusStructureState, setStatusStructureState] =
    useState<StatusStructureItem[]>(statusStructure);

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

  return (
    <>
      {statusStructureState.map((group, index) => (
        <div className="flex flex-col" key={group.name}>
          <div className="flex items-center">
            <Checkbox
              className="w-[20px] h-[20px] justify-self-start"
              checked={group.checked}
              onChange={(e) => handleChecked(group.name, e.target.checked)}
            />
            <div className="text-primary-7 text-2xl ml-[30px]">{group.name}</div>
          </div>

          <UncheckingWarning
            statusStructureState={statusStructureState}
            currentGroup={group}
            currentIndex={index}
          />

          <div className="flex justify-between mt-5 mb-8 ml-[50px]">
            {group.items.map((step) => (
              <div className="w-1/3" key={group.name + step.name}>
                <StepItem name={step.name} statusAtom={step.status} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
