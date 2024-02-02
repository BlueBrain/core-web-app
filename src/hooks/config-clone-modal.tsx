import { useEffect, useState, useRef, useMemo } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Modal, Form, Input, Button, ConfigProvider, ThemeConfig } from 'antd';
import debounce from 'lodash/debounce';
import { CheckCircleFilled, CloseOutlined } from '@ant-design/icons';

import CloneIcon from '@/components/icons/Clone';
import { checkNameIfUniq } from '@/api/nexus';
import { SupportedConfigListTypes } from '@/types/nexus';

const modalTheme: ThemeConfig = {
  token: {
    colorBgBase: 'white',
    colorTextBase: 'black',
  },
  hashed: false,
};

type FormValidity = {
  name: boolean;
  description: boolean;
};

type CloneConfigFnType<T> = (
  configId: string,
  name: string,
  description: string,
  session: Session
) => Promise<T>;

type GetConfigByNameQueryFnType = (name: string) => Object;
interface CloneConfigFormProps<T extends SupportedConfigListTypes> {
  config: T;
  onCloneSuccess: (clonedConfig: T) => void;
  onClose: () => void;
  cloneConfigFn: CloneConfigFnType<T>;
  getConfigByNameQueryFn: GetConfigByNameQueryFnType;
}

function CloneConfigSuccess({ name, startEditing }: { name: string; startEditing: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <CheckCircleFilled style={{ fontSize: '5rem', color: '#00B212' }} />
      <div className="w-full" style={{ padding: '.75rem 0 3.75rem' }}>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-base text-primary-8">
            You have successfully clone the configuration. Your cloned configuration
          </p>
          <h2 className="text-2xl font-bold text-primary-8">{name}</h2>
          <p className="text-base text-primary-8">is ready to use.</p>
        </div>
      </div>
      <Button
        type="primary"
        className="ml-2 inline-flex items-center justify-center rounded-none bg-primary-9 px-8 py-6"
        onClick={startEditing}
      >
        Start editing
      </Button>
    </div>
  );
}

function CloneConfig<T extends SupportedConfigListTypes>({
  config,
  onCloneSuccess,
  onClose,
  cloneConfigFn,
  getConfigByNameQueryFn,
}: CloneConfigFormProps<T>) {
  const { data: session } = useSession();
  const [form] = Form.useForm();

  const [cloningState, setCloningState] = useState<
    { status: 'stale' | 'cloning'; data: null } | { status: 'success'; data: T }
  >({ status: 'stale', data: null });

  const [formValidity, setFormValidity] = useState<FormValidity>({
    name: false,
    description: !!config.description,
  });

  const formValid = formValidity.name && formValidity.description;

  const onValuesChange = useMemo(
    () =>
      debounce((changedValues: { name: string } | { description: string }) => {
        const changedProp = Object.keys(changedValues)[0];
        form
          .validateFields([changedProp])
          .then(() => setFormValidity({ ...formValidity, [changedProp]: true }))
          .catch(() => setFormValidity({ ...formValidity, [changedProp]: false }));
      }, 300),
    [form, formValidity]
  );

  const cloneConfig = async () => {
    setCloningState({ status: 'cloning', data: null });
    const { name, description } = form.getFieldsValue();
    const clonedConfig = await cloneConfigFn(config['@id'], name, description, session as Session);
    setCloningState({ status: 'success', data: clonedConfig });
  };

  const startEditing = () => {
    if (cloningState.status === 'success') onCloneSuccess(cloningState.data);
    onClose();
  };

  const nameValidatorFn = async (_: any, name: string) => {
    const isUniq = await checkNameIfUniq(getConfigByNameQueryFn, name.trim(), session as Session);

    if (isUniq) {
      return name;
    }

    throw new Error('Name should be unique');
  };

  useEffect(() => {
    form.validateFields();
  }, [form]);

  if (cloningState.status !== 'success')
    return (
      <>
        <div className="flex flex-col items-start justify-start gap-y-3">
          <div className="inline-flex items-center gap-x-2">
            <CloneIcon className="text-primary-8" />
            <h2 className="text-2xl font-bold text-primary-8">Clone configuration</h2>
          </div>
          <p className="text-primary-8">
            You are about to clone this configuration. You can now give it a new name and start
            working on it.
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
            rules={[
              { required: true, message: 'Please define a name' },
              { validator: nameValidatorFn },
            ]}
          >
            <Input
              className="!focus:shadow-none mt-2 rounded-none border-0 border-b border-primary-8 text-xl"
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
              className="!focus:shadow-none mt-2 rounded-sm border border-neutral-3 text-base"
              placeholder="Write your description here..."
            />
          </Form.Item>

          <div className="mr-[-34px] mt-8 text-right">
            <Button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-none border-none px-5 py-6 shadow-none"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="ml-2 inline-flex items-center justify-center rounded-none bg-primary-8 px-8 py-6"
              disabled={!formValid}
              onClick={cloneConfig}
              loading={cloningState.status === 'cloning'}
            >
              Save
            </Button>
          </div>
        </Form>
      </>
    );

  return (
    <CloneConfigSuccess
      name={cloningState.data.name ?? form.getFieldsValue().name}
      startEditing={startEditing}
    />
  );
}

export default function useCloneConfigModal<T extends SupportedConfigListTypes>(
  cloneConfigFn: CloneConfigFnType<T>,
  getConfigByNameQueryFn: GetConfigByNameQueryFnType
) {
  const [modal, contextHolder] = Modal.useModal();
  const destroyRef = useRef<() => void>();
  const onClose = () => destroyRef?.current?.();

  const createModal = (config: T, onCloneSuccess: (clonedConfig: T) => void) => {
    const { destroy } = modal.confirm({
      title: null,
      icon: null,
      closable: true,
      maskClosable: true,
      footer: null,
      width: 680,
      centered: true,
      mask: true,
      styles: {
        mask: { background: '#002766' },
        body: { padding: '60px 40px 20px' },
      },
      closeIcon: <CloseOutlined className="text-2xl text-primary-8" />,
      className: '![&>.ant-modal-content]:bg-red-500',
      content: (
        <CloneConfig<T>
          config={config}
          onClose={onClose}
          onCloneSuccess={onCloneSuccess}
          cloneConfigFn={cloneConfigFn}
          getConfigByNameQueryFn={getConfigByNameQueryFn}
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
