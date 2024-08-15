import { useAtom, useAtomValue } from 'jotai';
import { Button, Form } from 'antd';

import SynapseSimulationForm from './SynapseSimulationForm';
import { useSynaptomeSimulationConfig } from '@/state/simulate/categories';
import { SynaptomeSimulationInstanceAtom } from '@/state/simulate/categories/simulation-model';
import { synaptomeSimulationConfigAtom } from '@/state/simulate/categories/synaptome-simulation-config';
import { SynapseConfig, UpdateSynapseSimulationProperty } from '@/types/simulation/single-neuron';

export default function SynapseSimulationFormsGroup() {
  const { newConfig, remove: removeSynapseConfig } = useSynaptomeSimulationConfig();
  const [synapseSimulationAtomState, setSynapseSimState] = useAtom(synaptomeSimulationConfigAtom);

  const { configuration: synaptomeModel } = useAtomValue(SynaptomeSimulationInstanceAtom);

  const placementConfigForForm = (simFormIndex: string) => {
    const simConfigForForm = synapseSimulationAtomState.find(
      (config: SynapseConfig) => config.id === simFormIndex
    );
    const placementConfig = synaptomeModel?.synapses.find(
      (s) => s.id === simConfigForForm?.synapseId
    );
    return placementConfig;
  };

  const setAtomProperty = (change: UpdateSynapseSimulationProperty) => {
    setSynapseSimState(
      synapseSimulationAtomState.map((s) =>
        s.id === change.id ? { ...s, [change.key]: change.newValue } : s
      )
    );
  };

  if (!synaptomeModel) {
    return null;
  }

  return (
    <Form.List name="synapses">
      {(fields, { add, remove }) => (
        <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
          {fields.map((field) => (
            <SynapseSimulationForm
              key={`${field.name}`}
              synaptomeModelConfig={synaptomeModel}
              formName={`${field.name}`}
              selectedSynapseGroupPlacementConfig={placementConfigForForm(`${field.name}`)}
              removeForm={() => {
                remove(field.name);
                removeSynapseConfig(field.name);
              }}
              onChange={setAtomProperty}
            />
          ))}
          <Button
            className="m-2 ml-auto w-max bg-green-600 text-white"
            type="primary"
            onClick={() => {
              add();
              if (synaptomeModel?.synapses) {
                newConfig(synaptomeModel.synapses);
              }
            }}
          >
            + Add Synapse Configuration
          </Button>
        </div>
      )}
    </Form.List>
  );
}
