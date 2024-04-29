import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { Layout } from '../../sub-components/Layout';
import { Main } from '../../sub-components/Main';
import { useCurrentVirtualLab } from '../../hooks/current-virtual-lab';
import { PlanSelectButton } from '../../sub-components/PlanSelectButton';
import { InputBillingInfo } from './InputBillingInfo';
import { virtualLabPlansAtom } from '@/state/virtual-lab/lab';

export interface VirtualLabCreatePlanProps {
  className?: string;
  onNext: () => void;
}

export function VirtualLabCreatePlan({ className, onNext }: VirtualLabCreatePlanProps) {
  const [lab, updateLab] = useCurrentVirtualLab();
  const [billingValid, setBillingValid] = useState(false);
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
      <Main canGoNext={lab.plan_id !== null || billingValid} step="plan" onNext={onNext}>
        <h2>Plan</h2>
        {virtualLabPlans?.map((plan) => (
          <PlanSelectButton
            key={plan.id}
            plan={plan}
            selected={lab.plan_id === plan.id}
            onSelect={() => updateLab({ plan_id: plan.id })}
          />
        ))}
        {lab.plan_id && <InputBillingInfo onValidityChange={setBillingValid} />}
      </Main>
    </Layout>
  );
}
