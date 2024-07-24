'use client';

import { ReactNode, useCallback, useMemo } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { loadable, unwrap } from 'jotai/utils';
import { Collapse, ConfigProvider, Spin } from 'antd';
import { CollapseProps } from 'antd/lib/collapse/Collapse';
import { CollapsibleType } from 'antd/lib/collapse/CollapsePanel';
import { LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryState } from 'nuqs';

import Billing from '../Billing';
import ProjectsPanel from './ProjectsPanel';
import FormPanel, { renderInput, renderTextArea } from './FormPanel';
import PlanPanel from './PlanPanel';
import DangerZonePanel from './DangerZonePanel';

import { deleteVirtualLab } from '@/services/virtual-lab/labs';
import {
  virtualLabDetailAtomFamily,
  virtualLabsOfUserAtom,
  virtualLabPlansAtom,
} from '@/state/virtual-lab/lab';
import useUpdateVirtualLab from '@/hooks/useUpdateVirtualLab';
import { VALID_EMAIL_REGEXP, classNames } from '@/util/utils';
import { VirtualLab, VirtualLabPlanType } from '@/types/virtual-lab/lab';

function ExpandIcon({ isActive }: { isActive?: boolean }) {
  return isActive ? (
    <MinusOutlined style={{ fontSize: '14px' }} />
  ) : (
    <PlusOutlined style={{ fontSize: '14px' }} />
  );
}

function CustomCollapse({ className, items, activeKey, onChange }: CollapseProps) {
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
            fontSize: 20,
          },
        },
      }}
    >
      <Collapse
        accordion
        destroyInactivePanel
        activeKey={activeKey}
        onChange={onChange}
        expandIconPosition="end"
        expandIcon={ExpandIcon}
        className={classNames(className)}
        items={items?.map((item) => ({
          style: { background: '#fff' },
          headerClass: 'font-bold !items-center', // TODO: See whether there's a better way to align center.
          ...item,
        }))}
      />
    </ConfigProvider>
  );
}

