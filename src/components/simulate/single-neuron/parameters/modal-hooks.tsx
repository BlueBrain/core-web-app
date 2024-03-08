'use client';

import { useState, useRef } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { useSetAtom } from 'jotai';
import CloneIcon from '@/components/icons/Clone';
import { createSingleNeuronSimulationAtom } from '@/state/simulate/single-neuron-setter';

function ModalContent({ onClose }: { onClose: () => void }) {
  const createSingleNeuronSimulation = useSetAtom(createSingleNeuronSimulationAtom);
  const [formValid, setFormValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveSimulation = async () => {
    setIsSaving(true);
    const title = form.getFieldValue('name');
    const description = form.getFieldValue('description');
    await createSingleNeuronSimulation(title, description);
    setIsSaving(false);
  };

  const [form] = Form.useForm();

  const onValuesChange = () => {
    form
      .validateFields()
      .then(() => {
        setFormValid(true);
      })
      .catch(() => {
        setFormValid(false);
      });
  };

  return (
    <>
      <div className="flex flex-col items-start justify-start gap-y-3">
        <div className="inline-flex items-center gap-x-2">
          <CloneIcon className="text-primary-8" />
          <h2 className="text-2xl font-bold text-primary-8">Save simulation experiment</h2>
        </div>
        <p className="text-primary-8">Save simulation experiment.</p>
      </div>
      <Form
        className="mt-8"
        form={form}
        layout="vertical"
        autoComplete="off"
        onValuesChange={onValuesChange}
        validateTrigger={false}
        preserve={false}
      >
        <Form.Item
          id="name"
          name="name"
          label={<span className="text-base font-bold text-primary-8">Name</span>}
          rules={[{ required: true, message: 'Please define a name' }]}
        >
          <Input
            className="!focus:shadow-none mt-2 rounded-none border-0 border-b border-primary-8 text-xl"
            placeholder="Name your single model experiment..."
          />
        </Form.Item>
        <Form.Item
          id="description"
          name="description"
          label={<span className="text-base font-bold text-primary-8">Description</span>}
          rules={[{ required: true, message: 'Please define a description' }]}
        >
          <Input
            className="!focus:shadow-none mt-2 rounded-none border-0 border-b border-primary-8 text-xl"
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
            onClick={saveSimulation}
            loading={isSaving}
          >
            Save
          </Button>
        </div>
      </Form>
    </>
  );
}

export function useSaveSimulationModal() {
  const [modal, contextHolder] = Modal.useModal();
  const destroyRef = useRef<() => void>();
  const onClose = () => destroyRef?.current?.();

  function createModal() {
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
      content: <ModalContent onClose={onClose} />,
    });
    destroyRef.current = destroy;
    return destroy;
  }

  return {
    createModal,
    contextHolder,
  };
}
