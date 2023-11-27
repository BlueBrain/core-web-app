import { useEffect, useState, useRef } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Modal, Form, Input, Button, ConfigProvider } from 'antd';
import { CheckCircleFilled, CloseOutlined, FileTextOutlined } from '@ant-design/icons';

import { checkNameIfUniq } from '@/api/nexus';
import { EntityResource, SupportedConfigListTypes } from '@/types/nexus';

const modalTheme = {
  token: {
    colorBgBase: 'white',
    colorTextBase: 'black',
  },
};

type FormValidity = {
  name: boolean;
  description: boolean;
};

type RenameConfigFnType<T> = (
  config: T,
  name: string,
  description: string,
  session: Session
) => Promise<EntityResource>;

type GetConfigsByNameQueryFnType = (name: string) => Object;

interface RenameConfigFormProps<T> {
  config: T;
  onRenameSuccess: () => void;
  onClose: () => void;
  renameConfigFn: RenameConfigFnType<T>;
  getConfigsByNameQueryFn: GetConfigsByNameQueryFnType;
}

function RenameConfigSuccess({
  name,
  renameComplete,
}: {
  name: string;
  renameComplete: () => void;
}) {
  return (
    <div className="flex items-center justify-center flex-col">
      <CheckCircleFilled style={{ fontSize: '5rem', color: '#00B212' }} />
      <div className="w-full" style={{ padding: '.75rem 0 3.75rem' }}>
        <div className="flex items-center justify-center flex-col gap-1">
          <p className="text-primary-8 text-base">
            You have successfully rename the configuration. Your configuration
          </p>
          <h2 className="text-2xl text-primary-8 font-bold">{name}</h2>
          <p className="text-primary-8 text-base">is ready to use.</p>
        </div>
      </div>
      <Button
        type="primary"
        className="ml-2 bg-primary-9 py-6 px-8 rounded-none inline-flex items-center justify-center"
        onClick={renameComplete}
      >
        Ok
      </Button>
    </div>
  );
}

function RenameConfigForm<T extends SupportedConfigListTypes = SupportedConfigListTypes>({
  config,
  onRenameSuccess,
  onClose,
  renameConfigFn,
  getConfigsByNameQueryFn,
}: RenameConfigFormProps<T>) {
  const { data: session } = useSession();
  const [form] = Form.useForm();

  const [renamingState, setRenamingState] = useState<
    { status: 'stale' | 'renaming'; data: null } | { status: 'success'; data: EntityResource }
  >({ status: 'stale', data: null });

  const [formValidity, setFormValidity] = useState<FormValidity>({
    name: false,
    description: !!config.description,
  });

  const formValid = formValidity.name && formValidity.description;

  const onValuesChange = (changedValues: { name: string } | { description: string }) => {
    const changedProp = Object.keys(changedValues)[0];

    form
      .validateFields([changedProp])
      .then(() => setFormValidity({ ...formValidity, [changedProp]: true }))
      .catch(() => setFormValidity({ ...formValidity, [changedProp]: false }));
  };

  const renameConfig = async () => {
    setRenamingState({ status: 'renaming', data: null });
    const { name, description } = form.getFieldsValue();
    const renamedConfig = await renameConfigFn(
      config,
      name.trim(),
      description.trim(),
      session as Session
    );
    setRenamingState({ status: 'success', data: renamedConfig });
  };

  const nameValidatorFn = async (_: any, name: string) => {
    const isUniq = await checkNameIfUniq(getConfigsByNameQueryFn, name.trim(), session as Session);

    if (isUniq) {
      return name;
    }

    throw new Error('Name should be unique');
  };

  const newNameValidatorFn = async (_: any, name: string) => {
    if (name.trim() !== config.name) return name;

    throw new Error('Name should be different from the original');
  };

  const renameComplete = () => {
    if (renamingState.status === 'success') onRenameSuccess();
    onClose();
  };

  useEffect(() => {
    form.validateFields();
  }, [form]);

  if (renamingState.status !== 'success') {
    return (
      <>
        <div className="flex flex-col items-start justify-start gap-y-3">
          <div className="inline-flex items-center gap-x-2">
            <FileTextOutlined className="text-primary-8" />
            <h2 className="text-2xl font-bold text-primary-8">Edit configuration</h2>
          </div>
          <p className="text-primary-8">
            You are about to edit this configuration. Please give it a new name and start working on
            it.
          </p>
        </div>
        <Form
          className="mt-8"
          form={form}
          layout="vertical"
          autoComplete="off"
          onValuesChange={onValuesChange}
          validateTrigger={false}
          preserve={false}
          initialValues={{
            name: config.name,
            description: config.description,
          }}
        >
          <Form.Item
            id="name"
            name="name"
            label={<span className="text-base font-bold text-primary-8">Name</span>}
            validateFirst
            rules={[
              { required: true, message: 'Please define a name' },
              { validator: newNameValidatorFn },
              { validator: nameValidatorFn },
            ]}
          >
            <Input
              className="mt-2 rounded-none !focus:shadow-none border-0 border-b border-primary-8 text-xl"
              placeholder="Name your configuration..."
            />
          </Form.Item>
          <Form.Item
            id="description"
            name="description"
            label={<span className="text-base font-bold text-primary-8">Description</span>}
            rules={[{ required: true, message: 'Please define a description' }]}
          >
            <Input.TextArea
              rows={3}
              className="mt-2 !focus:shadow-none border border-neutral-3 rounded-sm text-base"
              placeholder="Write your description here..."
            />
          </Form.Item>

          <div className="text-right mt-8 mr-[-34px]">
            <Button
              onClick={onClose}
              className="py-6 px-5 shadow-none rounded-none inline-flex items-center justify-center border-none"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="ml-2 bg-primary-8 py-6 px-8 rounded-none inline-flex items-center justify-center"
              disabled={!formValid}
              onClick={renameConfig}
              loading={renamingState.status === 'renaming'}
            >
              Save
            </Button>
          </div>
        </Form>
      </>
    );
  }

  return <RenameConfigSuccess name={form.getFieldsValue().name} renameComplete={renameComplete} />;
}

export default function useRenameConfigModal<T extends SupportedConfigListTypes>(
  renameConfigFn: RenameConfigFnType<T>,
  getConfigsByNameQueryFn: GetConfigsByNameQueryFnType
) {
  const [modal, contextHolder] = Modal.useModal();
  const destroyRef = useRef<() => void>();

  const onClose = () => destroyRef?.current?.();

  const createModal = (config: T, onRenameSuccess: () => void) => {
    const { destroy } = modal.confirm({
      title: null,
      icon: null,
      closable: true,
      maskClosable: true,
      footer: null,
      width: 680,
      centered: true,
      mask: true,
      maskStyle: { background: '#002766' },
      bodyStyle: { padding: '60px 40px 20px' },
      closeIcon: <CloseOutlined className="text-primary-8 text-2xl" />,
      className: '![&>.ant-modal-content]:bg-red-500',
      content: (
        <RenameConfigForm<T>
          config={config}
          onClose={onClose}
          onRenameSuccess={onRenameSuccess}
          renameConfigFn={renameConfigFn}
          getConfigsByNameQueryFn={getConfigsByNameQueryFn}
        />
      ),
    });

    destroyRef.current = destroy;

    return destroy;
  };

  return {
    createModal,
    contextHolder: <ConfigProvider theme={modalTheme}>{contextHolder}</ConfigProvider>,
  };
}
