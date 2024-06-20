import { useSession } from 'next-auth/react';
import { Button, ConfigProvider, Modal, Spin, Form } from 'antd';
import { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { unwrap } from 'jotai/utils';
import { PlusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import VirtualLabProjectItem from './VirtualLabProjectItem';
import NewProjectModalForm from './NewProjectModalForm';
import { selectedMembersAtom } from './shared';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import useNotification from '@/hooks/notifications';
import { createProject } from '@/services/virtual-lab/projects';
import { Project } from '@/types/virtual-lab/projects';
import { virtualLabMembersAtomFamily, newProjectModalOpenAtom } from '@/state/virtual-lab/lab';
import { useUnwrappedValue } from '@/hooks/hooks';

function NewProjectModalFooter({
  close,
  loading,
  onSubmit,
}: {
  close: () => void;
  loading: boolean;
  onSubmit: () => void;
}) {
  return loading ? (
    <Spin />
  ) : (
    <Form.Item>
      <div className="flex items-center justify-end">
        <Button
          title="Cancel"
          htmlType="submit"
          onClick={close}
          className="h-14 w-40 rounded-none bg-transparent font-light text-primary-8 hover:bg-neutral-1"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          title="Save Changes"
          htmlType="submit"
          onClick={onSubmit}
          className="h-14 w-40 rounded-none bg-primary-8 font-semibold hover:bg-primary-7"
        >
          Save
        </Button>
      </div>
    </Form.Item>
  );
}

export function NewProjectModal({
  onFail,
  onSuccess,
  virtualLabId,
}: {
  onFail: (error: string) => void;
  onSuccess: (newProject: Project) => void;
  virtualLabId: string;
}) {
  const [open, setOpen] = useAtom(newProjectModalOpenAtom);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const members = useUnwrappedValue(virtualLabMembersAtomFamily(virtualLabId));
  const includeMembers = useAtomValue(selectedMembersAtom);

  const [form] = Form.useForm<{ name: string; description: string }>();

  const onSubmit = async () => {
    if (!session.data) {
      return;
    }
    setLoading(true);

    const { name, description } = form.getFieldsValue();

    return createProject(
      { name, description, includeMembers, token: session.data.accessToken },
      virtualLabId
    )
      .then((response) => {
        form.resetFields();
        setOpen(false);
        onSuccess(response.data.project);
      })
      .catch((error) => {
        return onFail(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      style={{ minWidth: 600 }}
      footer={
        <NewProjectModalFooter close={() => setOpen(false)} loading={loading} onSubmit={onSubmit} />
      }
      onCancel={() => setOpen(false)}
      open={open}
      styles={{ mask: { backgroundColor: '#0050B3D9' } }}
    >
      <NewProjectModalForm form={form} members={members} />
    </Modal>
  );
}

function SearchProjects() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorTextPlaceholder: '#69C0FF',
            colorBgContainer: 'rgba(255,255,255,0)',
          },
          Button: {
            colorPrimary: 'rgba(255,255,255,0)',
          },
        },
      }}
    >
      <div className="flex w-[300px] justify-between border-b bg-transparent pb-[2px]">
        <input
          placeholder="Search for projects..."
          className="bg-transparent text-primary-3 outline-none placeholder:text-primary-3"
        />
        <SearchOutlined />
      </div>
    </ConfigProvider>
  );
}

export default function VirtualLabProjectList({ id }: { id: string }) {
  const virtualLabProjects = useAtomValue(unwrap(virtualLabProjectsAtomFamily(id)));
  const setVirtualLabProjects = useSetAtom(virtualLabProjectsAtomFamily(id));
  const notification = useNotification();
  const [, setOpen] = useAtom(newProjectModalOpenAtom);

  if (!virtualLabProjects) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }

  return (
    <>
      <div className="my-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-8">
              <div className="flex gap-2">
                <span className="text-primary-3">Total projects</span>
                <span className="font-bold">{virtualLabProjects.results.length}</span>
              </div>
              <SearchProjects />
            </div>
            <NewProjectModal
              onFail={(error: string) => notification.error(`Project creation failed: ${error}`)}
              onSuccess={
                virtualLabProjects
                  ? (newProject: Project) => {
                      setVirtualLabProjects();
                      notification.success(`${newProject.name} has been created.`);
                    }
                  : () => {}
              }
              virtualLabId={id}
            />
          </div>
          <div className="flex flex-col gap-4">
            {virtualLabProjects.results.map((project) => (
              <VirtualLabProjectItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 right-7">
        <Button
          className="mr-5 h-12 w-52 rounded-none border-none text-sm font-bold"
          onClick={() => setOpen(true)}
        >
          <span className="relative text-primary-8">
            Create project <PlusOutlined className="relative left-3 top-[0.1rem]" />
          </span>
        </Button>
      </div>
    </>
  );
}
