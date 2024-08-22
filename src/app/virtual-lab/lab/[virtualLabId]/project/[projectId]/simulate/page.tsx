'use client';

import { useAtomValue } from 'jotai';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import GenericButton from '@/components/Global/GenericButton';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { SimulationScopeToDataType } from '@/types/virtual-lab/lab';
import { ExploreDataScope } from '@/types/explore-section/application';
import { DataType } from '@/constants/explore-section/list-views';
import Link from '@/components/Link';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import ScopeSelector from '@/components/VirtualLab/ScopeSelector';
import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';

type TabDetails = {
  title: string;
};

const SupportedTypeToTabDetails: Record<string, TabDetails> = {
  [DataType.SingleNeuronSimulation]: {
    title: 'Single Neuron Simulation',
  },
  [DataType.SingleNeuronSynaptomeSimulation]: {
    title: 'Single Neuron Synaptome Simulation',
  },
};

export default function VirtualLabProjectSimulatePage({
  params,
}: {
  params: { virtualLabId: string; projectId: string };
}) {
  const selectedSimulationScope = useAtomValue(selectedSimulationScopeAtom);

  const simulationType =
    selectedSimulationScope && selectedSimulationScope in SimulationScopeToDataType
      ? SimulationScopeToDataType[selectedSimulationScope]
      : null;

  const tabDetails = simulationType && SupportedTypeToTabDetails[simulationType];

  const selectedRows = useAtomValue(
    selectedRowsAtom({ dataType: simulationType ?? DataType.CircuitMEModel })
  );

  return (
    <div className="flex min-h-full w-full flex-col gap-5 pr-5 pt-8">
      <VirtualLabTopMenu />
      <ScopeSelector />
      {simulationType && tabDetails ? (
        <div className="flex h-full flex-col">
          <div className="flex justify-between">
            <GenericButton
              text={tabDetails.title}
              className="bg-white text-2xl font-bold text-primary-8"
            />
            <Link
              className="flex h-12 items-center rounded-none bg-primary-6 px-8 text-white shadow-none"
              href="simulate/new"
            >
              New simulation +
            </Link>
          </div>
          <div id="explore-table-container-for-observable" className="h-full w-full pb-5">
            <ExploreSectionListingView
              dataType={simulationType}
              dataScope={ExploreDataScope.SelectedBrainRegion}
              virtualLabInfo={{ virtualLabId: params.virtualLabId, projectId: params.projectId }}
              selectionType="radio"
              renderButton={() => null}
              tableScrollable={false}
              controlsVisible={false}
            />
          </div>
          {selectedRows.length > 0 && (
            <div className="fixed bottom-3 right-[60px] mb-6 flex items-center justify-end gap-2">
              <GenericButton disabled className="bg-white" text="Clone configuration" />
              <GenericButton disabled className="bg-white" text="View" />
            </div>
          )}
        </div>
      ) : (
        <div className="m-auto w-fit border p-6">Coming Soon</div>
      )}
    </div>
  );
}
