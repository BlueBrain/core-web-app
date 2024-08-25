'use client';

import { useState, useRef } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { useSetAtom } from 'jotai';
import { createSingleNeuronSimulationAtom } from '@/state/simulate/single-neuron-setter';
import { SimulationType } from '@/types/simulation/common';
import CloneIcon from '@/components/icons/Clone';
import useNotification from '@/hooks/notifications';

type Props = {
  onClose: () => void;
  modelSelfUrl: string;
  vLabId: string;
  projectId: string;
  type: SimulationType;
};

function ModalContent({ onClose, modelSelfUrl, projectId, vLabId, type }: Props) {
  const createSingleNeuronSimulation = useSetAtom(createSingleNeuronSimulationAtom);
  const [formValid, setFormValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { success: successNotify, error: errorNotify } = useNotification();

  const saveSimulation = async () => {
    try {
      setIsSaving(true);
      const title = form.getFieldValue('name');
      const description = form.getFieldValue('description');
      await createSingleNeuronSimulation(title, description, modelSelfUrl, vLabId, projectId, type);
      successNotify('Simulation results saved successfully.', undefined, 'topRight');
    } catch (error) {
      errorNotify('Un error encountered when saving simulation', undefined, 'topRight');
    } finally {
      setIsSaving(false);
      onClose();
    }
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
        <p className="font-light text-primary-8">
          Store the current state of your simulation, including input parameters, <br /> simulation
          results, and any generated plots or data.
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
            htmlType="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-none border-none px-5 py-6 shadow-none"
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
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

export function useSaveSimulationModal({
  modelSelfUrl,
  vLabId,
  projectId,
  type,
}: {
  modelSelfUrl: string;
  vLabId: string;
  projectId: string;
  type: SimulationType;
}) {
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
      content: (
        <ModalContent
          onClose={onClose}
          modelSelfUrl={modelSelfUrl}
          vLabId={vLabId}
          projectId={projectId}
          type={type}
        />
      ),
    });
    destroyRef.current = destroy;
    return destroy;
  }

  return {
    createModal,
    contextHolder,
  };
}