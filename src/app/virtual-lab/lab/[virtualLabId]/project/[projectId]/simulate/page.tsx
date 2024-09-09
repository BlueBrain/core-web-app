'use client';

import { useAtomValue } from 'jotai';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import GenericButton from '@/components/Global/GenericButton';
import Link from '@/components/Link';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import ScopeSelector from '@/components/VirtualLab/ScopeSelector';

import { selectedSimulationScopeAtom } from '@/state/simulate';
import { SimulationScopeToDataType } from '@/types/virtual-lab/lab';
import { ExploreDataScope } from '@/types/explore-section/application';
import { DataType } from '@/constants/explore-section/list-views';
import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { to64 } from '@/util/common';
import { ExploreESHit, ExploreResource } from '@/types/explore-section/es';

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
  const { push: navigate } = useRouter();

  const selectedSimulationScope = useAtomValue(selectedSimulationScopeAtom);

  const simulationType =
    selectedSimulationScope && selectedSimulationScope in SimulationScopeToDataType
      ? SimulationScopeToDataType[selectedSimulationScope]
      : null;

  const tabDetails = simulationType && SupportedTypeToTabDetails[simulationType];

  const selectedRows = useAtomValue(
    selectedRowsAtom({ dataType: simulationType ?? DataType.CircuitMEModel })
  );

  const generateSynaptomeDetailUrl = (selectedRow: ExploreESHit<ExploreResource>) => {
    const { virtualLabId, projectId } = params;
    const vlProjectUrl = generateVlProjectUrl(virtualLabId, projectId);
    const baseBuildUrl = `${vlProjectUrl}/simulate/synaptome-simulation/view`;
    return `${baseBuildUrl}/${to64(`${virtualLabId}/${projectId}!/!${selectedRow._id}`)}`;
  };

  const onViewRow = (selectedRow: ExploreESHit<ExploreResource>) => {
    // TODO: Handle single neuron simulation resource also
    if (simulationType !== DataType.SingleNeuronSynaptomeSimulation) {
      return;
    }
    navigate(generateSynaptomeDetailUrl(selectedRow));
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-5 pr-5 pt-8">
      <VirtualLabTopMenu />
      <ScopeSelector />
      {simulationType && tabDetails ? (
        <div className="flex w-full grow flex-col">
          <div className="flex justify-between">
            <GenericButton
              text={tabDetails.title}
              className="bg-white text-2xl font-bold text-primary-8"
            />
            <Link
              className="flex h-12 items-center gap-2 rounded-none bg-primary-6 px-8 text-white shadow-none"
              href="simulate/new"
            >
              <span>New simulation</span> <PlusOutlined />
            </Link>
          </div>
          <div
            id="explore-table-container-for-observable"
            className="mb-5 flex h-full w-full flex-col overflow-x-auto"
          >
            <ExploreSectionListingView
              dataType={simulationType}
              dataScope={ExploreDataScope.SelectedBrainRegion}
              virtualLabInfo={{ virtualLabId: params.virtualLabId, projectId: params.projectId }}
              selectionType="radio"
              renderButton={() => null}
              tableScrollable={false}
              controlsVisible={false}
              style={{ background: 'bg-white' }}
              containerClass="flex flex-col grow"
              tableClass="overflow-y-auto grow"
            />
          </div>
          {selectedRows.length > 0 && (
            <div className="fixed bottom-3 right-[60px] mb-6 flex items-center justify-end gap-2">
              <GenericButton disabled className="bg-white" text="Clone configuration" />
              <GenericButton
                className="bg-white"
                text="View"
                onClick={() => onViewRow(selectedRows[0])}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="m-auto w-fit border p-6">Coming Soon</div>
      )}
    </div>
  );
}
