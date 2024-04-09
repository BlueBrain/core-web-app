'use client';

import type { InputProps } from 'antd/lib/input/Input';
import type { TextAreaProps } from 'antd/lib/input/TextArea';
import { Button, Collapse, ConfigProvider, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ReactNode, useCallback } from 'react';
import { Session } from 'next-auth';
import { AdminPanelProjectList } from '../projects/VirtualLabProjectList';
import ComputeTimeVisualization from './ComputeTimeVisualization';
import FormPanel from './InformationPanel';
import PlanPanel from './PlanPanel';
import DangerZonePanel from './DangerZonePanel';
import { VALID_EMAIL_REGEXP } from '@/util/utils';
import { VirtualLab } from '@/types/virtual-lab/lab';

type Props = {
  virtualLab: VirtualLab;
  user: Session['user'];
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

export default function VirtualLabSettingsComponent({
  virtualLab: initialVirtualLab,
  user,
}: Props) {
  const router = useRouter();

  const userIsAdmin = true;

  const saveInformation = async (): Promise<void> => {};

  const changePlan = async (): Promise<void> => {};

  const deleteVirtualLab = async () => {};

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

  const expandableItems: Array<{
    content: ReactNode;
    key: string;
    title: string;
  }> = [
    {
      content: (
        <FormPanel
          initialValues={{
            name: initialVirtualLab.name,
            referenceEMail: initialVirtualLab.reference_email,
            description: initialVirtualLab.description,
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
          currentPlan={initialVirtualLab.plan ?? VirtualLabPlanType.entry}
          billingInfo={initialVirtualLab.billing}
          userIsAdmin={userIsAdmin}
          onChangePlan={changePlan}
          items={[
            {
              type: VirtualLabPlanType.entry,
              advantages: [...Array(3).keys()].map(
                () => 'Cras mattis consectetur purus sit amet fermentum.'
              ),
              pricePerMonthPerUser: { cost: 0, currency: '$' },
            },
            {
              type: VirtualLabPlanType.beginner,
              advantages: [...Array(6).keys()].map(
                () => 'Cras mattis consectetur purus sit amet fermentum.'
              ),
              pricePerMonthPerUser: { cost: 40, currency: '$' },
            },
            {
              type: VirtualLabPlanType.intermediate,
              advantages: [...Array(8).keys()].map(
                () => 'Cras mattis consectetur purus sit amet fermentum.'
              ),
              pricePerMonthPerUser: { cost: 120, currency: '$' },
            },
            {
              type: VirtualLabPlanType.advanced,
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
      content: <AdminPanelProjectList />,
      key: 'projects',
      title: 'Projects',
    },
    {
      content: (
        <FormPanel
          className="grid grid-cols-2"
          initialValues={{
            organization: virtualLab.billing.organization,
            firstname: virtualLab.billing.firstname,
            lastname: virtualLab.billing.lastname,
            address: virtualLab.billing.address,
            city: virtualLab.billing.city,
            postalCode: virtualLab.billing.postalCode,
            country: virtualLab.billing.country,
          }}
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
                labName={virtualLab.name}
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
        <HeaderPanel virtualLab={virtualLab} />
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
