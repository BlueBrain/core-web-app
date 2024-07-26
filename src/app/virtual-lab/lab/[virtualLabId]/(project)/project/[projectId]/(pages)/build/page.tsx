'use client';

import { HTMLProps, useEffect, useState } from 'react';

import { useAtomValue } from 'jotai';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import ScopeSelector from '@/components/VirtualLab/ScopeSelector';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import GenericButton from '@/components/Global/GenericButton';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { detailUrlBuilder } from '@/util/common';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import BookmarkButton from '@/components/explore-section/BookmarkButton';
import { ExploreDataScope } from '@/types/explore-section/application';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { SimulationScopeToModelType, SimulationType } from '@/types/virtual-lab/lab';

type Params = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

type TabDetails = {
  title: string;
  buildModelLabel: string;
};

const buildMEModelLink = 'build/me-model/new/morphology/reconstructed';

const SupportedTypeToTabDetails: Record<string, TabDetails> = {
  [DataType.CircuitMEModel]: {
    title: 'Single neuron model',
    buildModelLabel: 'New model +',
  },
  [DataType.SingleNeuronSynaptome]: {
    title: 'Single neuron synaptome',
    buildModelLabel: 'New synaptome model +',
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
  return (
    <div className="flex h-full flex-col gap-6">
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
              onClick={() => {
                if (selectedSimulationScope === SimulationType.SingleNeuron) {
                  router.push(buildMEModelLink);
                } else if (selectedSimulationScope === SimulationType.Synaptome) {
                  setSelectedModelType(DataType.CircuitMEModel);
                }
              }}
            >
              {tabDetails.buildModelLabel}
            </Button>
          </div>
          <div id="explore-table-container-for-observable" className="h-screen">
            <ExploreSectionListingView
              dataType={selectedModelType ?? DataType.CircuitMEModel}
              dataScope={ExploreDataScope.SelectedBrainRegion}
              virtualLabInfo={{ virtualLabId: params.virtualLabId, projectId: params.projectId }}
              selectionType="radio"
              renderButton={({ selectedRows }) => (
                <div className="mr-5 flex items-center justify-end gap-2">
                  <GenericButton
                    text="Generate synaptome"
                    className="bg-primary-9  text-white hover:!bg-primary-7"
                    href={generateSynaptomeUrl(selectedRows[0])}
                  />
                  <GenericButton
                    text="View model"
                    className="bg-primary-9  text-white hover:!bg-primary-7"
                    href={generateDetailUrl(selectedRows[0])}
                  />
                  <BookmarkButton
                    virtualLabId={params.virtualLabId}
                    projectId={params.projectId}
                    // `selectedRows` will be an array with only one element because `selectionType` is a radio button not a checkbox.
                    resourceId={selectedRows[0]._source['@id']}
                    type={ModelTypeNames.ME_MODEL}
                    customButton={customBookmarkButton}
                  />
                </div>
              )}
            />
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
