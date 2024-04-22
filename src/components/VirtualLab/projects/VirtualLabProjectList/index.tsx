'use client';

import { Button, Collapse, ConfigProvider, Modal, Spin, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { ComponentProps, ReactElement, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { PlusOutlined, MinusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import VirtualLabProjectItem from './VirtualLabProjectItem';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import GenericButton from '@/components/Global/GenericButton';
import { createProject } from '@/services/virtual-lab/projects';
import { Project } from '@/types/virtual-lab/projects';

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
        <GenericButton onClick={close} text="Cancel" className="text-black" />
        <Button
          type="primary"
          title="Save Changes"
          htmlType="submit"
          onClick={onSubmit}
          className="h-14 w-40 rounded-none bg-green-600 font-semibold hover:bg-green-700"
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
    children: (props) => <Input {...(props as ComponentProps<typeof Input>)} />, // eslint-disable-line react/jsx-props-no-spreading
    label: 'PROJECT NAME',
    name: 'name',
    required: true,
  },
  {
    children: (props) => <Input.TextArea {...(props as ComponentProps<typeof Input.TextArea>)} />, // eslint-disable-line react/jsx-props-no-spreading
    label: 'PROJECT DESCRIPTION',
    name: 'description',
  },
];

function NewProjectModalForm({ form }: { form: FormInstance }) {
  return (
    <Form form={form} layout="vertical">
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

function NewProjectModal({
  onSuccess,
  virtualLabId,
}: {
  onSuccess: (newProject: Project) => void;
  virtualLabId: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<{ name: string; description: string }>();

  const onSubmit = async () => {
    setLoading(true);

    const { name, description } = form.getFieldsValue();

    const { data } = await createProject({ name, description }, virtualLabId).finally(() => {
      setLoading(false);
      setOpen(false);
      form.resetFields();
    });

    onSuccess(data.project);
  };

  return (
    <>
      <Modal
        title={<h1 className="text-primary-7">Build your model</h1>}
        footer={
          <NewProjectModalFooter
            close={() => setOpen(false)}
            loading={loading}
            onSubmit={onSubmit}
          />
        }
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

// TODO: Consolodate this with the ExpandIcon in @/components/VirtualLab/VirtualLabSettingsComponent
function ExpandIcon({ isActive }: { isActive?: boolean }) {
  return isActive ? (
    <MinusOutlined style={{ fontSize: '14px' }} />
  ) : (
    <PlusOutlined style={{ fontSize: '14px' }} />
  );
}

export function AdminPanelProjectList({ id }: { id: string }) {
  const virtualLabProjects = useAtomValue(loadable(virtualLabProjectsAtomFamily(id)));

  if (virtualLabProjects.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }

  if (virtualLabProjects.state === 'hasError') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border p-8">Something went wrong when fetching projects</div>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: '#fff',
        },
        components: {
          Collapse: {
            headerPadding: '20px 0',
            contentPadding: '20px',
            colorBorder: '#69C0FF',
          },
        },
      }}
    >
      <h4 className="text-primary-3">Projects</h4>
      <Collapse
        accordion
        expandIconPosition="end"
        expandIcon={ExpandIcon}
        bordered={false}
        items={virtualLabProjects.data?.results.map((project) => ({
          key: project.id,
          label: (
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold">{project.name}</h4>
              <div className="flex items-center gap-1 text-lg font-light">
                <span>Total spent: N/A</span>
                <span className="text-primary-3">out of</span>
                <span>{`$${project.budget}`}</span>
              </div>
            </div>
          ),
          children: (
            <div className="flex flex-col gap-2 text-white">
              <div className="font-medium uppercase">Completed jobs:</div>
              <div className="flex items-baseline gap-12">
                <div className="flex gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="items-center justify-center rounded bg-white p-2 font-mono text-primary-9">
                      N/A
                    </span>
                    <span className="font-light">Build</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="items-center justify-center rounded bg-white p-2 font-mono text-primary-9">
                      N/A
                    </span>
                    <span className="font-light">Simulate</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex gap-2">
                    Total compute:<span className="font-bold">6 core hours</span>
                  </span>
                  <span className="flex gap-2">
                    Total storage:<span className="font-bold">36GB</span>
                  </span>
                </div>
              </div>
            </div>
          ),
        }))}
      />
    </ConfigProvider>
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
  const virtualLabProjects = useAtomValue(loadable(virtualLabProjectsAtomFamily(id)));
  const setVirtualLabProjects = useSetAtom(virtualLabProjectsAtomFamily(id));

  if (virtualLabProjects.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }

  if (virtualLabProjects.state === 'hasError') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border p-8">Something went wrong when fetching projects</div>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="flex flex-col gap-6">
        {/* Total + Search + Button row */}
        <div className="flex flex-row justify-between">
          {/* Total + Search */}
          <div className="flex flex-row items-center gap-8">
            <div className="flex gap-2">
              <span className="text-primary-3">Total projects</span>
              <span className="font-bold">{virtualLabProjects.data?.results.length}</span>
            </div>
            <SearchProjects />
          </div>
          <NewProjectModal
            onSuccess={
              virtualLabProjects.data
                ? (newProject: Project) =>
                    setVirtualLabProjects({
                      ...virtualLabProjects.data,
                      results: [...virtualLabProjects.data.results, newProject], // TODO: Fix this by figuring-out how to type atomWithDefault for Promise OR just a value
                    })
                : () => {}
            }
            virtualLabId={id}
          />
        </div>
        {/* Projects row */}
        <div className="flex flex-col gap-4">
          {virtualLabProjects.data?.results.map((project) => (
            <VirtualLabProjectItem key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