export default function VirtualLabSettingsComponent({ id }: { id: string }) {
  const userIsAdmin = true;
  const [activePanelKey, setActivePanel] = useQueryState('panel', {
    clearOnDefault: true,
    defaultValue: '',
  });
  const virtualLabDetail = useAtomValue(loadable(virtualLabDetailAtomFamily(id)));
  const refreshVirtualLabsOfUser = useSetAtom(virtualLabsOfUserAtom);

  const updateVirtualLab = useUpdateVirtualLab(id);

  const onChangePanel = (key: string | string[]) => setActivePanel(String(key));

  const onDeleteVirtualLab = useCallback(async (): Promise<VirtualLab> => {
    const { data } = await deleteVirtualLab(id);
    const { virtual_lab: virtualLab } = data;

    virtualLabDetailAtomFamily.remove(id);
    refreshVirtualLabsOfUser();

    return new Promise((resolve) => resolve(virtualLab)); // eslint-disable-line no-promise-executor-return
  }, [id, refreshVirtualLabsOfUser]);

  const plans = useAtomValue(unwrap(virtualLabPlansAtom));

  const planDescriptions = [
    {
      id: 1,
      name: VirtualLabPlanType.Entry,
      description: (
        <div className="flex flex-col gap-1 text-lg">
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

  const header = useMemo(() => {
    return virtualLabDetail.state === 'hasData'
      ? {
          key: 'header',
          collapsible: 'disabled' as CollapsibleType, // Type-casting shouldn't be necessary here, but it is for some reason.
          showArrow: false,
          label: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-primary-8 text-white">
                {virtualLabDetail.data?.name}
                <div className="text-primary-2">
                  Total budget: <span>$ {virtualLabDetail.data?.budget ?? 0}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 bg-primary-8 text-white">
                <div className="h-3 overflow-hidden rounded-full bg-primary-3">
                  <div className="h-full w-[60%] bg-white" />
                </div>
                <div className="flex justify-between text-base font-light">
                  <div className="flex flex-row gap-3">
                    Total spent
                    <span className="font-bold">$ N/A</span>
                  </div>
                  <div className="flex flex-row gap-3 text-primary-3">
                    Remaining: <span className="font-bold">$ N/A</span>
                  </div>
                </div>
              </div>
            </div>
          ),
          style: { background: '#003A8C' },
          headerClass: '!text-white font-bold !items-center', // TODO: See whether there's a better way to align center.
        }
      : {};
  }, [virtualLabDetail]);

  const settings = useMemo(
    () =>
      virtualLabDetail.state === 'hasData'
        ? {
            key: 'settings',
            children: (
              <FormPanel
                className="grid grid-cols-2 gap-x-6"
                initialValues={{
                  name: virtualLabDetail.data?.name,
                  reference_email: virtualLabDetail.data?.reference_email,
                  description: virtualLabDetail.data?.description,
                }}
                items={[
                  {
                    className: 'col-span-2',
                    children: renderInput,
                    label: 'Lab Name',
                    name: 'name',
                    required: true,
                    rules: [{ max: 250 }],
                  },
                  {
                    className: 'col-span-2',
                    children: renderTextArea,
                    label: 'Description',
                    name: 'description',
                  },
                  {
                    children: renderInput,
                    label: 'Reference email',
                    name: 'reference_email',
                    type: 'email',
                    required: true,
                    // TODO: Figure-out whether "rules" prop is actually useful.
                    rules: [
                      {
                        required: true,
                        pattern: VALID_EMAIL_REGEXP,
                        message: 'Entered value is not the correct email format',
                      },
                    ],
                  },
                  {
                    children: renderInput,
                    label: 'Entity',
                    name: 'entity',
                  },
                ]}
                name="settings" // TODO: Check whether this prop is necessary.
                onValuesChange={updateVirtualLab}
              />
            ),
            label: 'Lab Settings',
          }
        : {},
    [updateVirtualLab, virtualLabDetail]
  );

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

  const plan = useMemo(
    () =>
      virtualLabDetail.state === 'hasData'
        ? {
            key: 'plans',
            children: !!plansWithDescriptions && (
              <PlanPanel
                currentPlan={virtualLabDetail.data?.plan_id || 0}
                items={plansWithDescriptions}
                userIsAdmin={userIsAdmin}
                onChange={updateVirtualLab}
              />
            ),
            label: 'Plan',
          }
        : {},
    [plansWithDescriptions, updateVirtualLab, userIsAdmin, virtualLabDetail]
  );

  const budget = useMemo(
    () => ({
      key: 'project-budget',
      children: <ProjectsPanel expandIcon={ExpandIcon} virtualLabId={id} />,
      label: 'Budgets',
    }),
    [id]
  );

  const billing = useMemo(
    () => ({
      key: 'billing',
      children: <Billing virtualLabId={id} />,
      label: 'Billing',
    }),
    [id]
  );

  const dangerZone = useMemo(
    () =>
      virtualLabDetail.state === 'hasData' && userIsAdmin
        ? {
            key: 'danger-zone',
            children: (
              <DangerZonePanel
                onClick={onDeleteVirtualLab}
                name={virtualLabDetail.data?.name || ''}
              />
            ),
            label: 'Danger Zone',
          }
        : {},
    [onDeleteVirtualLab, userIsAdmin, virtualLabDetail]
  );

  const collapseItems: CollapseProps['items'] = useMemo(
    () =>
      [header, settings, plan, budget, billing, dangerZone].filter(
        (item) => Object.keys(item).length !== 0 // Filter-out any "empty" panels (ex. DangerZone when not admin).
      ),
    [header, settings, plan, budget, billing, dangerZone]
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

  return (
    <CustomCollapse
      className="my-10 flex flex-col gap-1 text-primary-8"
      items={collapseItems}
      activeKey={activePanelKey}
      onChange={onChangePanel}
    />
  );
}
