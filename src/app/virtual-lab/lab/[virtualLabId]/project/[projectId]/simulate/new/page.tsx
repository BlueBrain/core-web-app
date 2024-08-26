'use client';

import { useRouter } from 'next/navigation';
import { useSetAtom, useAtomValue } from 'jotai';

import GenericButton from '@/components/Global/GenericButton';
import { ServerSideComponentProp } from '@/types/common';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import { singleNeuronAtom } from '@/state/simulate/single-neuron';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { ExploreDataScope } from '@/types/explore-section/application';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { SimulationScopeToModelType } from '@/types/virtual-lab/lab';

export default function VirtualLabProjectSimulateNewPage({
  params: { virtualLabId, projectId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const selectedSimulationScope = useAtomValue(selectedSimulationScopeAtom);
  const setSingleNeuron = useSetAtom(singleNeuronAtom);
  const router = useRouter();

  const simulatePage = `${generateVlProjectUrl(virtualLabId, projectId)}/simulate`;

  const modelType =
    selectedSimulationScope && selectedSimulationScope in SimulationScopeToModelType
      ? SimulationScopeToModelType[selectedSimulationScope]
      : null;

  const onModelSelected = (model: ExploreESHit<ExploreSectionResource>) => {
    setSingleNeuron({
      self: model._source._self,
      type: modelType ?? DataType.CircuitMEModel,
      source: {
        ...model._source,
        ...(modelType === DataType.SingleNeuronSynaptome && {
          synapses: [{ id: '1' }, { id: '2' }], // TODO: When synaptome model is ready synapses should be correctly populated.
        }),
      },
    });
    router.push(`${generateVlProjectUrl(virtualLabId, projectId)}/simulate/single-neuron/edit`);
  };

  return (
    <div className="flex flex-col pt-14 pr-10">
      <div className="flex justify-between align-middle">
        <div className="text-2xl font-bold text-white">Create a new simulation</div>
        <GenericButton text="Cancel" className="text-white hover:text-white" href={simulatePage} />
      </div>
      {/* TODO: replace this list with items saved in Model Library */}
      <div id="explore-table-container-for-observable" className="h-full mb-5 overflow-hidden">
        <div className="bg-white pl-5 pt-5 text-lg text-primary-8">
          
          Select a single neuron model to simulate{' '}
        </div>
        <ExploreSectionListingView
          dataType={modelType ?? DataType.CircuitMEModel}
          dataScope={ExploreDataScope.SelectedBrainRegion}
          virtualLabInfo={{ virtualLabId, projectId }}
          selectionType="radio"
          tableScrollable={false}
          renderButton={({ selectedRows }) => (
            <Btn
              className="fit-content sticky bottom-0 ml-auto w-fit bg-secondary-2"
              // as we use radio button instead of checkbox, we have a single model to pass
              onClick={() => onModelSelected(selectedRows[0])}
            >
              New Simulation
            </Btn>
          )}
        />
      </div>
    </div>
  );
}
