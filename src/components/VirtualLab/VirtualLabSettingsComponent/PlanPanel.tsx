import { Button, Form, Modal, Spin } from 'antd';
import { ReactNode, useState } from 'react';
import { classNames } from '@/util/utils';
import { MockBilling, VirtualLabPlanType } from '@/types/virtual-lab/lab';
import Styles from './plan-panel.module.css';

type PlanDetails = {
  type: VirtualLabPlanType;
  description: ReactNode;
  pricing: { cost: number; currency: string };
  className?: string;
};

type Props = {
  currentPlan: VirtualLabPlanType;
  billingInfo: MockBilling;
  items: PlanDetails[];
  userIsAdmin: boolean;
  onChangePlan: (newPlan: VirtualLabPlanType, billingInfo: MockBilling) => Promise<void>;
};

export default function PlanPanel({
  currentPlan,
  items,
  userIsAdmin,
  onChangePlan,
  billingInfo,
}: Props) {
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm<MockBilling>();

  const [selectedPlan, setSelectedPlan] = useState<VirtualLabPlanType>(currentPlan);
  const [changePlanError, setChangePlanError] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

  const showConfirmationForSwitchingPlan = (newPlan: VirtualLabPlanType) => {
    modal.confirm({
      content: `Are you sure you want to switch from ${currentPlan} to ${newPlan} plan?`,
      okText: 'Confirm',
      onOk: () => {
        switchPlan(newPlan);
      },
    });
  };

  const switchPlan = (newPlan: VirtualLabPlanType) => {
    setSavingChanges(true);
    const updatedBilling = newPlan === 'entry' ? billingInfo : form.getFieldsValue();

    onChangePlan(newPlan, updatedBilling)
      .then(() => {
        setChangePlanError(false);
      })
      .catch(() => {
        setChangePlanError(true);
      })
      .finally(() => {
        setSavingChanges(false);
      });
  };

  if (changePlanError) {
    return <p className="text-error">There was an error in switching plans.</p>;
  }

  if (savingChanges) {
    return <Spin data-testid="saving-changes" />;
  }

  return (
    <div data-testid="plans-collapsible-content" className={Styles.flexWithGap}>
      {items.map((plan) => (
        <div
          data-testid="plan-details"
          className={classNames(
            'p-6',
            plan.type === selectedPlan
              ? 'bg-primary-8 text-white'
              : 'border border-primary-3 text-white',
            plan.className
          )}
          key={plan.type}
        >
          <div className="flex items-baseline justify-between">
            <h2 className="mb-4 text-3xl font-bold capitalize">{plan.type}</h2>
            <span className="text-lg">
              {plan.pricing.currency}&nbsp;
              <big className="text-3xl font-bold">{plan.pricing.cost}</big> / month / user
            </span>
          </div>
          <div>
            {plan.description}
            {plan.type === selectedPlan && <p className="mt-4 font-semibold">Current Selection</p>}
          </div>
          {userIsAdmin && plan.type !== selectedPlan && plan.type !== currentPlan && (
            <>
              {contextHolder}
              <Button
                className="mt-4 rounded-none border border-gray-300"
                onClick={() => {
                  setSelectedPlan(plan.type);

                  if (plan.type === 'entry') {
                    showConfirmationForSwitchingPlan(plan.type);
                  }
                }}
              >
                Select
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
