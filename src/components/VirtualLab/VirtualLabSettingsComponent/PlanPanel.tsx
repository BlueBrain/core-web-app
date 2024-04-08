/* eslint-disable react/no-array-index-key */

import { Button, Form, Modal, Spin } from 'antd';
import { useState } from 'react';

import { VirtualLab } from '@/services/virtual-lab/types';
import { classNames } from '@/util/utils';

import Styles from './plan-panel.module.css';

export type Plan = Exclude<VirtualLab['plan'], undefined>;

type PlanDetails = {
  type: Plan;
  advantages: string[];
  pricePerMonthPerUser: { cost: number; currency: string };
  className?: string;
};

type Props = {
  currentPlan: Plan;
  billingInfo: VirtualLab['billing'];
  items: PlanDetails[];
  userIsAdmin: boolean;
  onChangePlan: (newPlan: Plan, billingInfo: VirtualLab['billing']) => Promise<void>;
};

export default function PlanPanel({
  currentPlan,
  items,
  userIsAdmin,
  onChangePlan,
  billingInfo,
}: Props) {
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm<VirtualLab['billing']>();

  const [selectedPlan, setSelectedPlan] = useState<Plan>(currentPlan);
  const [changePlanError, setChangePlanError] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

  const showConfirmationForSwitchingPlan = (newPlan: Plan) => {
    modal.confirm({
      content: `Are you sure you want to switch from ${currentPlan} to ${newPlan} plan?`,
      okText: 'Confirm',
      onOk: () => {
        switchPlan(newPlan);
      },
    });
  };

  const switchPlan = (newPlan: Plan) => {
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
          <h2 className="mb-4 text-3xl font-bold capitalize">{plan.type}</h2>

          <div>
            <h6 className="text-sm text-primary-3">Your advantages</h6>
            <ul className="columns-3 px-5 py-3">
              {plan.advantages.map((advantage, index) => (
                <li key={index} className="list-disc font-semibold">
                  {advantage}
                </li>
              ))}
            </ul>
            <div
              className={classNames(
                'border-b border-t py-3',
                plan.type === selectedPlan ? 'border-primary-6' : 'border-gray-200'
              )}
            >
              <span className="text-3xl font-bold">
                {plan.pricePerMonthPerUser.currency} {plan.pricePerMonthPerUser.cost}
              </span>{' '}
              / month /user
            </div>
            {contextHolder}

            {plan.type === selectedPlan && <p className="mt-4 font-semibold">Current Selection</p>}
          </div>

          {userIsAdmin && plan.type !== selectedPlan && plan.type !== currentPlan && (
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
          )}
        </div>
      ))}
    </div>
  );
}
