'use client';

import type { InputProps } from 'antd/lib/input/Input';
import type { TextAreaProps } from 'antd/lib/input/TextArea';
import { Button, Collapse, ConfigProvider, Input, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ReactNode, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { AdminPanelProjectList } from '../projects/VirtualLabProjectList';
import ComputeTimeVisualization from './ComputeTimeVisualization';
import FormPanel from './InformationPanel';
import PlanPanel from './PlanPanel';
import DangerZonePanel from './DangerZonePanel';
import { VALID_EMAIL_REGEXP } from '@/util/utils';
import { VirtualLab, VirtualLabPlanType } from '@/types/virtual-lab/lab';

import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';

type Props = {
  id: string;
};

function HeaderPanel({ virtualLab }: { virtualLab: VirtualLab }) {
  return (
    <div className="bg-primary-8">
      <div className="border border-transparent border-b-primary-7 px-8 py-4">
        <h6>Virtual lab</h6>
        <h3 className="text-3xl font-bold leading-10" data-testid="virtual-lab-name">
          {virtualLab.name}
        </h3>
      </div>
      <div className="px-8 py-4">
        <h5 className="font-bold">Compute hours current usage</h5>
        <ComputeTimeVisualization usedTimeInHours={50} totalTimeInHours={100} />
      </div>
    </div>
  );
}

function ExpandIcon({ isActive }: { isActive?: boolean }) {
  return isActive ? (
    <MinusOutlined style={{ fontSize: '14px' }} />
  ) : (
    <PlusOutlined style={{ fontSize: '14px' }} />
  );
}

export default function VirtualLabSettingsComponent({ id }: Props) {
  const router = useRouter();
  const userIsAdmin = true;
  const saveInformation = async (): Promise<void> => {};
  const changePlan = async (): Promise<void> => {};
  const deleteVirtualLab = async () => {};

  const mockBilling = {
    organization: 'EPFL',
    firstname: 'Harry',
    lastname: 'Anderson',
    address: 'Chem. des Mines 9',
    city: 'Geneva',
    postalCode: '1202',
    country: 'CH',
  };

  const renderInput: (props: InputProps) => ReactNode = useCallback(
    ({ addonAfter, className, disabled, placeholder, readOnly, style, title, type, value }) => {
      return (
        <Input
          addonAfter={addonAfter}
          className={className}
          disabled={disabled}
          placeholder={placeholder}
          readOnly={readOnly}
          required
          style={style}
          title={title}
          type={type}
          value={value}
        />
      );
    },
    []
  );

  const renderTextArea: (props: TextAreaProps) => ReactNode = useCallback(
    ({ className, disabled, placeholder, readOnly, style, title, value }) => {
      return (
        <Input.TextArea
          disabled={disabled}
          placeholder={placeholder}
          autoSize
          required
          className={className}
          title={title}
          value={value}
          style={style}
          readOnly={readOnly}
        />
      );
    },
    []
  );

  const virtualLabDetail = useAtomValue(loadable(virtualLabDetailAtomFamily(id)));
  if (virtualLabDetail.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }
  if (virtualLabDetail.state === 'hasError') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border p-8">
          {(virtualLabDetail.error as Error).message === 'Status: 404' ? (
            <>Virtual Lab not found</>
          ) : (
            <>Something went wrong when fetching virtual lab</>
          )}
        </div>
      </div>
    );
  }

  const expandableItems: Array<{
    content: ReactNode;
    key: string;
    title: string;
  }> = [
    {
      content: (
        <FormPanel
          initialValues={{
            name: virtualLabDetail.data?.name,
            reference_email: virtualLabDetail.data?.reference_email,
            description: virtualLabDetail.data?.description,
          }}
          allowEdit={userIsAdmin}
          save={saveInformation}
          items={[
            {
              children: renderInput,
              label: 'Lab Name',
              name: 'name',
              required: true,
            },
            {
              children: renderTextArea,
              label: 'Description',
              name: 'description',
            },
            {
              children: renderInput,
              label: 'Reference email',
              name: 'referenceEMail',
              type: 'email',
              rules: [
                {
                  required: true,
                  pattern: VALID_EMAIL_REGEXP,
                  message: 'Entered value is not the correct email format',
                },
              ],
            },
          ]}
        />
      ),
      key: 'settings',
      title: 'Lab Settings',
    },
    {
      content: (
        <PlanPanel
          currentPlan={VirtualLabPlanType.Entry}
          billingInfo={mockBilling}
          userIsAdmin={userIsAdmin}
          onChangePlan={changePlan}
          items={[
            {
              type: VirtualLabPlanType.Entry,
              advantages: [...Array(3).keys()].map(
                () => 'Cras mattis consectetur purus sit amet fermentum.'
              ),
              pricePerMonthPerUser: { cost: 0, currency: '$' },
            },
            {
              type: VirtualLabPlanType.Beginner,
              advantages: [...Array(6).keys()].map(
                () => 'Cras mattis consectetur purus sit amet fermentum.'
              ),
              pricePerMonthPerUser: { cost: 40, currency: '$' },
            },
            {
              type: VirtualLabPlanType.Intermediate,
              advantages: [...Array(8).keys()].map(
                () => 'Cras mattis consectetur purus sit amet fermentum.'
              ),
              pricePerMonthPerUser: { cost: 120, currency: '$' },
            },
            {
              type: VirtualLabPlanType.Advanced,
              advantages: [...Array(9).keys()].map(
                () => 'Cras mattis consectetur purus sit amet fermentum.'
              ),
              pricePerMonthPerUser: { cost: 140, currency: '$' },
              className: '!basis-2/5',
            },
          ]}
        />
      ),
      key: 'plan',
      title: 'Plan',
    },
    {
      content: <AdminPanelProjectList id={id} />,
      key: 'projects',
      title: 'Projects',
    },
    {
      content: (
        <FormPanel
          className="grid grid-cols-2"
          initialValues={mockBilling}
          allowEdit={userIsAdmin}
          save={saveInformation}
          items={[
            {
              className: 'col-span-2',
              children: renderInput,
              label: 'Organization',
              name: 'organization',
              required: true,
            },
            {
              children: renderInput,
              label: 'First name',
              name: 'firstname',
              required: true,
            },
            {
              children: renderInput,
              label: 'Last name',
              name: 'lastname',
              required: true,
            },
            {
              className: 'col-span-2',
              children: renderInput,
              label: 'Address',
              name: 'address',
              required: true,
            },
            {
              children: renderInput,
              label: 'City',
              name: 'city',
              required: true,
            },
            {
              children: renderInput,
              label: 'Country',
              name: 'country',
              required: true,
            },
          ]}
        />
      ),
      key: 'billing',
      title: 'Billing',
    },
    ...(userIsAdmin
      ? [
          {
            content: (
              <DangerZonePanel
                onDeleteVirtualLabClick={deleteVirtualLab}
                labName={virtualLabDetail.data?.name || ''}
              />
            ),
            key: 'danger-zone',
            title: 'Danger Zone',
          },
        ]
      : []),
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: '#003A8C',
        },
        components: {
          Collapse: {
            headerBg: 'transparent', // Used in conjunction with "background" style definition below
            headerPadding: '24px 28px',
            contentPadding: '20px 0 20px',
            borderRadiusLG: 0,
            contentBg: '#002766',
            colorBorder: '#002766',
          },
        },
      }}
    >
      <Button
        onClick={() => router.push('/')}
        type="text"
        className="my-6 flex items-center !text-white"
      >
        <ArrowLeftOutlined /> Back to
      </Button>
      <div className="flex flex-col gap-1">
        <HeaderPanel virtualLab={virtualLabDetail.data} />
        <Collapse
          accordion
          expandIconPosition="end"
          expandIcon={ExpandIcon}
          className="flex flex-col gap-1 text-primary-8"
        >
          {expandableItems.map(({ content, key, title }) => (
            <Collapse.Panel
              key={key}
              style={{ background: '#fff' }} // Allows for more control than headerBg above
              header={<h3 className="color-primary-8 text-xl font-bold">{title}</h3>}
            >
              {content}
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </ConfigProvider>
  );
}
