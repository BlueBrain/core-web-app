import { useAtom, useAtomValue } from 'jotai';
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import SynapseSimulationForm from './SynapticInputItem';
import { useSynaptomeSimulationConfig } from '@/state/simulate/categories';
import { SynaptomeSimulationInstanceAtom } from '@/state/simulate/categories/simulation-model';
import { synaptomeSimulationConfigAtom } from '@/state/simulate/categories/synaptome-simulation-config';
import { SynapseConfig, UpdateSynapseSimulationProperty } from '@/types/simulation/single-neuron';
import { synapsesPlacementAtom } from '@/state/synaptome';
import { sendRemoveSynapses3DEvent } from '@/components/neuron-viewer/events';

export default function SynapseSimulationFormsGroup() {
  const { newConfig, remove: removeSynapseConfig } = useSynaptomeSimulationConfig();
  const [synapseSimulationAtomState, setSynapseSimState] = useAtom(synaptomeSimulationConfigAtom);
  const visualizedSynaptomes = useAtomValue(synapsesPlacementAtom);

  const { configuration: synaptomeModel } = useAtomValue(SynaptomeSimulationInstanceAtom);

  const placementConfigForForm = (simFormIndex: number) => {
    const simConfigForForm = synapseSimulationAtomState.find(
      (config: SynapseConfig) => config.key === simFormIndex
    );
    const placementConfig = synaptomeModel?.synapses.find((s) => s.id === simConfigForForm?.id);
    return placementConfig;
  };

  const setAtomProperty = (change: UpdateSynapseSimulationProperty) => {
    setSynapseSimState(
      synapseSimulationAtomState.map((s) =>
        s.key === change.id ? { ...s, [change.key]: change.newValue } : s
      )
    );
  };

  if (!synaptomeModel) {
    return null;
  }

  return (
    <Form.List name="synapses">
      {(fields, { add, remove }) => (
        <div className="flex flex-col gap-4">
          {fields.map((field) => (
            <SynapseSimulationForm
              key={`${field.name}`}
              index={field.name}
              synaptomeModelConfig={synaptomeModel}
              formName={`${field.name}`}
              selectedSynapseGroupPlacementConfig={placementConfigForForm(field.name)}
              removeForm={() => {
                remove(field.name);
                removeSynapseConfig(field.name);
                const formName = `${field.name}`;
                const meshForForm = visualizedSynaptomes?.[formName]?.meshId;
                if (meshForForm) {
                  sendRemoveSynapses3DEvent(formName, meshForForm);
                }
              }}
              onChange={setAtomProperty}
            />
          ))}
          <Button
            className="m-2 ml-auto w-max bg-green-600 text-white"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              add();
              if (synaptomeModel?.synapses) {
                newConfig(synaptomeModel.synapses);
              }
            }}
          >
            Add Synapses Configuration
          </Button>
        </div>
      )}
    </Form.List>
  );
}
