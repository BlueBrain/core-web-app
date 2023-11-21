import { useState } from 'react';

import { Layout } from '../../sub-components/Layout';
import { Main } from '../../sub-components/Main';
import { useCurrentVirtualLab } from '../../hooks/current-virtual-lab';
import { VIRTUAL_LAB_PLAN_DEFINITIONS } from '../../constants';
import { PlanSelectButton } from '../../sub-components/PlanSelectButton';
import { InputBillingInfo } from './InputBillingInfo';

export interface VirtualLabCreatePlanProps {
  className?: string;
  nextPage: string;
}

export function VirtualLabCreatePlan({ className, nextPage }: VirtualLabCreatePlanProps) {
  const [lab, updateLab] = useCurrentVirtualLab();
  const [billingValid, setBillingValid] = useState(false);
  return (
    <Layout className={className}>
      <Main nextPage={nextPage} canGoNext={lab.plan === 'entry' || billingValid} step="plan">
        <h2>Plan</h2>
        {VIRTUAL_LAB_PLAN_DEFINITIONS.map((plan) => (
          <PlanSelectButton
            key={plan.type}
            plan={plan}
            selected={lab.plan === plan.type}
            onSelect={(selection) => updateLab({ plan: selection.type })}
          />
        ))}
        {lab.plan && <InputBillingInfo onValidityChange={setBillingValid} />}
      </Main>
    </Layout>
  );
}
