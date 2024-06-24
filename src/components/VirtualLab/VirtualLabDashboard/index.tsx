'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Switch } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';

import { CreateVirtualLabButton } from '../VirtualLabTopMenu/CreateVirtualLabButton';
import { NewProjectModal } from '../projects/VirtualLabProjectList';
import VirtualLabAndProject from './VirtualLabAndProject';
import DashboardTotals from './DashboardTotals';
import { newProjectModalOpenAtom, virtualLabIdAtom } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';

import useNotification from '@/hooks/notifications';
import { Project } from '@/types/virtual-lab/projects';
import { VirtualLab } from '@/types/virtual-lab/lab';

export default function VirtualLabDashboard({ virtualLabs }: { virtualLabs: VirtualLab[] }) {
  const [showOnlyLabs, setShowOnlyLabs] = useState<boolean>(false);
  const [, setOpen] = useAtom(newProjectModalOpenAtom);

  const [virtualLabId, setVirtualLabId] = useAtom(virtualLabIdAtom);
  const refreshVirtualLabProjects = useSetAtom(virtualLabProjectsAtomFamily(virtualLabId));

  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const notification = useNotification();

  return (
    <>
      <div className="inset-0 z-0 grid grid-cols-[1fr_4fr] grid-rows-1 bg-primary-9 text-white">
        <div className="mt-[25%] flex gap-3">
          <div>Show only virtual labs</div>
          <Switch
            value={showOnlyLabs}
            onChange={(value) => {
              setShowOnlyLabs(value);
            }}
          />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <div className="text-5xl font-bold uppercase">Your virtual labs and projects</div>
            <DashboardTotals />
          </div>
          {virtualLabs.map((vl) => (
            <VirtualLabAndProject
              key={vl.id}
              id={vl.id}
              name={vl.name}
              description={vl.description}
              createdAt={vl.created_at}
              showOnlyLabs={showOnlyLabs}
            />
          ))}
          <div className="fixed bottom-5 right-5">
            <Button
              className="mr-5 h-12 w-52 rounded-none border-none text-sm font-bold"
              onClick={() => setIsProjectModalVisible(true)}
            >
              <span className="relative text-primary-8">
                Create project <PlusOutlined className="relative left-3 top-[0.1rem]" />
              </span>
            </Button>
            <CreateVirtualLabButton />
          </div>
        </div>
      </div>

      <Modal
        title={null}
        open={isProjectModalVisible}
        footer={
          <div>
            <Button key="back" onClick={() => setIsProjectModalVisible(false)}>
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                setIsProjectModalVisible(false);
                setVirtualLabId(virtualLabId);
                setOpen(true);
              }}
              disabled={!virtualLabId}
            >
              OK
            </Button>
          </div>
        }
        width={500}
        onCancel={() => setIsProjectModalVisible(false)}
      >
        <span className="my-3 block font-bold text-primary-8">Project Location</span>
        <Select
          style={{ width: 200 }}
          options={virtualLabs.map((vl) => ({ label: vl.name, value: vl.id }))}
          onChange={(v) => setVirtualLabId(v)}
        />
      </Modal>
      {!!virtualLabId && (
        <NewProjectModal
          onFail={(error: string) => notification.error(`Project creation failed: ${error}`)}
          onSuccess={(newProject: Project) => {
            refreshVirtualLabProjects(); // Refresh projects list.
            notification.success(`${newProject.name} has been created.`);
          }}
          virtualLabId={virtualLabId}
        />
      )}
    </>
  );
}
