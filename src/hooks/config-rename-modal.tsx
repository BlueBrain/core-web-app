import { useEffect, useState, useRef } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Modal, Form, Input, Button, ConfigProvider } from 'antd';

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

interface RenameConfigFormProps<T> {
  config: T;
  onRenameSuccess: () => void;
  onClose: () => void;
  renameConfigFn: RenameConfigFnType<T>;
}

function RenameConfigForm<T extends SupportedConfigListTypes>({
  config,
  onRenameSuccess,
  onClose,
  renameConfigFn,
}: RenameConfigFormProps<T>) {
  const { data: session } = useSession();
  const [form] = Form.useForm();

  const [renaming, setRenaming] = useState<boolean>(false);
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
    setRenaming(true);
    const { name, description } = form.getFieldsValue();
    await renameConfigFn(config, name.trim(), description.trim(), session as Session);
    onClose();
    onRenameSuccess();
  };

  const nameValidatorFn = async (_: any, name: string) => {
    const isUniq = await checkNameIfUniq(name.trim(), session as Session);

    if (isUniq) {
      return name;
    }

    throw new Error('Name should be unique');
  };

  const newNameValidatorFn = async (_: any, name: string) => {
    if (name.trim() !== config.name) return name;

    throw new Error('Name should be different from the original');
  };

  useEffect(() => {
    form.validateFields();
  }, [form]);

  return (
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
        name="name"
        label="Name"
        validateFirst
        rules={[
          { required: true, message: 'Please define a name' },
          { validator: newNameValidatorFn },
          { validator: nameValidatorFn },
        ]}
      >
        <Input className="mt-2" placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please define a description' }]}
      >
        <Input className="mt-2" placeholder="Description" />
      </Form.Item>

      <div className="text-right mt-8 mr-[-34px]">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          className="ml-2"
          disabled={!formValid}
          onClick={renameConfig}
          loading={renaming}
        >
          Rename
        </Button>
      </div>
    </Form>
  );
}

export default function useRenameConfigModal<T extends SupportedConfigListTypes>(
  renameConfigFn: RenameConfigFnType<T>
) {
  const [modal, contextHolder] = Modal.useModal();
  const destroyRef = useRef<() => void>();

  const onClose = () => destroyRef?.current?.();

  const createModal = (config: T, onRenameSuccess: () => void) => {
    const { destroy } = modal.confirm({
      title: 'Rename configuration',
      icon: null,
      closable: true,
      maskClosable: true,
      footer: null,
      width: 480,
      content: (
        <RenameConfigForm<T>
          config={config}
          onClose={onClose}
          onRenameSuccess={onRenameSuccess}
          renameConfigFn={renameConfigFn}
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
