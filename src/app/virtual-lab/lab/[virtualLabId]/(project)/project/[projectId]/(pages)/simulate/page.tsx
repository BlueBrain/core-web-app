'use client';

import { useAtomValue } from 'jotai';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import GenericButton from '@/components/Global/GenericButton';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { SimulationScopeToDataType } from '@/types/virtual-lab/lab';
import { ExploreDataScope } from '@/types/explore-section/application';

export default function VirtualLabProjectSimulatePage({
  params,
}: {
  params: { virtualLabId: string; projectId: string };
}) {
  const selectedSimulationScope = useAtomValue(selectedSimulationScopeAtom);

  const dataType =
    selectedSimulationScope && selectedSimulationScope in SimulationScopeToDataType
      ? SimulationScopeToDataType[selectedSimulationScope]
      : null;

  return (
    <div className="flex h-full flex-col pt-14">
      {!dataType ? (
        <div className="m-auto w-fit border p-6">Coming Soon</div>
      ) : (
        <>
          <div className="flex justify-between">
            <GenericButton
              text="Single neuron simulations"
              className="bg-white text-2xl font-bold text-primary-8"
            />
            <GenericButton
              text="New simulation ＋"
              className="bg-primary-6 text-white"
              href="simulate/new"
            />
          </div>
          <div id="explore-table-container-for-observable" className="h-screen">
            <ExploreSectionListingView
              dataType={dataType}
              dataScope={ExploreDataScope.SelectedBrainRegion}
              virtualLabInfo={{ virtualLabId: params.virtualLabId, projectId: params.projectId }}
              selectionType="radio"
              renderButton={() => (
                <div className="mr-5 flex items-center justify-end gap-2">
                  <GenericButton disabled className="bg-slate-400" text="View simulation" />
                  <GenericButton disabled className="bg-slate-400" text="New simulation" />
                </div>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}
