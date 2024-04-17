import { Button, Spin } from 'antd';
import { ReactNode, useState } from 'react';
import { classNames } from '@/util/utils';
import { VirtualLab, VirtualLabPlanType } from '@/types/virtual-lab/lab';
import Styles from './plan-panel.module.css';

type PlanDetails = {
  id: number;
  name: VirtualLabPlanType;
  description: ReactNode;
  pricing: { cost: number; currency: string };
};

type Props = {
  currentPlan: number;
  items: PlanDetails[];
  userIsAdmin: boolean;
  onChange: (newPlan: Partial<VirtualLab>) => Promise<void>;
};

function Pricing({ currency, price }: { currency: string; price: number }) {
  return (
    <span className="text-lg">
      {currency}&nbsp;
      <big className="text-3xl font-bold">{price}</big> / month / user
    </span>
  );
}

function PanelHeader({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="mb-4 text-3xl font-bold capitalize">{title}</h2>
      {children}
    </div>
  );
}

function PanelItem({
  children,
  className,
  currency,
  price,
  title,
}: {
  children: ReactNode;
  className: string;
  currency: string;
  price: number;
  title: string;
}) {
  return (
    <div data-testid="plan-details" className={classNames('p-6', className)}>
      <PanelHeader title={title}>
        <Pricing currency={currency} price={price} />
      </PanelHeader>
      {children}
    </div>
  );
}

export default function PlanPanel({ currentPlan, items, userIsAdmin, onChange }: Props) {
  const [savingChanges, setSavingChanges] = useState(false);

  const switchPlan = async (newPlan: number) => {
    setSavingChanges(true);

    return onChange({ plan_id: newPlan }).then(() => setSavingChanges(false));
  };

  if (savingChanges) {
    return <Spin data-testid="saving-changes" />;
  }

  return (
    <div data-testid="plans-collapsible-content" className={Styles.flexWithGap}>
      {items.map((plan) => (
        <PanelItem
          key={plan.id}
          className={
            plan.id === currentPlan
              ? 'bg-primary-8 text-white'
              : 'border border-primary-3 text-white'
          }
          currency={plan.pricing.currency}
          price={plan.pricing.cost}
          title={plan.name}
        >
          <>
            {plan.description}
            {plan.id === currentPlan && <p className="mt-4 font-semibold">Current Selection</p>}
            {userIsAdmin && plan.id !== currentPlan && (
              <Button
                className="mt-4 rounded-none border border-gray-300"
                onClick={() => {
                  switchPlan(plan.id);
                }}
              >
                Select
              </Button>
            )}
          </>
        </PanelItem>
      ))}
    </div>
  );
}
