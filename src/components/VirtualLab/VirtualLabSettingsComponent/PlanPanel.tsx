/* eslint-disable react/no-array-index-key */

'use client';

import { Button, ConfigProvider, Form, Input, Modal, Select, Spin } from 'antd';
import { useState } from 'react';

import { VirtualLab } from '@/services/virtual-lab/types';
import { classNames } from '@/util/utils';

export type Plan = Exclude<VirtualLab['plan'], undefined>;
type Props = {
  currentPlan: Plan;
  billingInfo: VirtualLab['billing'];
  userIsAdmin: boolean;
  onChangePlan: (newPlan: Plan, billingInfo: VirtualLab['billing']) => Promise<void>;
};

type PlanDetails = {
  type: Plan;
  advantages: string[];
  pricePerMonthPerUser: { cost: number; currency: string };
};

export default function PlanPanel({ currentPlan, userIsAdmin, onChangePlan, billingInfo }: Props) {
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

  const onSubmitBillingClick = (plan: Plan) => {
    form.validateFields().then(() => {
      showConfirmationForSwitchingPlan(plan);
    });
  };

  return savingChanges ? (
    <Spin data-testid="Saving changes" />
  ) : (
    <div data-testid="plans-collapsible-content">
      {changePlanError && <p className="text-error">There was an error in switching plans.</p>}

      {PLANS_DETAILS.map((plan) => (
        <div key={plan.type}>
          <div
            data-testid="plan-details"
            className={classNames(
              plan.type === selectedPlan
                ? 'bg-primary-8 text-white'
                : 'border border-primary-3 text-primary-8',
              'mt-6 p-6'
            )}
          >
            <h2 className="mb-4 text-3xl font-bold capitalize">{plan.type}</h2>
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
              /month /user
            </div>
            {contextHolder}

            {plan.type === selectedPlan && <p className="mt-4 font-semibold">Current Selection</p>}

            {userIsAdmin && plan.type !== selectedPlan && plan.type !== currentPlan ? (
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
            ) : null}
          </div>

          {plan.type === selectedPlan && plan.type !== 'entry' && currentPlan !== selectedPlan && (
            <div className="my-3 px-3">
              <h4 className="text-xl font-bold text-primary-8">Billing</h4>
              <p className="text-primary-8">
                We need these information only for your subscription plan billing
              </p>
              <ConfigProvider
                theme={{
                  components: {
                    Form: {
                      labelColor: '#003A8C',
                      labelRequiredMarkColor: '#003A8C',
                      verticalLabelMargin: 0,
                      verticalLabelPadding: 0,
                    },
                    Input: {
                      paddingInline: 0,
                      paddingBlock: 1,
                      colorBorder: 'transparent',
                      hoverBorderColor: 'transparent',
                    },
                    Button: {
                      defaultShadow: 'none',
                    },
                  },
                }}
              >
                <Form
                  form={form}
                  data-testid="billing-form"
                  initialValues={billingInfo}
                  labelCol={{ span: 24 }}
                  className="mt-3 w-fit min-w-[80%]"
                >
                  <div className="flex justify-between">
                    <Form.Item
                      name="firstname"
                      label="First name"
                      rules={[{ required: true }]}
                      className="flex-1 border-b border-gray-200"
                      wrapperCol={{ flex: 1, span: 12 }}
                    >
                      <Input placeholder="Enter your first name..." variant="borderless" />
                    </Form.Item>
                    <Form.Item
                      name="lastname"
                      label="Last name"
                      rules={[{ required: true }]}
                      wrapperCol={{ flex: 1, span: 12 }}
                      className="ml-5 flex-1 border-b border-gray-200"
                    >
                      <Input placeholder="Enter your last name..." variant="borderless" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true }]}
                    className="border-b border-gray-200"
                    wrapperCol={{ flex: 1 }}
                  >
                    <Input placeholder="Enter your address..." variant="borderless" />
                  </Form.Item>

                  <div className="flex justify-between">
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[{ required: true }]}
                      wrapperCol={{ flex: 1, span: 12 }}
                      className="flex-1 border-b border-gray-200"
                    >
                      <Input placeholder="Enter your city..." variant="borderless" />
                    </Form.Item>
                    <Form.Item
                      name="postalCode"
                      label="Postal Code"
                      rules={[{ required: true }]}
                      wrapperCol={{ flex: 1, span: 12 }}
                      className="ml-5 flex-1 border-b border-gray-200"
                    >
                      <Input placeholder="Enter your postal code..." variant="borderless" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[{ required: true }]}
                    className="w-1/2 border-b border-gray-200"
                  >
                    <Select
                      variant="borderless"
                      options={[
                        {
                          label: billingInfo.country,
                          value: billingInfo.country,
                        },
                        {
                          value: 'Ethiopia',
                        },
                        {
                          value: 'Wakanda',
                        },
                        {
                          value: 'Sokovia',
                        },
                        {
                          value: 'Sodor',
                        },
                      ]}
                    />
                  </Form.Item>

                  <Button
                    onClick={() => onSubmitBillingClick(selectedPlan)}
                    className="rounded-none border border-gray-300"
                  >
                    Submit
                  </Button>
                </Form>
              </ConfigProvider>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export const PLANS_DETAILS: PlanDetails[] = [
  {
    type: 'entry',
    advantages: [...Array(3).keys()].map(() => 'Cras mattis consectetur purus sit amet fermentum.'),
    pricePerMonthPerUser: { cost: 0, currency: '$' },
  },
  {
    type: 'beginner',
    advantages: [...Array(6).keys()].map(() => 'Cras mattis consectetur purus sit amet fermentum.'),
    pricePerMonthPerUser: { cost: 40, currency: '$' },
  },
  {
    type: 'intermediate',
    advantages: [...Array(8).keys()].map(() => 'Cras mattis consectetur purus sit amet fermentum.'),
    pricePerMonthPerUser: { cost: 120, currency: '$' },
  },
  {
    type: 'advanced',
    advantages: [...Array(9).keys()].map(() => 'Cras mattis consectetur purus sit amet fermentum.'),
    pricePerMonthPerUser: { cost: 140, currency: '$' },
  },
];
