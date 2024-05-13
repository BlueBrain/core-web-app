import { useSession } from 'next-auth/react';
import { Button, ConfigProvider, Modal, Spin, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { ComponentProps, ReactElement, useState } from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { unwrap } from 'jotai/utils';
import { PlusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import VirtualLabProjectItem from './VirtualLabProjectItem';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import useNotification from '@/hooks/notifications';
import { createProject } from '@/services/virtual-lab/projects';
import { Project } from '@/types/virtual-lab/projects';
import { newProjectModalOpenAtom } from '../../VirtualLabTopMenu';

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

// This type extends the Form.Item props to make children a render-prop,
// and to require both the label and name props.
type ModalInputProps = Omit<ComponentProps<typeof Form.Item>, 'children' | 'label' | 'name'> & {
  children: (
    props: ComponentProps<typeof Input | typeof Input.TextArea>
  ) => ReactElement<typeof Input | typeof Input.TextArea>;
  label: string;
  name: string;
};

function NewProjectModalInput({
  children,
  label,
  name,
  required,
}: ModalInputProps): ReactElement<typeof Form.Item> {
  return (
    <Form.Item
      key={name}
      name={name}
      label={label}
      style={{ borderBottom: 'solid 1px #69C0FF' }}
      required
    >
      {children({
        name,
        required,
        placeholder: `Type the ${label?.toLowerCase()} here...`,
      })}
    </Form.Item>
  );
}

const formItems: Array<ModalInputProps> = [
  {
    children: (props) => <Input maxLength={80} {...(props as ComponentProps<typeof Input>)} />, // eslint-disable-line react/jsx-props-no-spreading
    label: 'PROJECT NAME',
    name: 'name',
    required: true,
  },
  {
    children: (props) => (
      <Input.TextArea maxLength={288} {...(props as ComponentProps<typeof Input.TextArea>)} /> // eslint-disable-line react/jsx-props-no-spreading
    ),
    label: 'PROJECT DESCRIPTION',
    name: 'description',
  },
];

function NewProjectModalForm({ form }: { form: FormInstance }) {
  return (
    <Form form={form} layout="vertical" style={{ paddingBlockStart: 40 }}>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              activeBg: 'transparent',
              addonBg: 'transparent',
              borderRadius: 0,
              colorBgContainer: 'transparent',
              colorBorder: 'transparent',
              colorText: '#003A8C',
              colorTextDisabled: '#fff',
              colorTextPlaceholder: '#8C8C8C',
              fontSizeLG: 16,
              hoverBorderColor: 'transparent',
              paddingInline: 0,
              paddingBlock: 0,
            },
            Form: {
              itemMarginBottom: 40,
              verticalLabelMargin: 0,
              verticalLabelPadding: 0,
            },
          },
        }}
      >
        {formItems.map(NewProjectModalInput)}
      </ConfigProvider>
    </Form>
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

  const [form] = Form.useForm<{ name: string; description: string }>();

  const onSubmit = async () => {
    if (!session.data) {
      return;
    }
    setLoading(true);

    const { name, description } = form.getFieldsValue();

    return createProject({ name, description, token: session.data.accessToken }, virtualLabId)
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
    <>
      <Modal
        footer={
          <NewProjectModalFooter
            close={() => setOpen(false)}
            loading={loading}
            onSubmit={onSubmit}
          />
        }
        onCancel={() => setOpen(false)}
        open={open}
        styles={{ mask: { backgroundColor: '#0050B3D9' } }}
      >
        <NewProjectModalForm form={form} />
      </Modal>
      <button
        type="button"
        className="flex w-[200px] justify-between border border-primary-7 p-3"
        onClick={() => setOpen(true)}
      >
        <span className="font-bold">New project</span>
        <PlusOutlined />
      </button>
    </>
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

  if (!virtualLabProjects) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }

  return (
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
  );
}
