'use client';

import type { InputProps } from 'antd/lib/input/Input';
import type { TextAreaProps } from 'antd/lib/input/TextArea';
import { Button, Collapse, ConfigProvider, Skeleton, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Session } from 'next-auth';
import { AdminPanelProjectList } from '../projects/VirtualLabProjectList';
import ComputeTimeVisualization from './ComputeTimeVisualization';
import FormPanel from './InformationPanel';
import PlanPanel, { Plan } from './PlanPanel';
import DangerZonePanel from './DangerZonePanel';
import { VirtualLab, VirtualLabPlanType } from '@/services/virtual-lab/types';
import { getComputeTimeAtom } from '@/state/virtual-lab/lab';
import VirtualLabService from '@/services/virtual-lab/virtual-lab-service';
import useNotification from '@/hooks/notifications';
import { VALID_EMAIL_REGEXP } from '@/util/utils';

type Props = {
  virtualLab: VirtualLab;
  user: Session['user'];
};

function HeaderPanel({ virtualLab }: { virtualLab: VirtualLab }) {
  const computeTimeAtom = useMemo(() => loadable(getComputeTimeAtom(virtualLab.id)), [virtualLab]);
  const computeTime = useAtomValue(computeTimeAtom);

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
        {computeTime.state === 'loading' && (
          <Skeleton paragraph={{ rows: 1 }} title={{ width: 0 }} />
        )}
        {computeTime.state === 'hasError' && (
          <p>There was an error while retrieving compute time.</p>
        )}
        {computeTime.state === 'hasData' && (
          <ComputeTimeVisualization
            usedTimeInHours={computeTime.data?.usedTimeInHours ?? 0}
            totalTimeInHours={computeTime.data?.totalTimeInHours ?? 0}
          />
        )}
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
  const [virtualLab, setVirtualLab] = useState(initialVirtualLab);

  const router = useRouter();
  const notify = useNotification();
  const service = new VirtualLabService();

  const userIsAdmin =
    virtualLab.members.find((member) => member.email === user?.email)?.role === 'admin';

  const saveInformation = async (update: Omit<Partial<VirtualLab>, 'id'>): Promise<void> => {
    return service
      .edit(user, virtualLab.id, update)
      .then((updatedLab) => {
        setVirtualLab(updatedLab);
      })
      .catch((err) => {
        throw err;
      });
  };

  const changePlan = async (newPlan: Plan, billingInfo: VirtualLab['billing']): Promise<void> => {
    return service
      .changePlan(user, virtualLab.id, newPlan, billingInfo)
      .then((updatedLab) => {
        setVirtualLab(updatedLab);
      })
      .catch((err) => {
        throw err;
      });
  };

  const deleteVirtualLab = async () => {
    return service.deleteVirtualLab(user, virtualLab.id).then(() => {
      notify.success(`Virtual lab ${virtualLab.name} is now deleted`);
      router.push('/');
    });
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

  const expandableItems: Array<{
    content: ReactNode;
    key: string;
    title: string;
  }> = [
    {
      content: (
        <FormPanel
          initialValues={{
            name: virtualLab.name,
            referenceEMail: virtualLab.referenceEMail,
            description: virtualLab.description,
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
              style: {
                maxWidth: '700px',
              },
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
          currentPlan={virtualLab.plan ?? VirtualLabPlanType.entry}
          billingInfo={virtualLab.billing}
          userIsAdmin={userIsAdmin}
          onChangePlan={changePlan}
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
            contentPadding: '20px 28px 20px',
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
