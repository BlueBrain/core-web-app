'use client';

import { useAtomValue } from 'jotai';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

import { HTMLProps } from 'react';
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
import { SupportedTypeToTabDetails } from '@/types/simulation/common';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import BookmarkButton from '@/components/explore-section/BookmarkButton';
import { SIMULATION_DATA_TYPES } from '@/constants/explore-section/data-types/simulation-data-types';
import { isSimulation } from '@/types/virtual-lab/bookmark';
import { Btn } from '@/components/Btn';
import { classNames } from '@/util/utils';
import Styles from '@/styles/vlabs.module.scss';

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

  const generateDetailUrl = (selectedRow: ExploreESHit<ExploreResource>, type: DataType) => {
    const { virtualLabId, projectId } = params;
    const vlProjectUrl = generateVlProjectUrl(virtualLabId, projectId);
    const baseBuildUrl = `${vlProjectUrl}/explore/simulate/${SupportedTypeToTabDetails[type].urlParam}/view`;
    return `${baseBuildUrl}/${to64(`${virtualLabId}/${projectId}!/!${selectedRow._id}`)}`;
  };

  const navigateToDetailPage = (
    basePath: string,
    record: ExploreESHit<ExploreSectionResource>,
    dataType: DataType
  ) => {
    switch (dataType) {
      case DataType.SingleNeuronSimulation:
      case DataType.SingleNeuronSynaptomeSimulation: {
        navigate(generateDetailUrl(record, dataType));
        break;
      }
      default:
        break;
    }
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
              dataScope={ExploreDataScope.NoScope}
              virtualLabInfo={{ virtualLabId: params.virtualLabId, projectId: params.projectId }}
              selectionType="radio"
              renderButton={() => null}
              tableScrollable={false}
              controlsVisible={false}
              style={{ background: 'bg-white' }}
              containerClass="flex flex-col grow"
              tableClass={classNames('overflow-y-auto grow', Styles.table)}
              onCellClick={navigateToDetailPage}
            />
          </div>
          {selectedRows.length > 0 && (
            <div className="fixed bottom-3 right-[60px] mb-6 flex items-center justify-end gap-2">
              {isSimulation(SIMULATION_DATA_TYPES[simulationType].name) && (
                <BookmarkButton
                  virtualLabId={params.virtualLabId}
                  projectId={params.projectId}
                  // `selectedRows` will be an array with only one element because `selectionType` is a radio button not a checkbox.
                  resourceId={selectedRows[0]?._source['@id']}
                  type={SIMULATION_DATA_TYPES[simulationType].name}
                  customButton={customBookmarkButton}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="m-auto w-fit border p-6">Coming Soon</div>
      )}
    </div>
  );
}

function customBookmarkButton({ onClick, children }: HTMLProps<HTMLButtonElement>) {
  return (
    <Btn className="h-12 bg-secondary-2 px-8" onClick={onClick}>
      {children}
    </Btn>
  );
}
