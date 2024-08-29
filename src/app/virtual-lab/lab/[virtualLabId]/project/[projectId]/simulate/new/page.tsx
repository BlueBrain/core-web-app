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
import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';
import { classNames } from '@/util/utils';

export default function NewSimulation({
  params: { virtualLabId, projectId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const router = useRouter();
  const selectedSimulationScope = useAtomValue(selectedSimulationScopeAtom);

  const simulatePage = `${generateVlProjectUrl(virtualLabId, projectId)}/simulate`;
  const modelType = SimulationScopeToModelType[selectedSimulationScope];

  const onModelSelected = (model: ExploreESHit<ExploreSectionResource>) => {
    const vlProjectUrl = generateVlProjectUrl(virtualLabId, projectId);
    const simulateType = flatMap(ensureArray(model._source['@type']), (type) =>
      find(DataTypeToNexusType, (value) => value === type)
    ).at(0);
    if (simulateType) {
      const simulatePagePath = DataTypeToNewSimulationPage[simulateType];
      if (simulatePagePath) {
        const baseBuildUrl = `${vlProjectUrl}/simulate/${simulatePagePath}/new`;
        router.push(`${detailUrlBuilder(baseBuildUrl, model)}`);
      }
    }
  };

  const selectedRows = useAtomValue(
    selectedRowsAtom({ dataType: modelType ?? DataType.SingleNeuronSimulation })
  );

  return (
    <div
      className={classNames('flex min-h-screen w-full flex-col pr-5 pt-8', !modelType && 'h-full')}
    >
      <div className="mb-5 flex flex-col gap-5">
        <VirtualLabTopMenu />
        <ScopeSelector />
      </div>

      {modelType ? (
        <div className="flex grow flex-col">
          <div className="flex justify-between align-middle">
            <div className="bg-white px-5 py-2 text-2xl font-bold text-primary-8 ">
              Create a simulation
            </div>
            <GenericButton
              text="Cancel"
              className="text-white hover:text-white"
              href={simulatePage}
            />
          </div>
          <div className="flex grow flex-col">
            {/* TODO: replace this list with items saved in Model Library */}
            <div className="flex w-full grow flex-col" id="explore-table-container-for-observable">
              <div className="bg-white pl-5 pt-5 text-lg text-primary-8">
                {`Select a ${selectedSimulationScope.replace('-', ' ')} model to simulate`}
              </div>
              <ExploreSectionListingView
                containerClass="grow bg-primary-9 flex flex-col"
                tableClass="grow mb-5"
                tableScrollable={false}
                controlsVisible={false}
                dataType={modelType}
                dataScope={ExploreDataScope.NoScope}
                virtualLabInfo={{ virtualLabId, projectId }}
                selectionType="radio"
                renderButton={() => null}
              />
            </div>

            {selectedRows.length > 0 && (
              <div className="fixed bottom-3 right-[60px] mb-6 flex items-center justify-end gap-2">
                <Btn
                  className="bg-primary-9  text-white hover:!bg-primary-7"
                  onClick={() => onModelSelected(selectedRows[0])}
                >
                  New Simulation
                </Btn>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="m-auto w-fit border p-6">Coming Soon</div>
      )}
    </div>
  );
}
