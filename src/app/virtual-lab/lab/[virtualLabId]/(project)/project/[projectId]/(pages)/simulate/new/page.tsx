'use client';

import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';

import GenericButton from '@/components/Global/GenericButton';
import { ServerSideComponentProp } from '@/types/common';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import { singleNeuronSelfUrlAtom } from '@/state/simulate/single-neuron';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

export default function VirtualLabProjectSimulateNewPage({
  params: { virtualLabId, projectId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const setSingleNeuronSelfUrl = useSetAtom(singleNeuronSelfUrlAtom);
  const router = useRouter();

  const onModelSelected = (model: ExploreESHit<ExploreSectionResource>) => {
    setSingleNeuronSelfUrl(model._source._self);
    router.push('/simulate/single-neuron/edit');
  };

  const simulatePage = `${generateVlProjectUrl(virtualLabId, projectId)}/simulate`;

  return (
    <div className="flex flex-col pt-14">
      <div className="flex justify-between align-middle">
        <div className="text-2xl font-bold text-white">Create new simulation</div>
        <GenericButton text="Cancel" className="text-white hover:text-white" href={simulatePage} />
      </div>
      {/* TODO: replace this list with items saved in Model Library */}
      <div className="h-[70vh]" id="explore-table-container-for-observable">
        <ExploreSectionListingView
          dataType={DataType.CircuitMEModel}
          brainRegionSource="selected"
          selectionType="radio"
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
