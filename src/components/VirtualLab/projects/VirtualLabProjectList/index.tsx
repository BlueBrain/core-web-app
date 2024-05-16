import { useSession } from 'next-auth/react';
import { Button, ConfigProvider, Modal, Spin, Form, Input, Select } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { ComponentProps, ReactElement, useMemo, useState } from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { unwrap } from 'jotai/utils';
import { PlusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import VirtualLabMemberIcon from '../../VirtualLabMemberIcon';
import VirtualLabProjectItem from './VirtualLabProjectItem';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import useNotification from '@/hooks/notifications';
import { createProject } from '@/services/virtual-lab/projects';
import { Project } from '@/types/virtual-lab/projects';
import { virtualLabMembersAtomFamily, newProjectModalOpenAtom } from '@/state/virtual-lab/lab';
import { useUnwrappedValue } from '@/hooks/hooks';
import { VirtualLabMember } from '@/types/virtual-lab/members';

const { Option } = Select;

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

function NewProjectModalForm({
  form,
  members,
}: {
  form: FormInstance;
  members: VirtualLabMember[];
}) {
  const [selectedMembers, setSelectedMembers] = useAtom(selectedMembersAtom);

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
            Select: {
              colorText: 'text-primary-8',
              colorBorder: 'transparent',
            },
          },
        }}
      >
        {formItems.map(NewProjectModalInput)}
        {selectedMembers.map((member) => (
          <div key={member.id} className="text-primary-8">
            <VirtualLabMemberIcon
              role={member.role}
              firstName={member.first_name}
              lastName={member.last_name}
            />
            <div key={member.id} className="ml-5 inline-block font-bold">
              {member.name}
            </div>
            <Select
              style={{ width: 200, top: 7 }}
              defaultValue={member.role}
              onChange={(v) => {
                const m = members.find((m_) => m_.id === v);
                if (m) setSelectedMembers([...selectedMembers, { ...member, role: v }]);
              }}
              className="float-right inline-block"
            >
              <Option value="admin">Admin</Option>
              <Option value="member">Member</Option>
            </Select>
          </div>
        ))}
        <Select
          style={{ width: 200 }}
          placeholder="Add member"
          onChange={(v) => {
            const m = members.find((member) => member.id === v);
            if (m) setSelectedMembers([...selectedMembers, m]);
          }}
          className="mt-5"
        >
          {members
            .filter((m) => !selectedMembers.map((s) => s.id).includes(m.id))
            .map((member) => (
              <Option value={member.id} key={member.id}>
                {member.name}
              </Option>
            ))}
        </Select>
      </ConfigProvider>
    </Form>
  );
}

const selectedMembersAtom = atom<VirtualLabMember[]>([]);
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
  const members = useUnwrappedValue(
    virtualLabMembersAtomFamily(virtualLabId)
  ) as VirtualLabMember[];
  const selectedMembers = useAtomValue(selectedMembersAtom);
  const includeMembers = useMemo(
    () => selectedMembers.map((m) => ({ email: m.email, role: m.role })),
    [selectedMembers]
  );

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
        <NewProjectModalForm form={form} members={members} />
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
            Create Project <PlusOutlined className="relative left-3" />
          </span>
        </Button>
      </div>
    </>
  );
}
