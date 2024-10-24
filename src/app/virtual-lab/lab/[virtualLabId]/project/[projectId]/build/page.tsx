'use client';

import { HTMLProps, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { to64 } from '@/util/common';
import { MODEL_DATA_TYPES } from '@/constants/explore-section/data-types/model-data-types';
import { ExploreDataScope } from '@/types/explore-section/application';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { SimulationScopeToModelType, SimulationType } from '@/types/virtual-lab/lab';
import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import ScopeSelector from '@/components/VirtualLab/ScopeSelector';
import BookmarkButton from '@/components/explore-section/BookmarkButton';
import GenericButton from '@/components/Global/GenericButton';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { isModel } from '@/types/virtual-lab/bookmark';
import { classNames } from '@/util/utils';
import Styles from '@/styles/vlabs.module.scss';

type Params = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

type TabDetails = {
  title: string;
  buildModelLabel: string;
  newUrl: string;
  viewUrl: string;
};

const SupportedTypeToTabDetails: Record<string, TabDetails> = {
  [DataType.CircuitMEModel]: {
    title: 'Single neuron model',
    buildModelLabel: 'New model',
    newUrl: 'build/me-model/new',
    viewUrl: 'explore/interactive/model/me-model',
  },
  [DataType.SingleNeuronSynaptome]: {
    title: 'Synaptome',
    buildModelLabel: 'New synaptome model',
    newUrl: 'build/synaptome/new',
    viewUrl: 'explore/interactive/model/synaptome',
  },
};

export default function VirtualLabProjectBuildPage({ params }: Params) {
  const router = useRouter();
  const selectedSimulationScope = useAtomValue(selectedSimulationScopeAtom);
  const [selectedModelType, setSelectedModelType] = useState<DataType | null>();
  const selectedRows = useAtomValue(
    selectedRowsAtom({ dataType: selectedModelType ?? DataType.CircuitMEModel })
  );

  useEffect(() => {
    if (selectedSimulationScope && selectedSimulationScope in SimulationScopeToModelType) {
      setSelectedModelType(SimulationScopeToModelType[selectedSimulationScope]);
    } else {
      setSelectedModelType(null);
    }
  }, [selectedSimulationScope]);

  // Note: Disabled temporarily until SFN
  // const generateCloneUrl = () => {
  //   const model = selectedRows[0];
  //   if (model && selectedModelType) {
  //     const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
  //     const baseBuildUrl = `${vlProjectUrl}/${SupportedTypeToTabDetails[selectedModelType].newUrl}`;
  //     return `${baseBuildUrl}?mode=clone&model=${to64(model._source['@id'])}`;
  //   }
  // };

  const tabDetails = selectedModelType && SupportedTypeToTabDetails[selectedModelType];

  const onNewModel = () => {
    switch (selectedSimulationScope) {
      case SimulationType.SingleNeuron: {
        if (tabDetails) {
          return router.push(tabDetails.newUrl);
        }
        break;
      }
      case SimulationType.Synaptome: {
        if (tabDetails) {
          return router.push(tabDetails.newUrl);
        }
        break;
      }
      default:
        return null;
    }
  };

  // const onCloneModel = () => {
  //   switch (selectedSimulationScope) {
  //     case SimulationType.Synaptome: {
  //       return generateCloneUrl();
  //     }
  //     default:
  //       return undefined;
  //   }
  // };

  const navigateToDetailPage = (
    basePath: string,
    record: ExploreESHit<ExploreSectionResource>,
    dataType: DataType
  ) => {
    switch (selectedSimulationScope) {
      case SimulationType.SingleNeuron:
      case SimulationType.Synaptome: {
        const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
        const pathId = `${to64(`${record._source.project.label}!/!${record._id}`)}`;
        const baseExploreUrl = `${vlProjectUrl}/${SupportedTypeToTabDetails[dataType].viewUrl}`;
        router.push(`${baseExploreUrl}/${pathId}`);
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
      {selectedModelType && tabDetails ? (
        <div className="flex grow flex-col">
          <div className="flex justify-between">
            <GenericButton
              text={tabDetails.title}
              className="w-96 bg-white text-2xl font-bold text-primary-8"
            />
            <Button
              className="h-12 rounded-none border-none bg-primary-6 px-8 text-white shadow-none"
              onClick={onNewModel}
              icon={<PlusOutlined />}
            >
              {tabDetails.buildModelLabel}
            </Button>
          </div>
          <div
            id="explore-table-container-for-observable"
            className="mb-5 flex w-full grow flex-col"
          >
            <ExploreSectionListingView
              tableScrollable={false}
              controlsVisible={false}
              dataType={selectedModelType ?? DataType.CircuitMEModel}
              dataScope={ExploreDataScope.NoScope}
              virtualLabInfo={{ virtualLabId: params.virtualLabId, projectId: params.projectId }}
              selectionType="radio"
              style={{ background: 'bg-white' }}
              containerClass="grow bg-primary-9 flex flex-col"
              tableClass={classNames('grow', Styles.table)}
              onCellClick={navigateToDetailPage}
            />

            {selectedRows.length > 0 && (
              <div className="fixed bottom-3 right-[60px] mb-6 flex items-center justify-end gap-2">
                {isModel(MODEL_DATA_TYPES[selectedModelType].name) && (
                  <BookmarkButton
                    virtualLabId={params.virtualLabId}
                    projectId={params.projectId}
                    // `selectedRows` will be an array with only one element because `selectionType` is a radio button not a checkbox.
                    resourceId={selectedRows[0]?._source['@id']}
                    type={MODEL_DATA_TYPES[selectedModelType].name}
                    customButton={customBookmarkButton}
                  />
                )}
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

function customBookmarkButton({ onClick, children }: HTMLProps<HTMLButtonElement>) {
  return (
    <Btn className="h-12 bg-secondary-2 px-8" onClick={onClick}>
      {children}
    </Btn>
  );
}
