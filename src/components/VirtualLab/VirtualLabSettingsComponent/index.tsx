/* eslint-disable react/no-unstable-nested-components */

'use client';

import { Button, Collapse, ConfigProvider, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import { Session } from 'next-auth';
import ComputeTimeVisualization from './ComputeTimeVisualization';
import InformationPanel from './InformationPanel';
import MembersPanel from './MembersPanel';
import PlanPanel, { Plan } from './PlanPanel';
import DangerZonePanel from './DangerZonePanel';
import { VirtualLab, NewMember, VirtualLabMember } from '@/services/virtual-lab/types';
import { getComputeTimeAtom } from '@/state/virtual-lab/lab';
import VirtualLabService from '@/services/virtual-lab/virtual-lab-service';
import useNotification from '@/hooks/notifications';

type Props = {
  virtualLab: VirtualLab;
  user: Session['user'];
};

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

  const saveInformation = (update: Omit<Partial<VirtualLab>, 'id'>): Promise<void> => {
    return service
      .edit(user, virtualLab.id, update)
      .then((updatedLab) => {
        setVirtualLab(updatedLab);
      })
      .catch((err) => {
        throw err;
      });
  };

  const changePlan = (newPlan: Plan, billingInfo: VirtualLab['billing']): Promise<void> => {
    return service
      .changePlan(user, virtualLab.id, newPlan, billingInfo)
      .then((updatedLab) => {
        setVirtualLab(updatedLab);
      })
      .catch((err) => {
        throw err;
      });
  };

  const inviteNewMember = (newMember: NewMember): Promise<void> => {
    return service.inviteNewMember(newMember, virtualLab.id, user).catch((err) => {
      throw err;
    });
  };

  const changeMemberRole = (
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

  const removeMember = (member: VirtualLabMember) => {
    return service.removeMember(member, virtualLab.id, user).then(() => {
      setVirtualLab({
        ...virtualLab,
        members: virtualLab.members.filter((m) => m.email !== member.email),
      });
    });
  };

  const deleteVirtualLab = () => {
    return service.deleteVirtualLab(user, virtualLab.id).then(() => {
      notify.success(`Virtual lab ${virtualLab.name} is now deleted`);
      router.push('/');
    });
  };

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
        className="flex items-center my-6 !text-white"
      >
        <ArrowLeftOutlined /> Back to
      </Button>

      <div className="bg-primary-8">
        <div className="py-4 px-8 border border-transparent border-b-primary-7">
          <h6>Virtual lab</h6>
          <h3 className="font-bold text-3xl leading-10" data-testid="virtual-lab-name">
            {virtualLab.name}
          </h3>
        </div>
        <div className="py-4 px-8">
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

      <Collapse
        expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <MinusOutlined style={{ fontSize: '14px' }} />
          ) : (
            <PlusOutlined style={{ fontSize: '14px' }} />
          )
        }
        className="mt-4 rounded-none text-primary-8"
        bordered={false}
        key="information"
        items={[
          {
            key: 1,
            label: <h3 className="font-bold text-xl color-primary-8">Information</h3>,
            children: (
              <InformationPanel
                virtualLab={virtualLab}
                allowEdit={userIsAdmin}
                save={saveInformation}
              />
            ),
          },
        ]}
      />

      <Collapse
        expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <MinusOutlined style={{ fontSize: '14px' }} />
          ) : (
            <PlusOutlined style={{ fontSize: '14px' }} />
          )
        }
        className="mt-4 rounded-none text-primary-8"
        key="members"
        items={[
          {
            key: 1,
            label: <h3 className="font-bold text-xl color-primary-8">Members</h3>,
            children: (
              <MembersPanel
                members={virtualLab.members}
                userIsAdmin={userIsAdmin}
                currentUser={user}
                onRemoveMember={removeMember}
                onAddMember={inviteNewMember}
                onChangeRole={changeMemberRole}
              />
            ),
          },
        ]}
      />

      <Collapse
        expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <MinusOutlined style={{ fontSize: '14px' }} />
          ) : (
            <PlusOutlined style={{ fontSize: '14px' }} />
          )
        }
        className="mt-4 rounded-none text-primary-8"
        key="plan"
        items={[
          {
            key: 1,
            label: <h3 className="font-bold text-xl color-primary-8">Plan</h3>,
            children: (
              <PlanPanel
                currentPlan={virtualLab.plan ?? 'entry'}
                billingInfo={virtualLab.billing}
                userIsAdmin={userIsAdmin}
                onChangePlan={changePlan}
              />
            ),
          },
        ]}
      />

      {userIsAdmin && (
        <ConfigProvider
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
            expandIcon={({ isActive }) =>
              isActive ? (
                <MinusOutlined style={{ fontSize: '14px' }} />
              ) : (
                <PlusOutlined style={{ fontSize: '14px' }} />
              )
            }
            className="mt-4 rounded-none text-primary-8 bg-gray-200"
            key="danger-zone"
            items={[
              {
                key: 1,
                label: <h3 className="font-bold text-xl color-primary-8">Danger Zone</h3>,
                children: (
                  <DangerZonePanel
                    onDeleteVirtualLabClick={deleteVirtualLab}
                    labName={virtualLab.name}
                  />
                ),
              },
            ]}
          />
        </ConfigProvider>
      )}
    </ConfigProvider>
  );
}
