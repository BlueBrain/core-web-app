import { Button } from '../Button';
import { VirtualLabPlanDefinition } from '@virtual-lab-create/types';
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
    <div className={classNames(styles.main, className, selected && styles.selected)}>
      <h1>{plan.title}</h1>
      <fieldset>
        <legend>Your advantages</legend>
        <ul>
          {plan.advantages.map((advantage, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`adv-${index}`}>{advantage}</li>
          ))}
        </ul>
      </fieldset>
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
