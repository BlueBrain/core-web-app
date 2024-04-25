'use client';

import { Button, Collapse, ConfigProvider, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { loadable, unwrap } from 'jotai/utils';
import { AdminPanelProjectList } from '../projects/VirtualLabProjectList';
import ComputeTimeVisualization from './ComputeTimeVisualization';
import FormPanel, { renderInput, renderTextArea } from './InformationPanel';
import PlanPanel from './PlanPanel';
import DangerZonePanel from './DangerZonePanel';
import { VALID_EMAIL_REGEXP } from '@/util/utils';
import { deleteVirtualLab, patchVirtualLab } from '@/services/virtual-lab/labs';
import { VirtualLab, VirtualLabPlanType } from '@/types/virtual-lab/lab';

import { virtualLabDetailAtomFamily, virtualLabPlansAtom } from '@/state/virtual-lab/lab';

const mockBilling = {
  organization: 'EPFL',
  firstname: 'Harry',
  lastname: 'Anderson',
  address: 'Chem. des Mines 9',
  city: 'Geneva',
  postalCode: '1202',
  country: 'CH',
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

export default function VirtualLabSettingsComponent({ id, token }: { id: string; token: string }) {
  const router = useRouter();
  const userIsAdmin = true;

  const virtualLabDetail = useAtomValue(loadable(virtualLabDetailAtomFamily(id)));
  const setVirtualLabDetail = useSetAtom(virtualLabDetailAtomFamily(id));
  const updateVirtualLab = async (formData: Partial<VirtualLab>): Promise<void> => {
    const { data } = await patchVirtualLab(formData, id, token);
    const { virtual_lab: virtualLab } = data;

    setVirtualLabDetail(
      new Promise((resolve) => {
        resolve(virtualLab);
      })
    );
  };
  const updateBilling = async (_update: Partial<VirtualLab>): Promise<void> => {};
  const onDeleteVirtualLab = async (): Promise<VirtualLab> => {
    const { data } = await deleteVirtualLab(id, token);
    const { virtual_lab: virtualLab } = data;

    virtualLabDetailAtomFamily.remove(id);

    return new Promise((resolve) => resolve(virtualLab)); // eslint-disable-line no-promise-executor-return
  };

  const plans = useAtomValue(unwrap(virtualLabPlansAtom));

  const planDescriptions = [
    {
      id: 1,
      name: VirtualLabPlanType.Entry,
      description: (
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-primary-3">CAPABILITIES</h4>
          <ul className="list-disc pl-4">
            <li>Unlimited downloads</li>
            <li>Unlimited AI-assisted knowledge discovery based-on neuroscience literature</li>
          </ul>
          <h4 className="font-bold text-primary-3">BUILD & SIMULATE</h4>
          <ul className="list-disc pl-4">
            <li>Ion channel</li>
            <li>Single neuron</li>
            <li>Paired neuron</li>
          </ul>
          <h4 className="font-bold text-primary-3">COMPUTE & STORAGE CREDITS</h4>
          <ul className="list-disc pl-4">
            <li>Free compute resources</li>
            <li>Additional compute resources can be purchased</li>
          </ul>
          <h4 className="font-bold text-primary-3">SUPPORT</h4>
          <ul className="list-disc pl-4">
            <li>Open Brain cellular lab support</li>
          </ul>
        </div>
      ),
      pricing: { cost: 20, currency: '$' },
    },
    {
      id: 2,
      name: VirtualLabPlanType.Beginner,
      description: 'Cras mattis consectetur purus sit amet fermentum.',
      pricing: { cost: 100, currency: '$' },
    },
    {
      id: 3,
      name: VirtualLabPlanType.Intermediate,
      description: 'Cras mattis consectetur purus sit amet fermentum.',
      pricing: { cost: 1000, currency: '$' },
    },
  ];

  // Merge API Plan data with the planDescriptions objects.
  // TODO: Ask JDC whether to keep plan data in Frontend or Backend.
  const plansWithDescriptions = plans?.reduce<
    Array<{
      id: number;
      name: VirtualLabPlanType;
      description: ReactNode;
      pricing: { cost: number; currency: string };
    }>
  >(
    (acc1, { id: planId }) =>
      planDescriptions.reduce(
        (acc2, { id: vlPlanId, name, description, pricing }) =>
          vlPlanId === planId ? [...acc2, { id: planId, name, description, pricing }] : acc2,
        acc1
      ),
    []
  );

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
          allowEdit={userIsAdmin}
          initialValues={{
            name: virtualLabDetail.data?.name,
            reference_email: virtualLabDetail.data?.reference_email,
            description: virtualLabDetail.data?.description,
          }}
          onSubmit={updateVirtualLab}
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
              name: 'reference_email',
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
      content: !!plansWithDescriptions && (
        <PlanPanel
          currentPlan={virtualLabDetail.data?.plan_id || 0}
          items={plansWithDescriptions}
          userIsAdmin={userIsAdmin}
          onChange={updateVirtualLab}
        />
      ),
      key: 'plan',
      title: 'Plan',
    },
    {
      content: <AdminPanelProjectList id={id} />,
      key: 'budgets',
      title: 'Budgets',
    },
    {
      content: (
        <FormPanel
          allowEdit={userIsAdmin}
          className="grid grid-cols-2"
          initialValues={mockBilling}
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
          onSubmit={updateBilling}
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
                onClick={onDeleteVirtualLab}
                name={virtualLabDetail.data?.name || ''}
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
        {virtualLabDetail.data && <HeaderPanel virtualLab={virtualLabDetail.data} />}
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
