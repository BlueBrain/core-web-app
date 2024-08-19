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

export default function VirtualLabProjectSimulateNewPage({
  params: { virtualLabId, projectId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const selectedSimulationScope = useAtomValue(selectedSimulationScopeAtom);
  const router = useRouter();

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
    <div className="flex flex-col pt-14">
      <div className="flex justify-between align-middle">
        <div className="text-2xl font-bold text-white">
          Select a single neuron model to simulate
        </div>
        <GenericButton text="Cancel" className="text-white hover:text-white" href={simulatePage} />
      </div>
      {/* TODO: replace this list with items saved in Model Library */}
      <div className="h-[70vh]" id="explore-table-container-for-observable">
        <ExploreSectionListingView
          dataType={modelType ?? DataType.CircuitMEModel}
          dataScope={ExploreDataScope.SelectedBrainRegion}
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
