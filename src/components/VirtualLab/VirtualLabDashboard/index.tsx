'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Switch } from 'antd';
import { useSetAtom } from 'jotai';
import { useState } from 'react';

import CreateVirtualLabButton from '../CreateVirtualLabButton';
import { NewProjectModal } from '../projects/VirtualLabProjectList';
import VirtualLabAndProject from './VirtualLabAndProject';
import DashboardTotals from './DashboardTotals';

import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import { VirtualLab } from '@/types/virtual-lab/lab';
import { useAtom } from '@/state/state';

export default function VirtualLabDashboard({ virtualLabs }: { virtualLabs: VirtualLab[] }) {
  const [showOnlyLabs, setShowOnlyLabs] = useState<boolean>(false);

  const [, setNewProjectModalOpen] = useAtom<boolean>('new-project-modal-open');
  const [projectLocationModalOpen, setProjectLocationModalOpen] = useState(false);
  const [virtualLabId, setVirtualLabId] = useState('');

  const refreshVirtualLabProjects = useSetAtom(virtualLabProjectsAtomFamily(virtualLabId));

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
              onClick={() => setProjectLocationModalOpen(true)}
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
        open={projectLocationModalOpen}
        footer={
          <div>
            <Button key="back" onClick={() => setProjectLocationModalOpen(false)}>
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                setProjectLocationModalOpen(false);
                setVirtualLabId(virtualLabId);
                setNewProjectModalOpen(true);
              }}
              disabled={!virtualLabId}
            >
              OK
            </Button>
          </div>
        }
        width={500}
        onCancel={() => setProjectLocationModalOpen(false)}
      >
        <span className="my-3 block font-bold text-primary-8">
          Please select a Virtual lab for this project
        </span>
        <Select
          style={{ width: 200 }}
          options={virtualLabs.map((vl) => ({ label: vl.name, value: vl.id }))}
          onChange={(v) => setVirtualLabId(v)}
        />
      </Modal>
      {!!virtualLabId && (
        <NewProjectModal onSuccess={refreshVirtualLabProjects} virtualLabId={virtualLabId} />
      )}
    </>
  );
}
