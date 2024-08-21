import { Button, ConfigProvider, Form, Input } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import { Step, VirtualLabWithOptionalId } from './types';
import { useAtom } from '@/state/state';

import styles from './InformationForm.module.css';

const { TextArea } = Input;

type InformationFormProps = {
  currentVirtualLab: VirtualLabWithOptionalId;
  closeModalFn: () => void;
  setStepFn: Dispatch<SetStateAction<Step>>;
  setVirtualLabFn: Dispatch<SetStateAction<VirtualLabWithOptionalId>>;
};

type LabFormValues = {
  name: string;
  description: string;
  email: string;
  entity: string;
};

export default function InformationForm({
  currentVirtualLab,
  closeModalFn,
  setStepFn,
  setVirtualLabFn,
}: InformationFormProps) {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useAtom<boolean>('new-vlab-modal-form-valid');

  const onValuesChange = () => {
    form
      .validateFields()
      .then(() => {
        setIsFormValid(true);
      })
      .catch((error) => {
        if (error.errorFields.length > 0) {
          setIsFormValid(false);
        } else {
          setIsFormValid(true);
        }
      });
  };

  const onFinish = (values: LabFormValues) => {
    setVirtualLabFn((currentVl) => ({
      ...currentVl,
      name: values.name,
      description: values.description,
      reference_email: values.email,
      entity: values.entity,
    }));
    setStepFn('Members');
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelColor: '#595959',
          },
          Input: {
            colorText: '#003A8C',
          },
        },
      }}
    >
      <Form
        form={form}
        className="my-5"
        name="lab_form"
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        initialValues={{
          name: currentVirtualLab.name,
          description: currentVirtualLab.description,
          email: currentVirtualLab.reference_email,
          entity: currentVirtualLab.entity,
        }}
        requiredMark={false}
      >
        <div className="flex flex-col gap-4">
          <Form.Item
            name="name"
            label="VIRTUAL LAB'S NAME"
            rules={[
              {
                required: true,
                message: "Please enter the virtual lab's name.",
              },
              {
                max: 80,
                message: 'Virtual lab name cannot exceed 80 characters!',
              },
            ]}
          >
            <Input placeholder="Enter virtual lab's name" className={styles.input} />
          </Form.Item>

          <Form.Item
            name="description"
            label="DESCRIPTION"
            required={false}
            rules={[
              {
                max: 600,
                message: 'Virtual lab description cannot exceed 600 characters!',
              },
            ]}
          >
            <TextArea placeholder="Enter description" rows={4} className={styles.textArea} />
          </Form.Item>

          <Form.Item
            name="email"
            label="ADMINISTRATOR'S EMAIL"
            rules={[
              {
                required: true,
                message: "Please enter the administrator's email address.",
              },
              {
                type: 'email',
                message: 'Please check and enter a valid email address.',
              },
            ]}
          >
            <Input placeholder="Enter administrator's email" className={styles.input} />
          </Form.Item>

          <Form.Item
            name="entity"
            label="ENTITY"
            rules={[
              {
                required: true,
                message: 'Please enter an entity name.',
              },
            ]}
          >
            <Input placeholder="Enter entity name" className={styles.input} />
          </Form.Item>
        </div>
        <div className="flex flex-row justify-end gap-2">
          <Button
            type="text"
            className="min-w-36 text-primary-8"
            onClick={() => {
              form.resetFields();
              closeModalFn();
            }}
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            className="min-w-36 rounded-none border-primary-8 text-primary-8"
            disabled={!isFormValid}
          >
            Next
          </Button>
        </div>
      </Form>
    </ConfigProvider>
  );
}
