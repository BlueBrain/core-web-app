import React from 'react';

import { Button } from '../Button';
import { VirtualLabPlanDefinition } from '@/types/virtual-lab/lab';
import { classNames } from '@/util/utils';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';

import styles from './plan-select-button.module.css';

export interface PlanSelectButtonProps {
  className?: string;
  plan: VirtualLabPlanDefinition;
  selected: boolean;
  onSelect(plan: VirtualLabPlanDefinition): void;
}

export function PlanSelectButton({ className, plan, selected, onSelect }: PlanSelectButtonProps) {
  const { setStepTouched } = useModalState();
  const handleClick = () => {
    onSelect(plan);
    setStepTouched(true);
  };
  return (
    <div className={classNames(styles.main, className, selected && styles.selected)} key={plan.id}>
      <h1>{plan.name}</h1>
      {Object.entries(plan.features).map(([category, items]) => (
        <fieldset key={category}>
          <legend>{category}</legend>
          <ul>
            {items.map((item, itemIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </fieldset>
      ))}
      <div className={styles.price}>
        <div>{plan.price > 0 ? `$ ${plan.price}` : 'Free'}</div>
        {plan.price > 0 && <small>/ month / user</small>}
      </div>
      <footer>
        <Button variant="primary" onClick={handleClick}>
          Select
        </Button>
      </footer>
    </div>
  );
}
