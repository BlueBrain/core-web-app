import { Dispatch, SetStateAction } from 'react';
import { Button, Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { LoadingOutlined } from '@ant-design/icons';

import { Step, VirtualLabWithOptionalId } from './types';
import { virtualLabPlansAtom } from '@/state/virtual-lab/lab';
import { VirtualLabPlanDefinition } from '@/types/virtual-lab/lab';
import { classNames } from '@/util/utils';

type PlanFormProps = {
  currentVirtualLab: VirtualLabWithOptionalId;
  setVirtualLabFn: Dispatch<SetStateAction<VirtualLabWithOptionalId>>;
  closeModalFn: () => void;
  setStepFn: Dispatch<SetStateAction<Step>>;
};

export type PlanPanelProps = {
  plan: VirtualLabPlanDefinition;
  selected: boolean;
  onSelect(plan: VirtualLabPlanDefinition): void;
};

export function PlanPanel({ plan, selected, onSelect }: PlanPanelProps) {
  const handleClick = () => {
    onSelect(plan);
  };
  return (
    <div
      className={classNames(
        'my-4 border p-4',
        'border-primary-5',
        selected && 'bg-primary-8 text-neutral-1',
        selected && 'selected-footer:hidden'
      )}
      key={plan.id}
    >
      <h1 className="mb-3 text-2xl font-bold">{plan.name}</h1>
      {Object.entries(plan.features).map(([category, items]) => (
        <fieldset key={category}>
          <legend className="text-sm font-bold text-primary-4">{category}</legend>
          <ul className="flex flex-wrap items-start justify-start gap-x-8 pl-4">
            {items.map((item, itemIndex) => (
              <li
                // eslint-disable-next-line react/no-array-index-key
                key={itemIndex}
                className="min-w-[240px] max-w-[380px] flex-1 list-inside list-disc"
              >
                {item}
              </li>
            ))}
          </ul>
        </fieldset>
      ))}
      <div className="my-6 flex items-baseline justify-start gap-4 border-b border-t border-primary-7 py-2">
        <div className="text-2xl font-extrabold">{plan.price > 0 ? `$ ${plan.price}` : 'Free'}</div>
        {plan.price > 0 && <small className="text-base">/ month / user</small>}
      </div>
      <footer>
        {!selected && (
          <Button
            type="primary"
            className="min-w-36 rounded-none bg-primary-8"
            onClick={handleClick}
          >
            Select
          </Button>
        )}
      </footer>
    </div>
  );
}

export default function PlanForm({
  currentVirtualLab,
  setVirtualLabFn,
  closeModalFn,
  setStepFn,
}: PlanFormProps) {
  const virtualLabPlansLoadable = useAtomValue(loadable(virtualLabPlansAtom));

  if (virtualLabPlansLoadable.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  if (virtualLabPlansLoadable.state === 'hasError') {
    return <div>{JSON.stringify(virtualLabPlansLoadable.error)}</div>;
  }

  const virtualLabPlans = virtualLabPlansLoadable.data;

  return (
    <div>
      {virtualLabPlans?.map((plan) => (
        <PlanPanel
          key={plan.id}
          plan={plan}
          selected={currentVirtualLab.plan_id === plan.id}
          onSelect={(selectedPlan) =>
            setVirtualLabFn((currentVl) => ({ ...currentVl, plan_id: selectedPlan.id }))
          }
        />
      ))}
      <div className="flex flex-row justify-end gap-2">
        <Button type="text" className="min-w-36 text-primary-8" onClick={() => closeModalFn()}>
          Cancel
        </Button>
        <Button
          className="min-w-36 rounded-none border-primary-8 text-primary-8"
          onClick={() => setStepFn('Members')}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
