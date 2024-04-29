import React from 'react';

import { VirtualLabPlanDefinition } from '../../types';
import { Button } from '../Button';
import { classNames } from '@/util/utils';

import styles from './plan-select-button.module.css';

export interface PlanSelectButtonProps {
  className?: string;
  plan: VirtualLabPlanDefinition;
  selected: boolean;
  onSelect(plan: VirtualLabPlanDefinition): void;
}

export function PlanSelectButton({ className, plan, selected, onSelect }: PlanSelectButtonProps) {
  return (
    <div className={classNames(styles.main, className, selected && styles.selected)} key={plan.id}>
      <h1>{plan.name}</h1>
      {Object.entries(plan.features).map(([category, items]) => (
        <fieldset key={category}>
          <legend>{category}</legend>
          <ul>
            {items.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        </fieldset>
      ))}
      <div className={styles.price}>
        <div>{plan.price > 0 ? `$ ${plan.price}` : 'Free'}</div>
        {plan.price > 0 && <small>/ month / user</small>}
      </div>
      <footer>
        <Button variant="primary" onClick={() => onSelect(plan)}>
          Select
        </Button>
      </footer>
    </div>
  );
}
