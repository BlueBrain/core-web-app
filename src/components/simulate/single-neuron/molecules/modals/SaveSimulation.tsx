import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { Button, Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { label } from '../Label';
import { SimulationType } from '@/types/simulation/common';
import { createSingleNeuronSimulationAtom } from '@/state/simulate/single-neuron-setter';

import GenericButton from '@/components/Global/GenericButton';
import useNotification from '@/hooks/notifications';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { to64 } from '@/util/common';
import { CREATE_SYNAPTOME_SIMULATION_WARNING } from '@/components/build-section/virtual-lab/synaptome/molecules/constants';
import { queryAtom } from '@/state/explore-section/list-view-atoms';
import { DataType } from '@/constants/explore-section/list-views';
import { ExploreDataScope } from '@/types/explore-section/application';

export type Props = {
  name: string;
  description: string;
  modelSelfUrl: string;
  vLabId: string;
  projectId: string;
  simulationType: SimulationType;
  onClose?: () => void;
};
export default function SaveSimulationModal({
  name,
  description,
  modelSelfUrl,
  vLabId,
  projectId,
  simulationType,
  onClose,
}: Props) {
  const form = Form.useFormInstance();
  const { push: navigate } = useRouter();
  const refreshSynaptomeSimulations = useSetAtom(
    queryAtom({
      dataType: DataType.SingleNeuronSynaptomeSimulation,
      dataScope: ExploreDataScope.NoScope,
      virtualLabInfo: { virtualLabId: vLabId, projectId },
    })
  );

  const [loading, setLoading] = useState(false);
  const createSingleNeuronSimulation = useSetAtom(createSingleNeuronSimulationAtom);
  const { error: errorNotify, success: successNotify, warning: warningNotify } = useNotification();

  const [{ name: formName, description: formDescription }, setBasicConfig] = useState<{
    name: string;
    description: string;
  }>(() => ({
    name,
    description,
  }));

  const generateSimulationDetailUrl = (simulationId: string) => {
    const vlProjectUrl = generateVlProjectUrl(vLabId, projectId);
    const baseBuildUrl = `${vlProjectUrl}/simulate/synaptome-simulation/view`;
    return `${baseBuildUrl}/${to64(`${vLabId}/${projectId}!/!${simulationId}`)}`;
  };

  const saveSimulation = async () => {
    try {
      setLoading(true);
      const savedSimulation = await createSingleNeuronSimulation(
        formName,
        formDescription,
        modelSelfUrl,
        vLabId,
        projectId,
        simulationType
      );
      form.setFieldValue('name', formName);
      form.setFieldValue('description', formDescription);
      warningNotify(CREATE_SYNAPTOME_SIMULATION_WARNING, 6, 'topRight', undefined);
      successNotify('Simulation results saved successfully.', undefined, 'topRight');
      refreshSynaptomeSimulations();
      navigate(generateSimulationDetailUrl(savedSimulation!['@id']));
    } catch (error) {
      errorNotify('Un error encountered when saving simulation', undefined, 'topRight');
    } finally {
      onClose?.();
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col py-5 pl-10 pr-5">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div className="flex w-3/4 flex-col gap-3">
          <h2 className="text-3xl font-extrabold text-primary-8">Save simulation experiment</h2>
          <p className="text-base font-light text-primary-8">
            Please confirm the name and description for your simulation. This will help you organize
            and find your experiments later.
          </p>
        </div>
        <CloseOutlined className="text-2xl text-primary-8" onClick={onClose} />
      </div>
      <div>
        <div className="mb-2">{label('name', 'secondary')}</div>
        <Form.Item
          rules={[{ required: true, message: 'Please provide a name!' }]}
          validateTrigger="onBlur"
        >
          <Input
            placeholder="Simulation name"
            size="large"
            value={formName}
            defaultValue={formName}
            onChange={(e) => {
              setBasicConfig((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
            className="rounded-none border-0 !border-b border-neutral-3 !font-bold  !text-primary-8"
          />
        </Form.Item>
        <div className="mb-2">{label('Description', 'secondary')}</div>
        <Form.Item>
          <Input.TextArea
            rows={5}
            placeholder="Your description"
            size="large"
            className="rounded-none border border-neutral-3 p-2 !font-bold !text-primary-8"
            value={formDescription}
            defaultValue={formDescription}
            onChange={(e) => {
              setBasicConfig((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
          />
        </Form.Item>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button type="text" onClick={onClose}>
          Cancel
        </Button>
        <GenericButton
          text="Save"
          htmlType="button"
          className="w-max bg-primary-8 text-white"
          disabled={loading}
          loading={loading}
          onClick={saveSimulation}
        />
      </div>
    </div>
  );
}
