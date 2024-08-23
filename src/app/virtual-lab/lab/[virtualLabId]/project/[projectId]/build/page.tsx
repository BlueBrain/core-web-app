'use client';

import { HTMLProps, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { detailUrlBuilder } from '@/util/common';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import { ExploreDataScope } from '@/types/explore-section/application';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { SimulationScopeToModelType, SimulationType } from '@/types/virtual-lab/lab';
import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import ScopeSelector from '@/components/VirtualLab/ScopeSelector';
import BookmarkButton from '@/components/explore-section/BookmarkButton';
import GenericButton from '@/components/Global/GenericButton';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';

type Params = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

type TabDetails = {
  title: string;
  buildModelLabel: string;
  url: string;
};

const SupportedTypeToTabDetails: Record<string, TabDetails> = {
  [DataType.CircuitMEModel]: {
    title: 'Single neuron model',
    buildModelLabel: 'New model',
    url: 'build/me-model/new',
  },
  [DataType.SingleNeuronSynaptome]: {
    title: 'Single neuron synaptome',
    buildModelLabel: 'New synaptome model',
    url: 'build/synaptome/new',
  },
};

export default function VirtualLabProjectBuildPage({ params }: Params) {
  const router = useRouter();
  const selectedSimulationScope = useAtomValue(selectedSimulationScopeAtom);
  const [selectedModelType, setSelectedModelType] = useState<DataType | null>();

  useEffect(() => {
    if (selectedSimulationScope && selectedSimulationScope in SimulationScopeToModelType) {
      setSelectedModelType(SimulationScopeToModelType[selectedSimulationScope]);
    } else {
      setSelectedModelType(null);
    }
  }, [selectedSimulationScope]);

  const generateDetailUrl = (model: ExploreESHit<ExploreSectionResource>) => {
    const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
    const baseBuildUrl = `${vlProjectUrl}/build/me-model/view`;
    return `${detailUrlBuilder(baseBuildUrl, model)}`;
  };

  const generateSynaptomeUrl = (model: ExploreESHit<ExploreSectionResource>) => {
    const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
    const baseBuildUrl = `${vlProjectUrl}/build/synaptome`;
    return `${detailUrlBuilder(baseBuildUrl, model)}`;
  };

  const tabDetails = selectedModelType && SupportedTypeToTabDetails[selectedModelType];

  const selectedRows = useAtomValue(
    selectedRowsAtom({ dataType: selectedModelType ?? DataType.CircuitMEModel })
  );

  const onNewModel = () => {
    switch (selectedSimulationScope) {
      case SimulationType.SingleNeuron: {
        if (tabDetails) {
          return router.push(tabDetails.url);
        }
        break;
      }
      case SimulationType.Synaptome: {
        if (tabDetails) {
          return router.push(tabDetails.url);
        }
        break;
      }
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-5 pr-5 pt-8">
      <VirtualLabTopMenu />
      <ScopeSelector />
      {selectedModelType && tabDetails ? (
        <div className="flex h-full flex-col">
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
            className="h-[calc(100vh-320px)] w-full pb-5"
          >
            <ExploreSectionListingView
              tableScrollable
              controlsVisible={false}
              dataType={selectedModelType ?? DataType.CircuitMEModel}
              dataScope={ExploreDataScope.SelectedBrainRegion}
              virtualLabInfo={{ virtualLabId: params.virtualLabId, projectId: params.projectId }}
              selectionType="radio"
              style={{ background: 'bg-white' }}
            />

            {selectedRows.length > 0 && (
              <div className="fixed bottom-3 right-[60px] mb-6 flex items-center justify-end gap-2">
                <GenericButton
                  text="View model"
                  className="bg-primary-9  text-white hover:!bg-primary-7"
                  href={generateDetailUrl(selectedRows[0])}
                />
                <GenericButton
                  text="Clone model"
                  className="bg-primary-9  text-white hover:!bg-primary-7"
                  href={generateSynaptomeUrl(selectedRows[0])}
                />
                <BookmarkButton
                  virtualLabId={params.virtualLabId}
                  projectId={params.projectId}
                  // `selectedRows` will be an array with only one element because `selectionType` is a radio button not a checkbox.
                  resourceId={selectedRows[0]?._source['@id']}
                  type={ModelTypeNames.ME_MODEL}
                  customButton={customBookmarkButton}
                />
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
