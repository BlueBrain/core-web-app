'use client';

import { Button, Collapse, ConfigProvider, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ReactNode, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import { Session } from 'next-auth';
import ComputeTimeVisualization from './ComputeTimeVisualization';
import InformationPanel from './InformationPanel';
import MembersPanel from './MembersPanel';
import PlanPanel, { Plan } from './PlanPanel';
import DangerZonePanel from './DangerZonePanel';
import {
  VirtualLab,
  NewMember,
  VirtualLabMember,
  VirtualLabPlanType,
} from '@/services/virtual-lab/types';
import { getComputeTimeAtom } from '@/state/virtual-lab/lab';
import VirtualLabService from '@/services/virtual-lab/virtual-lab-service';
import useNotification from '@/hooks/notifications';

type Props = {
  virtualLab: VirtualLab;
  user: Session['user'];
};

function expandIcon({ isActive }: { isActive?: boolean }) {
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

  const computeTimeAtom = useMemo(() => loadable(getComputeTimeAtom(virtualLab.id)), [virtualLab]);
  const computeTime = useAtomValue(computeTimeAtom);

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

  const inviteNewMember = async (newMember: NewMember): Promise<void> => {
    return service.inviteNewMember(newMember, virtualLab.id, user).catch((err) => {
      throw err;
    });
  };

  const changeMemberRole = async (
    memberToChange: VirtualLabMember,
    newRole: VirtualLabMember['role']
  ) => {
    return service
      .changeRole(memberToChange, newRole, virtualLab.id, user)
      .then((updatedMember) => {
        setVirtualLab({
          ...virtualLab,
          members: virtualLab.members.map((m) =>
            m.email === memberToChange.email ? { ...updatedMember } : { ...m }
          ),
        });
      })
      .catch((err) => {
        throw err;
      });
  };

  const removeMember = async (member: VirtualLabMember) => {
    return service.removeMember(member, virtualLab.id, user).then(() => {
      setVirtualLab({
        ...virtualLab,
        members: virtualLab.members.filter((m) => m.email !== member.email),
      });
    });
  };

  const deleteVirtualLab = async () => {
    return service.deleteVirtualLab(user, virtualLab.id).then(() => {
      notify.success(`Virtual lab ${virtualLab.name} is now deleted`);
      router.push('/');
    });
  };

  const expandableItems: Array<{
    content: ReactNode;
    key: string;
    title: string;
    isAdminPanel?: boolean;
  }> = [
    {
      content: (
        <InformationPanel virtualLab={virtualLab} allowEdit={userIsAdmin} save={saveInformation} />
      ),
      key: 'information',
      title: 'Information',
    },
    {
      content: (
        <MembersPanel
          members={virtualLab.members}
          userIsAdmin={userIsAdmin}
          currentUser={user}
          onRemoveMember={removeMember}
          onAddMember={inviteNewMember}
          onChangeRole={changeMemberRole}
        />
      ),
      key: 'members',
      title: 'Members',
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

            isAdminPanel: true,
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
            headerBg: '#fff',
            headerPadding: '24px 28px',
            contentPadding: '40px 28px',
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

      {expandableItems.filter(Boolean).map(({ content, key, isAdminPanel, title }) =>
        isAdminPanel ? (
          <Collapse
            expandIconPosition="end"
            expandIcon={expandIcon}
            className="mt-4 rounded-none text-primary-8"
            bordered={false}
            key={key}
            items={[
              {
                key: 1,
                label: <h3 className="color-primary-8 text-xl font-bold">{title}</h3>,
                children: content,
              },
            ]}
          />
        ) : (
          <ConfigProvider
            key={key}
            theme={{
              components: {
                Collapse: {
                  colorBgContainer: '#e5e7eb',
                },
              },
            }}
          >
            <Collapse
              expandIconPosition="end"
              expandIcon={expandIcon}
              className="mt-4 rounded-none text-primary-8"
              bordered={false}
              key={key}
              items={[
                {
                  key: 1,
                  label: <h3 className="color-primary-8 text-xl font-bold">{title}</h3>,
                  children: content,
                },
              ]}
            />
          </ConfigProvider>
        )
      )}
    </ConfigProvider>
  );
}
