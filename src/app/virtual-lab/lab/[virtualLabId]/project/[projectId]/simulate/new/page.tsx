'use client';

import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import find from 'lodash/find';
import flatMap from 'lodash/flatMap';

import { ServerSideComponentProp } from '@/types/common';
import {
  DataType,
  DataTypeToNewSimulationPage,
  DataTypeToNexusType,
} from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { ExploreDataScope } from '@/types/explore-section/application';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { SimulationScopeToModelType } from '@/types/virtual-lab/lab';
import { detailUrlBuilder } from '@/util/common';
import { ensureArray } from '@/util/nexus';

import GenericButton from '@/components/Global/GenericButton';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import ScopeSelector from '@/components/VirtualLab/ScopeSelector';

export default function NewSimulation({
  params: { virtualLabId, projectId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const router = useRouter();
  const selectedSimulationScope = useAtomValue(selectedSimulationScopeAtom);

  const simulatePage = `${generateVlProjectUrl(virtualLabId, projectId)}/simulate`;

  const modelType =
    selectedSimulationScope && selectedSimulationScope in SimulationScopeToModelType
      ? SimulationScopeToModelType[selectedSimulationScope]
      : null;

  const onModelSelected = (model: ExploreESHit<ExploreSectionResource>) => {
    const vlProjectUrl = generateVlProjectUrl(virtualLabId, projectId);
    const simulateType = flatMap(ensureArray(model._source['@type']), (type) =>
      find(DataTypeToNexusType, (value) => value === type)
    ).at(0);
    if (simulateType) {
      const simulatePagePath = DataTypeToNewSimulationPage[simulateType];
      if (simulatePagePath) {
        const baseBuildUrl = `${vlProjectUrl}/simulate/${simulatePagePath}/edit`;
        router.push(`${detailUrlBuilder(baseBuildUrl, model)}`);
      }
    }
  };

  return (
    <div className="flex flex-col pt-8">
      <VirtualLabTopMenu />
      <ScopeSelector />
      <div className="flex justify-between align-middle">
        <div className="text-2xl font-bold text-white">Create a simulation</div>
        <GenericButton text="Cancel" className="text-white hover:text-white" href={simulatePage} />
      </div>
      {/* TODO: replace this list with items saved in Model Library */}
      <div className="h-[calc(100vh-290px)]" id="explore-table-container-for-observable">
        <div className="bg-white pl-5 pt-5 text-lg text-primary-8">
          Select a single neuron model to simulate
        </div>
        <ExploreSectionListingView
          dataType={modelType ?? DataType.CircuitMEModel}
          dataScope={ExploreDataScope.NoScope}
          virtualLabInfo={{ virtualLabId, projectId }}
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
