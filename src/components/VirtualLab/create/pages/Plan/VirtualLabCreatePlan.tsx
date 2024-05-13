import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { Layout } from '@/components/VirtualLab/create/sub-components/Layout';
import { Main } from '@/components/VirtualLab/create/sub-components/Main';
import { useCurrentVirtualLab } from '@/components/VirtualLab/create/hooks/current-virtual-lab';
import { PlanSelectButton } from '@/components/VirtualLab/create/sub-components/PlanSelectButton';
import { virtualLabPlansAtom } from '@/state/virtual-lab/lab';

export interface VirtualLabCreatePlanProps {
  className?: string;
}

export function VirtualLabCreatePlan({ className }: VirtualLabCreatePlanProps) {
  const [lab, updateLab] = useCurrentVirtualLab();
  const [billingValid, ] = useState(false);
  const virtualLabPlansLoadable = useAtomValue(loadable(virtualLabPlansAtom));

  if (virtualLabPlansLoadable.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  if (virtualLabPlansLoadable.state === 'hasError') {
    return <div>{JSON.stringify(virtualLabPlansLoadable.error)}</div>;
  }

  const virtualLabPlans = virtualLabPlansLoadable.data;

  return (
    <Layout className={className}>
      <Main canGoNext={lab.plan_id !== null || billingValid} step="plan">
        <h2>Plan</h2>
        {virtualLabPlans?.map((plan) => (
          <PlanSelectButton
            key={plan.id}
            plan={plan}
            selected={lab.plan_id === plan.id}
            onSelect={() => updateLab({ plan_id: plan.id })}
          />
        ))}
      </Main>
    </Layout>
  );
}
