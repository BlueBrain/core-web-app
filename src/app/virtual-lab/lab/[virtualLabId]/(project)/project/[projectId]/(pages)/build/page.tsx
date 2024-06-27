'use client';

import { HTMLProps } from 'react';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import ScopeCarousel from '@/components/VirtualLab/ScopeCarousel';
import { DataType } from '@/constants/explore-section/list-views';
import { Btn } from '@/components/Btn';
import GenericButton from '@/components/Global/GenericButton';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { detailUrlBuilder } from '@/util/common';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { ExploreESHit } from '@/types/explore-section/es';
import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import BookmarkButton from '@/components/explore-section/BookmarkButton';

type Params = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function VirtualLabProjectBuildPage({ params }: Params) {
  const generateDetailUrl = (model: ExploreESHit<ExploreSectionResource>) => {
    const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
    const baseBuildUrl = `${vlProjectUrl}/build/me-model/view`;
    return `${detailUrlBuilder(baseBuildUrl, model)}`;
  };

  return (
    <div className="flex h-full flex-col gap-10 pt-14">
      <ScopeCarousel />
      <div className="flex h-full flex-col">
        <div className="flex justify-between">
          <GenericButton text="ME-Models" className="bg-white text-2xl font-bold text-primary-8" />
          <GenericButton
            text="New model ＋"
            className="bg-primary-6 text-white"
            href="build/me-model/new/morphology/reconstructed"
          />
        </div>
        <div id="explore-table-container-for-observable" className="h-screen">
          <ExploreSectionListingView
            dataType={DataType.CircuitMEModel}
            brainRegionSource="selected"
            selectionType="radio"
            enableDownload
            renderButton={({ selectedRows }) => (
              <div className="mr-5 flex items-center justify-end gap-2">
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
                  customButtom={customBookmarkButton}
                />
              </div>
            )}
          />
        </div>
      </div>
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
