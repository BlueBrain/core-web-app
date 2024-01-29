import { useState } from 'react';

import { InputBillingInfo } from './InputBillingInfo';
import { Layout } from '@virtual-lab-create/sub-components/Layout';
import { Main } from '@virtual-lab-create/sub-components/Main';
import { useCurrentVirtualLab } from '@virtual-lab-create/hooks/current-virtual-lab';
import { VIRTUAL_LAB_PLAN_DEFINITIONS } from '@virtual-lab-create/constants';
import { PlanSelectButton } from '@virtual-lab-create/sub-components/PlanSelectButton';

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
