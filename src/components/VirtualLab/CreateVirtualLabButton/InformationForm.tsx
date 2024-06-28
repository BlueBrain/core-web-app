import { Button, ConfigProvider, Form, Input } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { Step, VirtualLabWithOptionalId } from './types';

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

  const onFinish = (values: LabFormValues) => {
    setVirtualLabFn((currentVl) => ({
      ...currentVl,
      name: values.name,
      description: values.description,
      reference_email: values.email,
      entity: values.entity,
    }));
    setStepFn('Plans');
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
        initialValues={{
          name: currentVirtualLab.name,
          description: currentVirtualLab.description,
          email: currentVirtualLab.reference_email,
          entity: currentVirtualLab.entity,
        }}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="VIRTUAL LAB'S NAME"
          rules={[
            {
              required: true,
              message: "Please input the virtual lab's name!",
            },
            {
              max: 80,
              message: "Virtual lab's name cannot exceed 80 characters!",
            },
          ]}
        >
          <Input placeholder="Enter virtual lab's name" variant="borderless" />
        </Form.Item>

        <Form.Item name="description" label="DESCRIPTION">
          <TextArea placeholder="Enter description" rows={4} variant="borderless" />
        </Form.Item>

        <Form.Item
          name="email"
          label="ADMINISTRATOR'S EMAIL"
          rules={[
            {
              required: true,
              message: "Please input the administrator's email!",
            },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
          ]}
        >
          <Input placeholder="Enter administrator's email" variant="borderless" />
        </Form.Item>

        <Form.Item
          name="entity"
          label="ENTITY"
          rules={[
            {
              required: true,
              message: 'Please input an entity name',
            },
          ]}
        >
          <Input placeholder="Enter entity name" variant="borderless" />
        </Form.Item>

        <div className="flex flex-row justify-end gap-2">
          <Button type="text" className="min-w-36 text-primary-8" onClick={() => closeModalFn()}>
            Cancel
          </Button>
          <Button
            htmlType="submit"
            className="min-w-36 rounded-none border-primary-8 text-primary-8"
          >
            Next
          </Button>
        </div>
      </Form>
    </ConfigProvider>
  );
}
