import { useEffect, useState, useRef, useMemo } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Modal, Form, Input, Button, ConfigProvider } from 'antd';
import debounce from 'lodash/debounce';

import { checkNameIfUniq } from '@/api/nexus';
import { SupportedConfigListTypes } from '@/types/nexus';

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

type CloneConfigFnType<T> = (
  configId: string,
  name: string,
  description: string,
  session: Session
) => Promise<T>;

interface CloneConfigFormProps<T extends SupportedConfigListTypes> {
  config: T;
  onCloneSuccess: (clonedConfig: T) => void;
  onClose: () => void;
  cloneConfigFn: CloneConfigFnType<T>;
}

function CloneConfigForm<T extends SupportedConfigListTypes>({
  config,
  onCloneSuccess,
  onClose,
  cloneConfigFn,
}: CloneConfigFormProps<T>) {
  const { data: session } = useSession();
  const [form] = Form.useForm();

  const [cloning, setCloning] = useState<boolean>(false);
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
    setCloning(true);
    const { name, description } = form.getFieldsValue();
    const clonedConfig = await cloneConfigFn(config['@id'], name, description, session as Session);
    onClose();
    onCloneSuccess(clonedConfig);
  };

  const nameValidatorFn = async (_: any, name: string) => {
    const isUniq = await checkNameIfUniq(name.trim(), session as Session);

    if (isUniq) {
      return name;
    }

    throw new Error('Name should be unique');
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
        rules={[
          { required: true, message: 'Please define a name' },
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
          onClick={cloneConfig}
          loading={cloning}
        >
          Start editing
        </Button>
      </div>
    </Form>
  );
}

export default function useCloneConfigModal<T extends SupportedConfigListTypes>(
  cloneConfigFn: CloneConfigFnType<T>
) {
  const [modal, contextHolder] = Modal.useModal();
  const destroyRef = useRef<() => void>();

  const onClose = () => destroyRef?.current?.();

  const createModal = (config: T, onCloneSuccess: (clonedConfig: T) => void) => {
    const { destroy } = modal.confirm({
      title: 'Edit configuration',
      icon: null,
      closable: true,
      maskClosable: true,
      footer: null,
      width: 480,
      content: (
        <>
          <p className="mt-8">
            Duplicate the original configuration. Give it a new name and start working on your own
            configuration.
          </p>

          <CloneConfigForm<T>
            config={config}
            onClose={onClose}
            onCloneSuccess={onCloneSuccess}
            cloneConfigFn={cloneConfigFn}
          />
        </>
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
