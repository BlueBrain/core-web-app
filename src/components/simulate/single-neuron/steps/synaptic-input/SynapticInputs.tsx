import { useAtom, useAtomValue } from 'jotai';
import { Form } from 'antd';

import SynapticInputItem from './SynapticInputItem';
import { useSynaptomeSimulationConfig } from '@/state/simulate/categories';

import { SynaptomeSimulationInstanceAtom } from '@/state/simulate/categories/simulation-model';
import { synaptomeSimulationConfigAtom } from '@/state/simulate/categories/synaptome-simulation-config';
import { SynapseConfig, UpdateSynapseSimulationProperty } from '@/types/simulation/single-neuron';
import { synapsesPlacementAtom } from '@/state/synaptome';
import { sendRemoveSynapses3DEvent } from '@/components/neuron-viewer/hooks/events';
import { classNames } from '@/util/utils';
import { SingleSynaptomeConfig } from '@/types/synaptome';

export default function SynapticInputs() {
  const { newConfig, remove: removeSynapseConfig } = useSynaptomeSimulationConfig();
  const [synapseSimulationAtomState, setSynapseSimState] = useAtom(synaptomeSimulationConfigAtom);
  const { configuration: synaptomeModel } = useAtomValue(SynaptomeSimulationInstanceAtom);
  const visualizedSynaptomes = useAtomValue(synapsesPlacementAtom);

  const placementConfigForForm = (simFormIndex: number): SingleSynaptomeConfig | undefined => {
    const simConfigForForm = synapseSimulationAtomState.find(
      (_: SynapseConfig, ind) => ind === simFormIndex
    );
    return synaptomeModel?.synapses.find((s) => s.id === simConfigForForm?.id);
  };
  const setAtomProperty = ({ id, key, newValue }: UpdateSynapseSimulationProperty) => {
    let color = placementConfigForForm(id)?.color!;
    if (key === 'id') {
      color = synaptomeModel?.synapses.find(
        (sc: SingleSynaptomeConfig) => sc.id === newValue
      )?.color!;
    }
    setSynapseSimState(
      synapseSimulationAtomState.map((s, ind) =>
        ind === id
          ? {
              ...s,
              [key]: newValue,
              color,
            }
          : s
      )
    );
  };

  if (!synaptomeModel) {
    return null;
  }

  return (
    <Form.List name="synapses">
      {(fields, { remove }) => (
        <div className="flex flex-col items-start justify-start gap-4">
          {fields.map((field) => {
            return (
              <SynapticInputItem
                key={`${field.name}`}
                index={field.name}
                synaptomeModelConfig={synaptomeModel}
                formName={`${field.name}`}
                selectedSynapticInputPlacementConfig={placementConfigForForm(field.name)!}
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
            );
          })}
          <button
            className={classNames(
              'mt-2 w-max border border-primary-8 px-6 py-4 text-lg font-bold text-primary-8',
              'hover:border-neutral-4 hover:bg-neutral-4 hover:text-white'
            )}
            type="button"
            onClick={() => {
              if (synaptomeModel?.synapses.length) {
                newConfig(synaptomeModel.synapses);
              }
            }}
          >
            Add synaptic input
          </button>
        </div>
      )}
    </Form.List>
  );
}
