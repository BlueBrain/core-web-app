import { Button, ConfigProvider, Modal, Spin, Form } from 'antd';
import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { PlusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import VirtualLabProjectItem from './VirtualLabProjectItem';
import NewProjectModalForm from './NewProjectModalForm';
import { selectedMembersAtom } from './shared';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import { notification } from '@/api/notifications';
import { createProject } from '@/services/virtual-lab/projects';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { useUnwrappedValue } from '@/hooks/hooks';
import { useAtom } from '@/state/state';
import { assertErrorMessage, classNames } from '@/util/utils';
import { basePath } from '@/config';

function NewProjectModalFooter({
  close,
  loading,
  onSubmit,
  submitDisabled,
}: {
  close: () => void;
  loading: boolean;
  onSubmit: () => void;
  submitDisabled: boolean;
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
          className={classNames(
            'ml-3 h-14 w-40 rounded-none bg-primary-8 font-semibold',
            submitDisabled ? 'hover:bg-gray-100' : 'hover:bg-primary-7'
          )}
          disabled={!!submitDisabled}
        >
          Save
        </Button>
      </div>
    </Form.Item>
  );
}

export function NewProjectModal({ virtualLabId }: { virtualLabId: string }) {
  const [open, setOpen] = useAtom<boolean>('new-project-modal-open');
  const [loading, setLoading] = useState(false);
  const members = useUnwrappedValue(virtualLabMembersAtomFamily(virtualLabId));
  const includeMembers = useAtomValue(selectedMembersAtom);
  const redirectUrl = (projectId: string) =>
    `${basePath}/virtual-lab/lab/${virtualLabId}/project/${projectId}/home`;

  const router = useRouter();

  const [isFormValid, setIsFormValid] = useState(false);

  const [form] = Form.useForm<{ name: string; description: string }>();

  const onSubmit = async () => {
    try {
      const { name, description } = await form.validateFields();
      setLoading(true);
      const res = await createProject({ name, description, includeMembers }, virtualLabId);
      form.resetFields();
      setOpen(false);
      notification.success(`${res.data.project.name} has been created.`);
      router.push(redirectUrl(res.data.project.id));
    } catch (e: any) {
      if ('errorFields' in e) return; // Input errors.
      notification.error(`Project creation failed: ${assertErrorMessage(e)}`); // Request Errors
    } finally {
      setLoading(false);
    }
  };

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
  }, [form, values]);

  return (
    <Modal
      className="m-w-[600px]"
      footer={
        <NewProjectModalFooter
          close={() => {
            form.resetFields();
            setIsFormValid(false);
            setOpen(false);
          }}
          loading={loading}
          onSubmit={onSubmit}
          submitDisabled={!isFormValid}
        />
      }
      open={!!open}
      styles={{ mask: { backgroundColor: '#0050B3D9' } }}
    >
      <NewProjectModalForm form={form} members={members} vlabId={virtualLabId} />
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
  const [, setNewProjectModalOpen] = useAtom<boolean>('new-project-modal-open');

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
            <NewProjectModal virtualLabId={id} />
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
          onClick={() => setNewProjectModalOpen(true)}
        >
          <span className="relative text-primary-8">
            Create project <PlusOutlined className="relative left-3 top-[0.1rem]" />
          </span>
        </Button>
      </div>
    </>
  );
}
